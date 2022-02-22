import NextAuth from 'next-auth'
import Email from 'next-auth/providers/email'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import handleErrors from '@/api/middlewares/handleErrors'
import withDb from '@/api/middlewares/withDb'
import mailjet from '@/api/utils/mailjet'
import stripe from '@/api/utils/stripe'
import { getLocaleFromRequest } from '@/api/utils/helpers'
import clientPromise from '@/api/utils/mongodb'
import { mailjetTemplates } from '@/constants'

const handler = async (req, res) => {
  const template = mailjetTemplates.signInRequest[getLocaleFromRequest(req)]

  const adapter = MongoDBAdapter(clientPromise)

  return await NextAuth(req, res, {
    adapter,
    providers: [
      Email({
        sendVerificationRequest: async ({ identifier: email, url }) => {
          const user = await adapter.getUserByEmail(email)

          // If a new user tries to sign in (instead of sign up) we throw an error and vice-versa
          // Unfortunately the following custom error messages won't work. It will return "EmailSignin" error instead.
          if (req.query.signUpOrSignIn === 'signIn' && !user) {
            throw createError(500, 'You need to sign up first!')
          }
          if (req.query.signUpOrSignIn === 'signUp' && user) {
            throw createError(500, 'User with this email already exists - you may sign in instead.')
          }

          return mailjet({
            To: [{ Email: email, Name: 'X' }],
            Subject: template.subject,
            TemplateID: template.templateId,
            TemplateLanguage: true,
            Variables: {
              url: url,
            },
          }).catch((error) => new Error('SEND_VERIFICATION_EMAIL_ERROR', error))
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, account, profile, isNewUser }) {
        const models = req.models

        if (isNewUser) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
          })
          models.Customer.create({
            userId: user.id,
            stripe: { customerId: stripeCustomer?.id },
            receiptEmail: user.email,
            didAcceptTerms: true,
            role: 'free',
          })
        }

        // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in.
        if (user?.id) {
          token.userId = user.id
        }

        return token
      },
      async session({ session, token }) {
        session.userId = token.userId

        return session
      },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    theme: 'dark',
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  })
}

export default handleErrors(withDb(handler))
