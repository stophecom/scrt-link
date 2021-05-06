import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/client'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import SignInForm from '@/components/SignInForm'
import UserSettingsForm from '@/components/UserSettingsForm'
import Page from '@/components/Page'
import { sanitizeUrl } from '@/utils/index'
import { StatsFields } from '@/api/models/Stats'
import { UserSettingsFields } from '@/api/models/UserSettings'
import Markdown from '@/components/Markdown'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '1.2rem',
    },
  }),
)

const Usps = () => {
  const classes = useStyles()

  const body = `
No account yet? Sign up and get access to the following features:
- Read receipts via SMS or Email
- Emoji link to share your secrets: **https://🤫.st**
- Customizations for Neogram™ messages (custom destruction message, time)
- Statistics
- Increased 2k character limit for all secret types *(coming soon)*
`
  return (
    <Box mb={4}>
      <Typography variant="h2">Get a free account</Typography>
      <Markdown className={classes.root} source={body} />
    </Box>
  )
}

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
            No account yet? Use the same form to create an account.
          </Typography>
        </Box>
        <Usps />
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
