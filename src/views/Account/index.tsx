import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useSession, signOut } from 'next-auth/client'
import { Box, Typography, Paper, NoSsr } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import styled from 'styled-components'
import { project } from 'ramda'
import { useTranslation, Trans, TFunction } from 'next-i18next'
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
export type MenuItem = { label: string; key: string }
const menu = (t: TFunction): MenuItem[] => [
  { label: t('common:menu.settings', 'Settings'), key: 'settings' },
  { label: t('common:menu.subscription', 'Subscription'), key: 'subscription' },
  { label: t('common:menu.dangerZone', 'Danger Zone'), key: 'danger' },
]

type ResponseCreatePortalLink = { url: string }

const ManageSubscriptionButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

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
      {t('common:views.Account.ManageSubscriptionButton.button', 'Manage subscription on Stripe')}
    </BaseButton>
  )
}

const Account = () => {
  const { t } = useTranslation()
  const [session, loading] = useSession()
  const [activeTab, setActiveTab] = useState<MenuItem['key']>(menu(t)[0].key)
  const { data: customer, mutate: triggerFetchCustomer } = useCustomer()

  const handleMenuChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: MenuItem['key'],
  ) => {
    setActiveTab(newValue)
  }
  const customerRole = customer?.role

  if (typeof window !== 'undefined' && loading) return <Spinner />
  if (session) {
    return (
      <Page
        title={t('common:views.Account.title', `Account`)}
        subtitle={t('common:views.Account.subtitle', {
          defaultValue: `Hi {{name}}, welcome back!`,
          name: customer?.name || 'X',
        })}
      >
        <TabsMenu
          handleChange={handleMenuChange}
          value={activeTab}
          tabsMenu={project(['label', 'key'], menu(t))}
          label={t('common:views.Account.tabsMenu.label', 'Account options')}
        />
        <Section pt={{ xs: 0, sm: 0 }}>
          {activeTab === 'settings' && (
            <>
              <Box mb={1}>
                <Alert severity="info">
                  {t(
                    'common:views.Account.settingsDisclaimer',
                    'The following are default settings. You can overwrite each setting for every secret you create.',
                  )}
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
                  <Trans i18nKey="common:views.Account.subscriptionInfo">
                    You are currently on the <strong>{{ customerRole }}</strong> plan.
                  </Trans>
                  {customerRole === 'premium' && (
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
              {customerRole === 'premium' && (
                <Box mb={1}>
                  <Alert severity="info">
                    {t(
                      'common:views.Account.activeSubscriptionWarning',
                      'You have a running subscription. We recommend to cancel it first.',
                    )}
                    <Box mt={1}>
                      <ManageSubscriptionButton />
                    </Box>
                  </Alert>
                </Box>
              )}

              <DangerZone square>
                <Box p={3}>
                  <Box mb={5}>
                    <Typography variant="h3">
                      {t('common:views.Account.accountDeletion', 'Delete your account')}
                    </Typography>
                  </Box>
                  <FormDeleteAccount />
                </Box>
              </DangerZone>
            </>
          )}
        </Section>
        <AccountInfo pt={5}>
          <Typography variant="body1">
            {t('common:views.Account.signedInAs', {
              defaultValue: 'You are signed in as {{email}}.',
              email: session?.user?.email,
            })}
          </Typography>
          <Box mt={1}>
            <BaseButton onClick={() => signOut()} variant="outlined" color="primary">
              {t('common:button.signOut', 'Sign out')}
            </BaseButton>
          </Box>
        </AccountInfo>
      </Page>
    )
  }

  return (
    <NoSsr>
      <Page
        title={t('common:views.SignIn.title', 'Scrt account')}
        subtitle={t('common:views.SignIn.subtitle', 'Great things start here…')}
      >
        <Box mb={10}>
          <FormSignIn />
        </Box>
        {customerRole !== 'premium' && (
          <Section title={t('common:views.SignIn.FreeAccount.title', `Free Account Benefits`)}>
            <Box pb={1}>
              <UnorderedList
                items={[
                  t('common:views.SignIn.FreeAccount.Usps.0', 'More characters for your secrets'),
                  t('common:views.SignIn.FreeAccount.Usps.1', 'Email read receipts'),
                  t('common:views.SignIn.FreeAccount.Usps.2', 'Slack App'),
                  t('common:views.SignIn.FreeAccount.Usps.3', 'Browser extensions'),
                  t('common:views.SignIn.FreeAccount.Usps.4', 'Personal support'),
                  t('common:views.SignIn.FreeAccount.Usps.5', 'Emoji links 🤫'),
                ]}
              />
            </Box>
            <Typography variant="body1">
              <Trans i18nKey="common:views.SignIn.FreeAccount.upsell">
                Need more? <Link href="/pricing">There is more</Link>.
              </Trans>
            </Typography>
          </Section>
        )}
      </Page>
    </NoSsr>
  )
}

export default Account
