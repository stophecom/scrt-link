import React from 'react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { styled } from '@mui/system'

import Page from '@/components/Page'
import PlanSelection from '@/components/PlanSelection'

import accountAndBilling from '@/data/faq/accountAndBilling'
import Section from '@/components/Section'
import { SubscriptionInfo } from '@/views/Account'
import { useCustomer } from '@/utils/api'

const FaqAccordion = dynamic(() => import('@/components/Accordion'))

const PlansWrapper = styled('div')`
  ${({ theme }) => theme.breakpoints.up('md')} {
    margin-left: -90px;
    margin-right: -90px;
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-left: -150px;
    margin-right: -150px;
  }
`

const Pricing = () => {
  const { t } = useTranslation()
  const { data: customer } = useCustomer()

  return (
    <Page
      title={t('common:views.Pricing.title', 'Pricing')}
      subtitle={t('common:views.Pricing.subtitle', `Simple plans, fair pricing.`)}
    >
      {customer?.userId && customer?.role !== 'free' && <SubscriptionInfo />}

      <PlansWrapper>
        <PlanSelection />
      </PlansWrapper>

      <Section
        title={t('common:abbreviations.faq', 'FAQ')}
        subtitle={t(
          'common:views.Pricing.FAQ.subtitle',
          'Frequently asked questions about plans and pricing.',
        )}
      >
        <FaqAccordion items={accountAndBilling(t)} />
      </Section>
    </Page>
  )
}

export default Pricing
