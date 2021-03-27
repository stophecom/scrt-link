import React from 'react'
import { GetServerSideProps } from 'next'
import { useSession, getSession } from 'next-auth/client'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'

import SignInForm from '@/components/SignInForm'
import Page from '@/components/Page'

const Account = () => {
  const [session, loading] = useSession()

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
      <Page title={`Hi ${session?.user?.name || ''}`} subtitle="Welcome back!">
        <p>You can view this page because you are signed in.</p>
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
  return {
    props: { session },
  }
}

export default Account
