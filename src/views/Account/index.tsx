import React, { useState } from 'react'
import { useSession } from 'next-auth/client'
import { Box, Typography, Paper } from '@material-ui/core'
import NoSsr from '@material-ui/core/NoSsr'
import Alert from '@material-ui/lab/Alert'
import styled from 'styled-components'

import { Spinner } from '@/components/Spinner'
import SignInForm from '@/components/SignInForm'
import CustomerForm from '@/components/CustomerForm'
import DeleteAccountForm from '@/components/DeleteAccountForm'
import { PersonalStats } from '@/components/Stats'
import Page from '@/components/Page'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'
import { project } from 'ramda'

import { useCustomer } from '@/utils/api'
import PlanSelection from '@/components/PlanSelection'

const AccountInfo = styled(Box)`
  opacity: 0.7;
  text-align: center;
`

const DangerZone = styled(Paper)`
  border: 2px solid ${({ theme }) => theme.palette.primary.main};
`

const menu = [
  { label: 'Contact', key: 'contact' },
  { label: 'Secrets', key: 'secrets' },
  { label: 'Subscription', key: 'subscription' },
  { label: 'Danger Zone', key: 'danger' },
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
      <Page title={`Account`} subtitle={`Hi ${customer?.name || 'X'}, welcome back!`}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={activeTab}
          tabsMenu={project(['label', 'key'], menu)}
          label="Account options"
        />
        <Section pt={0}>
          {activeTab === 'contact' && (
            <>
              <Box mb={1}>
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
          {activeTab === 'secrets' && (
            <>
              <Box mb={1}>
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
              <Box mb={2}>
                <Alert severity="info">You are currently on the {customer?.role} plan.</Alert>
              </Box>

              <PlanSelection />
            </>
          )}

          {activeTab === 'danger' && (
            <>
              {customer?.role === 'premium' && (
                <Box mb={5}>
                  <Alert severity="info">
                    You have a running subscription. We recommend to cancel it first.
                  </Alert>
                </Box>
              )}

              <DangerZone square>
                <Box p={3}>
                  <Box mb={5}>
                    <Typography variant="h3">Delete your account</Typography>
                  </Box>
                  <DeleteAccountForm />
                </Box>
              </DangerZone>
            </>
          )}
        </Section>
        <Section title="Statistics">
          <PersonalStats userId={session?.userId} />
        </Section>
        <AccountInfo pt={5}>
          <Typography variant="body1">You are signed in as {session?.user?.email}.</Typography>
        </AccountInfo>
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
