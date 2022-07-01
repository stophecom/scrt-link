import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import Email from 'next-auth/providers/email'

import handleErrors from '@/api/middlewares/handleErrors'
import withDb from '@/api/middlewares/withDb'
import mailjet from '@/api/utils/mailjet'
import stripe from '@/api/utils/stripe'
import { getLocaleFromRequest } from '@/api/utils/helpers'
import { mailjetTemplates, placeholderName } from '@/constants'
import { nextAuthAdapter } from '@/api/utils/nextAuth'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  const template = mailjetTemplates.signInRequest[getLocaleFromRequest(req)]

  const models = req.models
  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  return await NextAuth(req, res, {
    adapter: nextAuthAdapter,
    providers: [
      Email({
        sendVerificationRequest: async ({ identifier: email, url }) => {
          const user = await nextAuthAdapter.getUserByEmail(email)

          // If a new user tries to sign in (instead of sign up) we throw an error and vice-versa
          // Unfortunately the following custom error messages won't work. It will return "EmailSignin" error instead.
          if (req.query.signUpOrSignIn === 'signIn' && !user) {
            throw createError(500, 'You need to sign up first!')
          }
          if (req.query.signUpOrSignIn === 'signUp' && user) {
            throw createError(500, 'User with this email already exists - you may sign in instead.')
          }

          const givenName =
            (user?.name as string) || (req?.query?.name as string) || placeholderName
          if (!user) {
            await models.Customer.findOneAndUpdate(
              { signupUniqueEmailIdentifier: email },
              { name: givenName },
              {
                upsert: true,
                new: true,
              },
            )
          }

          await mailjet({
            To: [{ Email: email, Name: givenName }],
            Subject: template.subject,
            TemplateID: template.templateId,
            TemplateLanguage: true,
            Variables: {
              url: url,
            },
          }).catch((error) => {
            console.error('Email sign-in request failed: ', error)
            throw new Error('SEND_VERIFICATION_EMAIL_ERROR')
          })
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, isNewUser }) {
        // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in.
        if (isNewUser && user && user.email) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
          })
          await models.Customer.findOneAndUpdate(
            { signupUniqueEmailIdentifier: user.email },
            {
              userId: user.id,
              stripe: { customerId: stripeCustomer?.id },
              receiptEmail: user.email,
              didAcceptTerms: true,
              role: 'free',
            },
          )
        }

        return token
      },
      async session({ session, token }) {
        // Token sub is the user id
        if (session?.user && token.sub) {
          session.user.id = token.sub
        }

        return session
      },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  })
}

export default handleErrors(withDb(handler))
