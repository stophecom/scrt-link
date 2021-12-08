import React from 'react'
import { useTranslation } from 'next-i18next'

import data from '@/data/PrivacyPolicy.md'
import Page from '@/components/Page'
import Markdown from '@/components/Markdown'
import { ImprintInfo } from '@/views/Imprint'

const PrivacyPolicy = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.PrivacyPolicy.title', 'Privacy Policy')}
      subtitle={t('common:views.PrivacyPolicy.subtitle', `Tl;dr: Privacy matters.`)}
      hasMissingTranslations
    >
      <Markdown source={data} />
      <ImprintInfo />
    </Page>
  )
}

export default PrivacyPolicy
