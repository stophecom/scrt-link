import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Stripe from 'stripe'

import handleErrors from '@/api/middlewares/handleErrors'
import withDb from '@/api/middlewares/withDb'
import mailjet from '@/api/utils/mailjet'
import stripe from '@/api/utils/stripe'

const handler = (req, res) =>
  NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
      Providers.Twitter({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
      }),
      Providers.Email({
        // server: process.env.EMAIL_SERVER,
        // from: process.env.EMAIL_FROM,
        sendVerificationRequest: ({ identifier: email, url }) =>
          mailjet({
            To: [{ Email: email, Name: 'X' }],
            Subject: 'Sign in request',
            TemplateID: 2715593,
            TemplateLanguage: true,
            Variables: {
              url: url,
            },
          }).catch((error) => new Error('SEND_VERIFICATION_EMAIL_ERROR', error)),
      }),
    ],
    callbacks: {
      async signIn(user, account, profile) {
        const isAllowedToSignIn = true
        if (isAllowedToSignIn) {
          return true
        } else {
          // Return false to display a default error message
          return false
          // Or you can return a URL to redirect to:
          // return '/unauthorized'
        }
      },

      async jwt(token, user, account, profile, isNewUser) {
        const models = req.models

        if (isNewUser) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
          })
          models.UserSettings.create({
            userId: user.id,
            stripe: { customerId: stripeCustomer?.id },
          })

          token.stripeCustomerId = stripeCustomer?.id
        }

        // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in.
        if (user?.id) {
          if (models) {
            const customer = await models.UserSettings.findOne({
              userId: user.id || '',
            })
            if (customer?.name) {
              token.name = decodeURIComponent(customer.name)
            }
          }
          token.userId = user.id
        }

        return token
      },
      async session(session, token) {
        session.userId = token.userId
        session.stripeCustomerId = token.stripeCustomerId

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

export default handleErrors(withDb(handler))
