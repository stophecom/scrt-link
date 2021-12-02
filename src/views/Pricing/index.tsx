import React from 'react'
import { useTranslation } from 'next-i18next'

import Page from '@/components/Page'
import PlanSelection from '@/components/PlanSelection'

const Pricing = () => {
  const { t } = useTranslation()
  return (
    <Page
      title={t('common:views.Pricing.title', 'Pricing')}
      subtitle={t('common:views.Pricing.subtitle', `Simple plans, fair pricing.`)}
    >
      <PlanSelection />
    </Page>
  )
}

export default Pricing
