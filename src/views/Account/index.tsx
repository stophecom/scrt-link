import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/client'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'

import SignInForm from '@/components/SignInForm'
import UserSettingsForm from '@/components/UserSettingsForm'
import Page from '@/components/Page'
import { sanitizeUrl } from '@/utils/index'
import { StatsFields } from '@/api/models/Stats'
import { UserSettingsFields } from '@/api/models/UserSettings'

type AccountProps = {
  userSettings: Partial<UserSettingsFields>
  stats: Partial<StatsFields>
}
const Account = ({ userSettings, stats }: AccountProps) => {
  const [session, loading] = useSession()
  const { name } = userSettings
  const router = useRouter()

  if (typeof window !== 'undefined' && loading)
    return (
      <NoSsr>
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      </NoSsr>
    )

  if (session) {
    return (
      <Page title={`Hi ${name || ''}`} subtitle="Welcome back!">
        <Box mb={10}>
          <Typography variant="h2">Statistics</Typography>
          <Typography variant="body1">
            <strong>Total secrets created: {stats.totalSecretsCount}</strong>
            <br />
            Message:&nbsp;{stats.secretsCount?.message}
            <br />
            URL:&nbsp;{stats.secretsCount?.url}
            <br />
            Neogram:&nbsp;
            {stats.secretsCount?.neogram}
          </Typography>
        </Box>

        <Box mb={10}>
          <Typography variant="h2">Settings</Typography>
          <Typography variant="subtitle2">
            These are default settings. You can overwrite each setting for every secret.
          </Typography>
          <Box py={3}>
            <UserSettingsForm
              receiptEmail={session.user.email as string}
              {...userSettings}
              onSuccess={() => router.replace(router.asPath)} // Reloading server side props: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
            />
          </Box>
        </Box>
      </Page>
    )
  }

  return (
    <NoSsr>
      <Page title="Scrt account" subtitle="Sign in with your email.">
        <SignInForm />
        <Box mt={4}>
          <Typography variant="body2">
            No account yet? Use the same form to create an account.
          </Typography>
        </Box>
      </Page>
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  let userSettings = {}
  let stats = {}

  if (session) {
    const options = { headers: { cookie: context.req.headers.cookie as string } }
    const res = await fetch(`${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}/api/me`, options)
    const json = await res.json()

    stats = json?.stats
    userSettings = json?.userSettings
  }

  return {
    props: { session, userSettings, stats },
  }
}

export default Account
