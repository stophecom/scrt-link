import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Session } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { Alert, Box, Typography, Paper, NoSsr } from '@mui/material'
import { project } from 'ramda'
import { useTranslation, TFunction } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { styled } from '@mui/system'
import { ArrowForward } from '@mui/icons-material'

import Markdown from '@/components/Markdown'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'
import BaseButton from '@/components/BaseButton'
import { BaseButtonLink } from '@/components/Link'
import FormCustomer, { FormCustomerName } from '@/components/FormCustomer'
import FormDeleteAccount from '@/components/FormDeleteAccount'
import Page from '@/components/Page'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'
import { placeholderName, freePlanName } from '@/constants'

import { api, useCustomer, useSubscription } from '@/utils/api'

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

export const SubscriptionInfo: React.FC = () => {
  const { t } = useTranslation()

  const { productName, hasActiveSubscription } = useSubscription()

  return (
    <Box mb={3}>
      <Alert severity="info">
        <Markdown
          source={t('common:views.Account.subscription.info', {
            defaultValue: `You are currently on the **{{ productName }}** plan.`,
            productName: productName || freePlanName,
          })}
        />
        {hasActiveSubscription && (
          <Box mt={2}>
            <ManageSubscriptionButton />
          </Box>
        )}
      </Alert>
    </Box>
  )
}

type AccountProps = {
  session: Session
}
const Account: NextPage<AccountProps> = ({ session }) => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<MenuItem['key']>(menu(t)[0].key)
  const { customer } = useCustomer()
  const { hasActiveSubscription } = useSubscription()

  const handleMenuChange = (_event: unknown, newValue: MenuItem['key']) => {
    setActiveTab(newValue)
  }

  return (
    <Page
      title={t('common:views.Account.title', `Account`)}
      subtitle={t('common:views.Account.subtitle', {
        defaultValue: `Hi {{name}}, welcome back!`,
        name: customer?.name || placeholderName,
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
              <FormCustomerName />
              <FormCustomer />
            </>
          )}
          {activeTab === 'subscription' && (
            <>
              <SubscriptionInfo />
              <Box mt={2}>
                <BaseButtonLink
                  startIcon={<ArrowForward />}
                  href="/pricing"
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  {t('common:button.viewPlans', `View plans`)}
                </BaseButtonLink>
              </Box>
            </>
          )}

          {activeTab === 'danger' && (
            <>
              {hasActiveSubscription && (
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
