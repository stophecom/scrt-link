import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/client'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { Spinner } from '@/components/Spinner'
import SignInForm from '@/components/SignInForm'
import UserSettingsForm from '@/components/UserSettingsForm'
import Page from '@/components/Page'
import { StatsFields } from '@/api/models/Stats'
import { UserSettingsFields } from '@/api/models/UserSettings'
import Markdown from '@/components/Markdown'
import { baseUrl, getMaxMessageLength } from '@/constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '1.2rem',
    },
  }),
)

export const AccountUsps = () => {
  const classes = useStyles()

  const body = `
With a free account you get access to the following features:
- Read receipts via SMS or Email
- Extended message limit: ${getMaxMessageLength(true).toLocaleString()} characters
- Emoji link to share your secrets: **https://🤫.st**
- Customizations for Neogram™ messages (custom destruction message, timer)
- Statistics
`
  return <Markdown className={classes.root} source={body} />
}

type AccountProps = {
  userSettings: Partial<UserSettingsFields>
  stats: Partial<StatsFields>
}
const Account = ({ userSettings, stats }: AccountProps) => {
  const [session, loading] = useSession()
  const { name } = userSettings
  const router = useRouter()

  if (typeof window !== 'undefined' && loading) return <Spinner />

  if (session) {
    return (
      <Page title={`Hi ${name || ''}`} subtitle="Welcome back!">
        <Box mb={10}>
          <Typography variant="h2">Statistics</Typography>
          <Typography variant="body1">
            <strong>Total secrets created: {stats?.totalSecretsCount ?? 0}</strong>
            <br />
            Message:&nbsp;{stats?.secretsCount?.message ?? 0}
            <br />
            URL:&nbsp;{stats?.secretsCount?.url ?? 0}
            <br />
            Neogram:&nbsp;
            {stats?.secretsCount?.neogram ?? 0}
          </Typography>
        </Box>

        <Box mb={10}>
          <Typography variant="h2">Settings</Typography>
          {/* <Typography variant="subtitle2">
            These are default settings. You can overwrite each setting for every secret.
          </Typography> */}
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
        <Box pt={2} mb={10}>
          <Typography variant="body2">
            No account yet? Use the same form to sign up and create an account.
          </Typography>
        </Box>
        <Box mb={4}>
          <Typography variant="h2">Why?</Typography>
          <AccountUsps />
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
    const res = await fetch(`${baseUrl}/api/me`, options)
    const json = await res.json()

    stats = json?.stats
    userSettings = json?.userSettings
  }

  return {
    props: { session, userSettings, stats },
  }
}

export default Account
