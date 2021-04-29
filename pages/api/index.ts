import { NextApiHandler, NextApiRequest } from 'next'
import * as Yup from 'yup'
import { pick } from 'ramda'
import { AES, enc } from 'crypto-js'
import { getSession } from 'next-auth/client'
import Pusher from 'pusher'

import withDb from '@/api/middlewares/withDb'
import cors from '@/api/middlewares/cors'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { apiValidationSchemaByType } from '@/utils/validationSchemas'
import { encodeStringsForDB, decodeStringsFromDB } from '@/utils/db'
import { UserSettingsFields } from '@/api/models/UserSettings'
import mailjet, { mailjetSms } from '@/api/utils/mailjet'
import { pusherCluster } from '@/constants'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: pusherCluster,
  useTLS: true,
})

const getInputValidationSchema = Yup.object().shape({
  alias: Yup.string().label('Alias').required().trim(),
})

const extractGetInput = async (req: NextApiRequest) => {
  try {
    await getInputValidationSchema.validate(req.query)
  } catch (err) {
    throw createError(422, err.message)
  }
  const { alias } = req.query
  if (typeof alias !== 'string') {
    throw createError(422, 'Invalid URL')
  }
  return alias
}

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await apiValidationSchemaByType.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  return encodeStringsForDB(req.body)
}

const handler: NextApiHandler = async (req, res) => {
  await cors(req, res)

  const models = req.models
  const session = await getSession({ req })

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  switch (req.method) {
    case 'GET': {
      const alias = await extractGetInput(req)
      const secretUrl = await models.SecretUrl.findOneAndDelete({ alias })
      if (!secretUrl) {
        throw createError(
          404,
          `URL not found - This usually means the secret link has already been visited and therefor no longer exists.`,
        )
      }

      const { userId, secretType, isEncryptedWithUserPassword, message } = secretUrl

      // Update global stats
      await models.Stats.findOneAndUpdate(
        {},
        {
          $inc: {
            totalSecretsViewCount: 1,
            'secretsViewCount.message': Number(secretType === 'message'),
            'secretsViewCount.url': Number(secretType === 'url'),
            'secretsViewCount.neogram': Number(secretType === 'neogram'),
          },
        },
        { new: true },
      )

      // Get user specific settings connected with a secret
      let publicMeta = {} as Partial<UserSettingsFields>

      if (userId) {
        let privateMeta = {} as Pick<
          UserSettingsFields,
          'readReceipts' | 'receiptEmail' | 'receiptPhoneNumber'
        >
        const userSettingsRaw = await models.UserSettings.findOne({
          userId,
        })

        const userSettings = decodeStringsFromDB(userSettingsRaw?.toJSON()) as UserSettingsFields

        publicMeta = pick(
          ['neogramDestructionMessage', 'neogramDestructionTimeout', 'name'],
          userSettings,
        )

        privateMeta = pick(['receiptEmail', 'readReceipts', 'receiptPhoneNumber'], userSettings)

        const name = publicMeta?.name || 'Anonymous'

        switch (privateMeta?.readReceipts) {
          case 'sms': {
            mailjetSms({
              To: `+${privateMeta.receiptPhoneNumber}`,
              Text: `Your secret ${alias} has been viewed!🔥 Reply with a secret: https://scrt.link`,
            })
            break
          }
          case 'email': {
            mailjet({
              To: [{ Email: privateMeta.receiptEmail, Name: name }],
              Subject: 'Secret has been viewed 🔥',
              TemplateID: 2818166,
              TemplateLanguage: true,
              Variables: {
                name,
                alias,
              },
            })
            break
          }
        }
      }

      // Decrypt essage
      const decryptAES = (string: string) => {
        const bytes = AES.decrypt(string, `${process.env.AES_KEY_512}`)
        return bytes.toString(enc.Utf8)
      }

      res.json({
        secretType,
        message: decryptAES(message),
        isEncryptedWithUserPassword,
        meta: publicMeta,
      })
      break
    }
    case 'POST': {
      const { secretType, message, isEncryptedWithUserPassword, alias } = await extractPostInput(
        req,
      )

      // Encrypt sensitive information
      const encryptAES = (string: string) =>
        AES.encrypt(string, `${process.env.AES_KEY_512}`).toString()

      // Stats
      const stats = await models.Stats.findOneAndUpdate(
        {},
        {
          $inc: {
            totalSecretsCount: 1,
            'secretsCount.message': Number(secretType === 'message'),
            'secretsCount.url': Number(secretType === 'url'),
            'secretsCount.neogram': Number(secretType === 'neogram'),
          },
        },
        { new: true, upsert: true },
      )

      pusher.trigger(
        'stats',
        'stats-update',
        pick(['totalSecretsCount', 'secretsCount', 'totalSecretsViewCount'])(stats.toJSON()),
      )

      if (session?.userId) {
        await models.Stats.findOneAndUpdate(
          { userId: session.userId },
          {
            $inc: {
              totalSecretsCount: 1,
              'secretsCount.message': Number(secretType === 'message'),
              'secretsCount.url': Number(secretType === 'url'),
              'secretsCount.neogram': Number(secretType === 'neogram'),
            },
          },
          { new: true, upsert: true },
        )
      }

      const shortened = new models.SecretUrl({
        userId: session?.userId,
        secretType,
        message: encryptAES(message),
        alias,
        isEncryptedWithUserPassword,
      })

      await shortened.save()

      res.status(200).json({ alias, message: 'Secret saved!' })
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
