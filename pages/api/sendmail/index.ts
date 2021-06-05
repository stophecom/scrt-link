import { NextApiHandler, NextApiRequest } from 'next'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { shareSecretViaEmailSchema } from '@/utils/validationSchemas'
import mailjet from '@/api/utils/mailjet'

import { getSession } from 'next-auth/client'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await shareSecretViaEmailSchema.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  return req.body
}

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  const session = await getSession({ req })

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }
  if (!session) {
    throw createError(405, 'Not allowed. You need to be signed in!')
  }

  switch (req.method) {
    case 'POST': {
      const { secretUrl, message, recepientEmail, recepientName = '' } = await extractPostInput(req)

      mailjet({
        To: [{ Email: recepientEmail, Name: recepientName }],
        Subject: 'You received a secret ',
        TemplateID: 2939535,
        TemplateLanguage: true,
        Variables: {
          secretUrl,
          message,
          name: recepientName,
        },
      })

      res.json({ message: 'Email successfully sent!' })
      break
    }

    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
