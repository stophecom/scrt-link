import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import handleErrors from '@/api/middlewares/handleErrors'
import withDb from '@/api/middlewares/withDb'
import mailjet from '@/api/utils/mailjet'

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
      async session(session) {
        const models = req.models
        if (models) {
          const user = await models.UserSettings.findOne({
            userId: session.user.email || '',
          })
          session.user.name = user.name
        }
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
