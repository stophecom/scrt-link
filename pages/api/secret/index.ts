import { NextApiHandler, NextApiRequest } from 'next'
import { pick } from 'ramda'
import crawlers from 'crawler-user-agents'
import Pusher from 'pusher'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { apiValidationSchemaByType } from '@/utils/validationSchemas'
import mailjet, { mailjetSms } from '@/api/utils/mailjet'
import { pusherCluster } from '@/constants'
import { encryptAES, decryptAES } from '@/utils/db'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: pusherCluster,
  useTLS: true,
})

const extractGetInput = async (req: NextApiRequest) => {
  const { alias, userAgent } = req.query
  if (typeof alias !== 'string') {
    throw createError(422, 'Invalid URL')
  }
  if (userAgent && typeof userAgent !== 'string') {
    throw createError(422, 'User Agent not valid.')
  }
  return { alias, userAgent }
}

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await apiValidationSchemaByType.validate(req.body) // Improve
  } catch (err) {
    throw createError(422, err.message)
  }

  return req.body
}

const handler: NextApiHandler = async (req, res) => {
  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  switch (req.method) {
    case 'GET': {
      const { alias, userAgent } = await extractGetInput(req)

      if (userAgent && crawlers.some(({ pattern }) => RegExp(pattern).test(userAgent))) {
        throw createError(
          404,
          `User Agent recognised as a bot. If you think this is an error, please contact support.`,
        )
      }

      const secretUrlRaw = await models.SecretUrl.findOneAndDelete({ alias })
      if (!secretUrlRaw) {
        throw createError(
          404,
          `Secret not found - This usually means the secret link has already been visited and therefore no longer exists.`,
        )
      }

      const secretUrl = secretUrlRaw.toJSON()

      const {
        secretType,
        isEncryptedWithUserPassword,
        neogramDestructionMessage,
        neogramDestructionTimeout,
        receiptEmail,
        receiptPhoneNumber,
        message,
      } = secretUrl

      // Update global view count stats
      await models.Stats.findOneAndUpdate(
        { master: true },
        {
          $inc: {
            totalSecretsViewCount: 1,
            'secretsViewCount.text': Number(secretType === 'text'),
            'secretsViewCount.url': Number(secretType === 'url'),
            'secretsViewCount.neogram': Number(secretType === 'neogram'),
          },
        },
        { new: true },
      )

      if (receiptPhoneNumber) {
        mailjetSms({
          To: `+${decryptAES(receiptPhoneNumber)}`,
          Text: `Your secret ${alias} has been viewed!🔥 Reply with a secret: https://scrt.link`,
        })
      }

      if (receiptEmail) {
        mailjet({
          To: [{ Email: decryptAES(receiptEmail), Name: 'Scrt.link' }],
          Subject: 'Secret has been viewed 🔥',
          TemplateID: 2818166,
          TemplateLanguage: true,
          Variables: {
            alias,
          },
        })
      }

      res.json({
        secretType,
        message: decryptAES(message),
        ...(secretType === 'neogram'
          ? {
              neogramDestructionMessage: neogramDestructionMessage
                ? decryptAES(neogramDestructionMessage)
                : '',
              neogramDestructionTimeout,
            }
          : {}),

        isEncryptedWithUserPassword,
      })
      break
    }
    case 'POST': {
      const {
        secretType,
        message,
        isEncryptedWithUserPassword,
        alias,
        receiptEmail,
        receiptPhoneNumber,
        neogramDestructionMessage,
        neogramDestructionTimeout,
      } = await extractPostInput(req)

      // Update global stats
      const stats = await models.Stats.findOneAndUpdate(
        { master: true },
        {
          $inc: {
            totalSecretsCount: 1,
            'secretsCount.text': Number(secretType === 'text'),
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

      const shortened = new models.SecretUrl({
        secretType,
        message: encryptAES(message),
        alias,
        neogramDestructionMessage: encryptAES(neogramDestructionMessage),
        neogramDestructionTimeout,
        isEncryptedWithUserPassword,
        ...(receiptEmail ? { receiptEmail: encryptAES(receiptEmail) } : {}),
        ...(receiptPhoneNumber ? { receiptPhoneNumber: encryptAES(receiptPhoneNumber) } : {}),
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
