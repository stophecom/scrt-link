import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Box } from '@mui/material'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowForward } from '@mui/icons-material'

import { placeholderName } from '@/constants'
import { BaseButtonLink } from '@/components/Link'
import Page from '@/components/Page'

import { useCustomer } from '@/utils/api'

type OnboardingProps = {
  session: Session
}
const Onboarding: NextPage<OnboardingProps> = ({ session }) => {
  const { t } = useTranslation()
  const { data: customer } = useCustomer()

  return (
    <Page
      title={t('common:views.Onboarding.title', `Mission Briefing`)}
      subtitle={t('common:views.Onboarding.subtitle', {
        defaultValue: `Hi {{name}}, welcome aboard!`,
        name: customer?.name || placeholderName,
      })}
      intro={t(
        'common:views.Onboarding.intro',
        `**Our mission** is to enable everybody to share sensitive information in a *truly private, secure, anonymous* way - something that is vital in a free society. We run this as a passion project, fueled by idealism rather than profits. **However**, to keep basic features free, we depend on a small number of extraordinary people like you.  

**Your mission**, should you choose to accept it, is to learn more about our top secret plans that help us keep this project up and running. Good Luck!`,
      )}
    >
      <Box
        display="flex"
        justifyContent="start"
        alignItems={{ sm: 'center' }}
        mt={4}
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <BaseButtonLink
          href="/pricing"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowForward />}
        >
          {t('common:views.Onboarding.button.accept', `Accept mission`)}
        </BaseButtonLink>
        <Box ml={{ sm: 2 }} pt={{ xs: 1, sm: 0 }}>
          <BaseButtonLink fullWidth href="/account" variant="outlined" size="large" color="primary">
            {t('common:views.Onboarding.button.skip', `Maybe later`)}
          </BaseButtonLink>
        </Box>
      </Box>
    </Page>
  )
}

export default Onboarding

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
