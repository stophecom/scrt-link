import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import handleErrors from '@/api/middlewares/handleErrors'
import withDb from '@/api/middlewares/withDb'
import mailjet from '@/api/utils/mailjet'
import stripe from '@/api/utils/stripe'
import { getLocaleFromRequest } from '@/api/utils/helpers'
import { mailjetTemplates } from '@/constants'

const handler = (req, res) => {
  const locale = getLocaleFromRequest(req)
  const template = mailjetTemplates.signInRequest[getLocaleFromRequest(req)]

  return NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
      Providers.Twitter({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
      }),
      Providers.Email({
        sendVerificationRequest: ({ identifier: email, url }) =>
          mailjet({
            To: [{ Email: email, Name: 'X' }],
            Subject: template.subject,
            TemplateID: template.templateId,
            TemplateLanguage: true,
            Variables: {
              url: url,
            },
          }).catch((error) => new Error('SEND_VERIFICATION_EMAIL_ERROR', error)),
      }),
    ],
    callbacks: {
      async jwt(token, user, account, profile, isNewUser) {
        const models = req.models

        if (isNewUser) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
          })
          models.Customer.create({
            userId: user.id,
            stripe: { customerId: stripeCustomer?.id },
            receiptEmail: user.email,
            role: 'free',
          })
        }

        // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in.
        if (user?.id) {
          token.userId = user.id
        }

        return token
      },
      async session(session, token) {
        session.userId = token.userId

        return session
      },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
      jwt: true,
    },
    theme: 'dark',
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    database: process.env.DB,
  })
}

export default handleErrors(withDb(handler))
