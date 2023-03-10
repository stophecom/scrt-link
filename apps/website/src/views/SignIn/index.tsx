import React from 'react'
import { getSession } from 'next-auth/react'
import { Box } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'

import FormSignIn from '@/components/FormSignIn'
import Page from '@/components/Page'
import { Link } from '@/components/Link'

const SignIn = () => {
  const { t, i18n } = useTranslation()

  return (
    <Page
      title={t('common:views.SignIn.title', 'Sign in')}
      subtitle={t('common:views.SignIn.subtitle', 'Sign back in. Protect your secrets.')}
    >
      <Box mb={10}>
        <FormSignIn callbackUrl={getAbsoluteLocalizedUrl('/account', i18n.language)}>
          {t('common:views.SignIn.noAccountYet', 'No Account yet?')}{' '}
          <Link href={'/signup'}>{t('common:views.SignIn.signUpNow', 'Sign up now')}</Link>
        </FormSignIn>
      </Box>
    </Page>
  )
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async ({ req, locale = 'en' }) => {
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: getAbsoluteLocalizedUrl('/account', locale),
      },
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
