import { NextApiHandler, NextApiRequest } from 'next'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { betaInviteValidationSchema } from '@/utils/validationSchemas'

import mailjet from '@/api/utils/mailjet'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await betaInviteValidationSchema.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  const { email, name } = req.body

  return { email, name }
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      const { email, name } = await extractPostInput(req)

      const sendCustomer = await mailjet({
        To: [{ Email: email, Name: name || 'Anonymous' }],
        Subject: 'Mission accomplished',
        TemplateID: 2682424,
        TemplateLanguage: true,
        Variables: {
          name: name,
        },
      }).then(() => {
        return {
          message:
            'Mission accomplished! You successfully requested beta access to our top secret plan!',
        }
      })

      mailjet({
        To: [{ Email: 'pssst@scrt.link', Name: 'X' }],
        Subject: 'Beta Invite',
        TextPart: `New beta invite: ${name} <${email}>`,
      })

      res.json(sendCustomer)
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(handler)
