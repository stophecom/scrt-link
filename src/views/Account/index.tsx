import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { Session } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { Alert, Box, Typography, Paper, NoSsr } from '@mui/material'
import { project } from 'ramda'
import { useTranslation, Trans, TFunction } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { styled } from '@mui/system'

import { getAbsoluteLocalizedUrl } from '@/utils/localization'
import BaseButton from '@/components/BaseButton'
import FormCustomer, { FormCustomerName } from '@/components/FormCustomer'
import FormDeleteAccount from '@/components/FormDeleteAccount'
import Page from '@/components/Page'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'

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
type AccountProps = {
  session: Session
}
const Account: NextPage<AccountProps> = ({ session }) => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<MenuItem['key']>(menu(t)[0].key)
  const { data: customer, mutate: triggerFetchCustomer } = useCustomer()

  const handleMenuChange = (_event: unknown, newValue: MenuItem['key']) => {
    setActiveTab(newValue)
  }
  const customerRole = customer?.role
  return (
    <Page
      title={t('common:views.Account.title', `Account`)}
      subtitle={t('common:views.Account.subtitle', {
        defaultValue: `Hi {{name}}, welcome back!`,
        name: customer?.name || 'X',
      })}
    >
      <TabsMenu
        onChange={handleMenuChange}
        value={activeTab}
        tabsMenu={project(['label', 'key'], menu(t))}
        aria-label={t('common:views.Account.tabsMenu.label', 'Account options')}
      />
      <NoSsr>
        <Section pt={{ xs: 0, sm: 0 }}>
          {activeTab === 'settings' && (
            <>
              <FormCustomer />
              <FormCustomerName />
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
      </NoSsr>
      <AccountInfo pt={5}>
        <Typography variant="body1">
          {t('common:views.Account.signedInAs', {
            defaultValue: 'You are signed in as {{email}}.',
            email: session?.user?.email,
          })}
        </Typography>
        <Box mt={1}>
          <BaseButton
            onClick={() =>
              signOut({ callbackUrl: getAbsoluteLocalizedUrl('/account', i18n.language) })
            }
            variant="outlined"
            color="primary"
          >
            {t('common:button.signOut', 'Sign out')}
          </BaseButton>
        </Box>
      </AccountInfo>
    </Page>
  )
}

export default Account

export const getServerSideProps: GetServerSideProps = async ({ req, locale = 'en' }) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/signin`,
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      session,
    },
  }
}
