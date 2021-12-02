import React from 'react'
import { useTranslation } from 'next-i18next'

import data from '@/data/CookiePolicy.md'
import Page from '@/components/Page'
import Markdown from '@/components/Markdown'

const CookiePolicy = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.CookiePolicy.title', 'Cookie Policy')}
      subtitle={t('common:views.CookiePolicy.subtitle', `Tl;dr: only essentials, no tracking.`)}
      hasMissingTranslations
    >
      <Markdown source={data} />
    </Page>
  )
}

export default CookiePolicy
