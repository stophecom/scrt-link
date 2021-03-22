import { NextApiHandler, NextApiRequest } from 'next'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { emailValidationSchema } from '@/utils/validationSchemas'

import nodemailer from 'nodemailer'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await emailValidationSchema.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  const { email } = req.body

  return { email }
}

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      const { email } = await extractPostInput(req)

      const transporter = nodemailer.createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASS}`,
        },
      })

      const info = await transporter.sendMail({
        from: `"X" <${process.env.MAIL_USER}>`,
        to: 'pssst@scrt.link',
        subject: 'Potential customer',
        text: `Potential customer: ${email}`,
      })

      console.log('Message sent: %s', info.messageId)

      res.json({
        message:
          'Mission accomplished! You successfully requested beta access to our top secret plan!',
      })
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(handler)
