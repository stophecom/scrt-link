import React from 'react'
import { useSession, signOut } from 'next-auth/client'
import { Box, Typography } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'

import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import SignInForm from '@/components/SignInForm'
import CustomerForm from '@/components/CustomerForm'
import Page from '@/components/Page'

import { useCustomer, useCustomerStats } from '@/utils/api'

const Account = () => {
  const [session, loading] = useSession()

  const { data: customer, mutate: triggerFetchCustomer } = useCustomer()
  const { stats } = useCustomerStats(session?.userId)

  if (typeof window !== 'undefined' && loading) return <Spinner />

  if (session) {
    return (
      <Page title={`Hi ${customer?.name || ''}`} subtitle="Welcome back!">
        {!!session && (
          <Box mb={10}>
            <NoSsr>
              <BaseButton onClick={() => signOut()} variant="outlined">
                Sign out
              </BaseButton>
            </NoSsr>
          </Box>
        )}
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
            <CustomerForm
              receiptEmail={session.user.email as string}
              {...customer}
              onSuccess={triggerFetchCustomer}
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
      </Page>
    </NoSsr>
  )
}

export default Account
