import React from 'react'

import Page from '@/components/Page'
import PlanSelection from './components/PlanSelection'

const Pricing = () => {
  return (
    <Page title="Pricing" subtitle={`Simple plans, fair pricing.`}>
      <PlanSelection />
    </Page>
  )
}

export default Pricing
