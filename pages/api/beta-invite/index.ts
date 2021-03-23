import { NextApiHandler, NextApiRequest } from 'next'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { betaInviteValidationSchema } from '@/utils/validationSchemas'

import nodemailer from 'nodemailer'

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

      const transporter = nodemailer.createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASS}`,
        },
      })
      transporter.sendMail({
        from: `"X" <${process.env.MAIL_USER}>`,
        to: 'pssst@scrt.link',
        subject: 'Beta Invite',
        text: `New potential customer signup: ${name} <${email}>`,
      })

      res.json(sendCustomer)
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(handler)
