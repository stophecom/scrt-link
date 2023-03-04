import { NextApiHandler } from 'next'
import NextCors from 'nextjs-cors'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import mailjet from '@/api/utils/mailjet'
import { twilioSms } from '@/api/utils/twilio'
import { decryptAES } from '@/utils/db'

import { getLocaleFromRequest } from '@/api/utils/helpers'
import { mailjetTemplates, ntfyTemplates, smsReadReceipt } from '@/constants'

const handler: NextApiHandler = async (req, res) => {
  const locale = getLocaleFromRequest(req)
  const mailTemplate = mailjetTemplates.readReceipt[locale]
  const ntfyTemplate = ntfyTemplates.readReceipt[locale]
  const smsTemplate = smsReadReceipt[locale]

  // Run the middleware
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'DELETE'],
    origin: '*',
  })

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

      const secretUrlRaw = await models.SecretUrl.findOneAndDelete({ alias })

      if (!secretUrlRaw) {
        throw createError(
          404,
          `Secret not found - This usually means the secret link has already been visited and therefore no longer exists.`,
          'API_SECRET_NOT_FOUND',
        )
      }

      const secretUrl = secretUrlRaw.toJSON()

      const {
        secretType,
        isEncryptedWithUserPassword,
        neogramDestructionMessage,
        neogramDestructionTimeout,
        receiptApi,
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
        await twilioSms({
          to: `+${decryptAES(receiptPhoneNumber)}`,
          body: `${smsTemplate.receipt} ${alias}\n\n${smsTemplate.reply}`,
        }).catch(console.error)
      }

      if (receiptEmail) {
        await mailjet({
          To: [{ Email: decryptAES(receiptEmail), Name: 'scrt.link' }],
          Subject: mailTemplate.subject,
          TemplateID: mailTemplate.templateId,
          TemplateLanguage: true,
          Variables: {
            alias,
          },
        }).catch(console.error)
      }

      if (receiptApi?.ntfy) {
        await fetch(`https://ntfy.sh/${receiptApi.ntfy}`, {
          method: 'POST', // PUT works too
          body: `${ntfyTemplate.receipt} ${alias}`,
          headers: {
            Title: ntfyTemplate.subject,
            Priority: 'urgent',
            Tags: 'fire',
          },
        }).catch(console.error)
      }

      // Here we send receiptId to slack app endpoint. See https://gitlab.com/kingchiller/scrt-link-slack for more info.
      if (receiptApi?.slack) {
        await fetch(`${process.env.SLACK_APP_API_URL}/receipts`, {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.SLACK_APP_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ receiptId: receiptApi.slack }),
        }).catch(console.error)
      }

      res.json({
        secretType,
        message: message && decryptAES(message),
        isEncryptedWithUserPassword,
        ...(secretType === 'neogram'
          ? {
              neogramDestructionMessage: neogramDestructionMessage
                ? decryptAES(neogramDestructionMessage)
                : '',
              neogramDestructionTimeout,
            }
          : {}),
      })
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
