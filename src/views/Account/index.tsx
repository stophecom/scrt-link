import React from 'react'
import { GetServerSideProps } from 'next'
import { signIn, useSession, getSession } from 'next-auth/client'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box } from '@material-ui/core'

import Page from '@/components/Page'
import BaseButton from '@/components/BaseButton'

const SignInButton = () => (
  <BaseButton
    onClick={() => signIn()}
    color="primary"
    variant="contained"
    size="large"
    startIcon={<VpnKeyIcon />}
  >
    Sign in
  </BaseButton>
)

const Account = () => {
  const [session, loading] = useSession()

  if (typeof window !== 'undefined' && loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )

  if (session) {
    return (
      <Page title={`Hi ${session?.user?.name}`} subtitle="Welcome back!">
        <p>You can view this page because you are signed in.</p>
      </Page>
    )
  }

  return (
    <Page title="Access denied" subtitle="You have to sign in first…">
      <SignInButton />
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

export default Account
