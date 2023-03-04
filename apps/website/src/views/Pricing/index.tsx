import React from 'react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { styled } from '@mui/system'

import { Box } from '@mui/material'

import Page from '@/components/Page'
import PlanSelection from '@/components/PlanSelection'

import accountAndBilling from '@/data/faq/accountAndBilling'
import Section from '@/components/Section'
import { SubscriptionInfo } from '@/views/Account'
import { useCustomer } from '@/utils/api'
// eslint-disable-next-line import/no-webpack-loader-syntax
import PoweredByStripe from '!@svgr/webpack!@/assets/images/PoweredByStripe.svg'

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
  const { customer } = useCustomer()

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

      <Box display={'flex'} justifyContent="center" pt={3}>
        <Box sx={{ width: '180px', opacity: 0.8 }}>
          <PoweredByStripe />
        </Box>
      </Box>
    </Page>
  )
}

export default Pricing
