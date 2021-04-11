import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/client'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'

import { UserSettings } from '@/types'
import SignInForm from '@/components/SignInForm'
import UserSettingsForm from '@/components/UserSettingsForm'
import Page from '@/components/Page'
import { sanitizeUrl } from '@/utils/index'

type AccountProps = {
  user: UserSettings
}
const Account = ({ user }: AccountProps) => {
  const [session, loading] = useSession()
  const { name } = user
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
        <Typography variant="h2">Settings</Typography>
        <UserSettingsForm
          {...user}
          onSuccess={() => router.replace(router.asPath)} // Reloading server side props: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
        />
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

  let user = {}

  if (session) {
    const options = { headers: { cookie: context.req.headers.cookie as string } }
    const res = await fetch(`${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}/api/me`, options)
    const json = await res.json()
    if (json.user) {
      user = json.user
    }
  }

  return {
    props: { session, user },
  }
}

export default Account
