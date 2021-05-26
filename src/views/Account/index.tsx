import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/client'
import { Box, Typography, Paper } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'
import Alert from '@material-ui/lab/Alert'

import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import SignInForm from '@/components/SignInForm'
import CustomerForm from '@/components/CustomerForm'
import { PersonalStats } from '@/components/Stats'
import Page from '@/components/Page'
import TabsMenu from '@/components/TabsMenu'
import { project } from 'ramda'

import { useCustomer } from '@/utils/api'
import PlanSelection from '@/components/PlanSelection'

const menu = [
  { label: 'Contact', key: 'contact' },
  { label: 'Secrets', key: 'secrets' },
  { label: 'Subscription', key: 'subscription' },
  { label: 'Statistics', key: 'statistics' },
]
export type MenuItem = typeof menu[number]

const Account = () => {
  const [session, loading] = useSession()
  const [activeTab, setActiveTab] = useState<MenuItem['key']>(menu[0].key)
  const { data: customer, mutate: triggerFetchCustomer } = useCustomer()

  const handleMenuChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: MenuItem['key'],
  ) => {
    setActiveTab(newValue)
  }

  if (typeof window !== 'undefined' && loading) return <Spinner />

  if (session) {
    return (
      <Page title={`Hi ${customer?.name || ''}`} subtitle="Welcome back!">
        <Box mb={8}>
          <NoSsr>
            <Box mb={2}>
              <Typography variant="body1">You are signed in as {session?.user?.email}.</Typography>
            </Box>
            <BaseButton onClick={() => signOut()} variant="outlined">
              Sign out
            </BaseButton>
          </NoSsr>
        </Box>

        <Typography variant="h2">Account settings</Typography>

        <Box mb={5}>
          <TabsMenu
            handleChange={handleMenuChange}
            value={activeTab}
            tabsMenu={project(['label', 'key'], menu)}
            label="Account options"
          />
        </Box>

        {activeTab === 'statistics' && (
          <Box mb={10}>
            <PersonalStats userId={session?.userId} />
          </Box>
        )}

        {activeTab === 'secrets' && (
          <>
            <Box mb={5}>
              <Alert severity="info">
                These are default settings. You can overwrite each setting for every secret you
                create.
              </Alert>
            </Box>
            <Paper square>
              <Box p={3}>
                <CustomerForm
                  {...customer}
                  formFieldsSelection="secrets"
                  onSuccess={triggerFetchCustomer}
                />
              </Box>
            </Paper>
          </>
        )}

        {activeTab === 'subscription' && (
          <>
            <Box mb={5}>
              <Alert severity="info">You are currently on the {customer?.role} plan.</Alert>
            </Box>

            <PlanSelection />
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <Box mb={5}>
              <Alert severity="info">
                The following information is <strong>private</strong> and will never be shown to
                anybody. We only use it to send you read receipts.
              </Alert>
            </Box>

            <Paper square>
              <Box p={3}>
                <CustomerForm
                  {...customer}
                  formFieldsSelection="contact"
                  onSuccess={triggerFetchCustomer}
                />
              </Box>
            </Paper>
          </>
        )}
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
