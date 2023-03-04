import React, { useEffect } from 'react'
import { Alert } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { signOut, useSession } from 'next-auth/react'

import { Spinner } from '@/components/Spinner'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'

import Page from '@/components/Page'

const SignOut = () => {
  const { t, i18n } = useTranslation()
  const { data: session } = useSession()

  const signOutHandler = () =>
    signOut({
      callbackUrl: getAbsoluteLocalizedUrl('/signout', i18n.language),
    })
  useEffect(() => {
    if (session) {
      signOutHandler()
    }
  }, [session])

  return (
    <Page
      title={t('common:views.SignOut.title', 'Sign Out')}
      subtitle={t('common:views.SignOut.subtitle', 'Stay safe! Come back soon.')}
    >
      {session ? (
        <Spinner message={t('common:views.SignOut.loading', 'Signing out…')} />
      ) : (
        <Alert severity="success">
          {t('common:views.SignOut.success', 'You are successfully signed out.')}
        </Alert>
      )}
    </Page>
  )
}

export default SignOut
