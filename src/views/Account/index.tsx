import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSession, signOut } from 'next-auth/client'
import { Box, Typography, Paper, NoSsr } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import styled from 'styled-components'
import { project } from 'ramda'

import { Link } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import FormSignIn from '@/components/FormSignIn'
import FormCustomer from '@/components/FormCustomer'
import FormDeleteAccount from '@/components/FormDeleteAccount'
import Page from '@/components/Page'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'
import UnorderedList from '@/components/UnorderedList'

import { api, useCustomer } from '@/utils/api'

const PlanSelection = dynamic(() => import('@/components/PlanSelection'))

const AccountInfo = styled(Box)`
  opacity: 0.7;
  text-align: center;
`

const DangerZone = styled(Paper)`
  border: 2px solid ${({ theme }) => theme.palette.primary.main};
`

const menu = [
  { label: 'Settings', key: 'settings' },
  { label: 'Subscription', key: 'subscription' },
  { label: 'Danger Zone', key: 'danger' },
]
export type MenuItem = typeof menu[number]

type ResponseCreatePortalLink = { url: string }

const ManageSubscriptionButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const redirectToCustomerPortal = async () => {
    setIsLoading(true)
    return api<ResponseCreatePortalLink>(`/subscriptions/create-portal-link`, { method: 'POST' })
      .then(({ url }) => {
        window.location.assign(url)
      })
      .catch((error) => {
        return alert(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <BaseButton
      variant="outlined"
      color="primary"
      onClick={redirectToCustomerPortal}
      loading={isLoading}
    >
      Manage subscription on Stripe
    </BaseButton>
  )
}

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
        <Section pt={{ xs: 0, sm: 0 }}>
          {activeTab === 'settings' && (
            <>
              <Box mb={1}>
                <Alert severity="info">
                  The following are default settings. You can overwrite each setting for every
                  secret you create.
                </Alert>
              </Box>
              <Paper square>
                <Box p={3}>
                  <FormCustomer
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
                <Alert severity="info">
                  You are currently on the <strong>{customer?.role}</strong> plan.
                  {customer?.role === 'premium' && (
                    <Box mt={1}>
                      <ManageSubscriptionButton />
                    </Box>
                  )}
                </Alert>
              </Box>

              <PlanSelection />
            </>
          )}

          {activeTab === 'danger' && (
            <>
              {customer?.role === 'premium' && (
                <Box mb={1}>
                  <Alert severity="info">
                    You have a running subscription. We recommend to cancel it first.
                    <Box mt={1}>
                      <ManageSubscriptionButton />
                    </Box>
                  </Alert>
                </Box>
              )}

              <DangerZone square>
                <Box p={3}>
                  <Box mb={5}>
                    <Typography variant="h3">Delete your account</Typography>
                  </Box>
                  <FormDeleteAccount />
                </Box>
              </DangerZone>
            </>
          )}
        </Section>
        <AccountInfo pt={5}>
          <Typography variant="body1">You are signed in as {session?.user?.email}.</Typography>
          <Box mt={1}>
            <BaseButton onClick={() => signOut()} variant="outlined" color="primary">
              Sign out
            </BaseButton>
          </Box>
        </AccountInfo>
      </Page>
    )
  }

  return (
    <NoSsr>
      <Page title="Scrt account" subtitle="Great things start here…">
        <Box mb={10}>
          <FormSignIn />
        </Box>
        {customer?.role !== 'premium' && (
          <Section
            title={`That's inside`}
            subtitle={`With a free account you get access to a rich feature set. Want more? Support this project with a subscription.`}
          >
            <PlanSelection />

            <Box pt={15}>
              <Typography variant="h3">…on top of all standard features:</Typography>
              <UnorderedList
                items={[
                  'Unlimited secrets',
                  'Optional password',
                  'Emoji links 🤫',
                  'Extension for all major browsers',
                  '100% privacy protection',
                ]}
              />
            </Box>
          </Section>
        )}
      </Page>
    </NoSsr>
  )
}

export default Account
