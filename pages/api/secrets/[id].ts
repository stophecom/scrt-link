import { NextApiHandler } from 'next'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import mailjet, { mailjetSms } from '@/api/utils/mailjet'
import { decryptAES } from '@/utils/db'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  const alias: string = req.query.id as string

  switch (req.method) {
    case 'DELETE': {
      if (typeof alias !== 'string') {
        throw createError(422, 'Invalid URL')
      }

      // const secretUrlRaw = await models.SecretUrl.findOneAndDelete({ alias })
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
        await mailjetSms({
          To: `+${decryptAES(receiptPhoneNumber)}`,
          Text: `Your secret ${alias} has been viewed!🔥 Reply with a secret: https://scrt.link`,
        })
      }

      if (receiptEmail) {
        await mailjet({
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
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
