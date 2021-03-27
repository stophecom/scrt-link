import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import mailjet from '@/api/utils/mailjet'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    Providers.Email({
      // server: process.env.EMAIL_SERVER,
      // from: process.env.EMAIL_FROM,
      sendVerificationRequest: ({ identifier: email, url, _token, site, _provider }) =>
        mailjet({
          To: [{ Email: email, Name: 'Anonymous' }],
          Subject: 'Signin to scrt.link',
          TextPart: `Sign in to ${site} with the following link: ${url}`,
        }).catch((error) => new Error('SEND_VERIFICATION_EMAIL_ERROR', error)),
    }),
  ],
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
