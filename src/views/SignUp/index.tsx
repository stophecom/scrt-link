import React from 'react'
import { getSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, Typography } from '@material-ui/core'
import { useTranslation, Trans } from 'next-i18next'

import { Link } from '@/components/Link'
import Section from '@/components/Section'
import UnorderedList from '@/components/UnorderedList'
import { getI18nConfig } from '@/utils/localization'
import FormSignIn from '@/components/FormSignIn'
import Page from '@/components/Page'
import { useCustomer } from '@/utils/api'

const SignUp = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.SignUp.title', 'Get account')}
      subtitle={t('common:views.SignUp.subtitle', 'Great things start here…')}
    >
      <Box mb={10}>
        <FormSignIn showSignUp>
          {t('common:views.SignUp.gotAccount', 'Already got an account?')}{' '}
          <Link href={'/signin'}>{t('common:views.SignUp.signInNow', 'Sign in now')}</Link>
        </FormSignIn>
      </Box>
      <Section title={t('common:views.SignUp.FreeAccount.title', `Free Account Benefits`)}>
        <Box pb={1}>
          <UnorderedList
            items={[
              t('common:views.SignUp.FreeAccount.Usps.0', 'More characters for your secrets'),
              t('common:views.SignUp.FreeAccount.Usps.1', 'Email read receipts'),
              t('common:views.SignUp.FreeAccount.Usps.2', 'Slack App'),
              t('common:views.SignUp.FreeAccount.Usps.3', 'Browser extensions'),
              t('common:views.SignUp.FreeAccount.Usps.4', 'Personal support'),
              t('common:views.SignUp.FreeAccount.Usps.5', 'Emoji links 🤫'),
            ]}
          />
        </Box>
        <Typography variant="body1">
          <Trans i18nKey="common:views.SignUp.FreeAccount.upsell">
            Need more? <Link href="/pricing">There is more</Link>.
          </Trans>
        </Typography>
      </Section>
    </Page>
  )
}

export default SignUp

export const getServerSideProps: GetServerSideProps = async ({ req, locale = 'en' }) => {
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/account',
      },
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], getI18nConfig())),
    },
  }
}
