import React from 'react'
import { useTranslation } from 'next-i18next'

import Page from '@/components/Page'
import data from '@/data/AcceptableUsePolicy.md'
import Markdown from '@/components/Markdown'

const AcceptableUsePolicy = () => {
  const { t } = useTranslation()
  return (
    <Page
      title={t('common:views.AcceptableUsePolicy.title', 'Acceptable Use Policy')}
      subtitle={t('common:views.AcceptableUsePolicy.subtitle', `Tl;dr: Play fair.`)}
      hasMissingTranslations
    >
      <Markdown source={data} />
    </Page>
  )
}

export default AcceptableUsePolicy
