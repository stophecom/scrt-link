import React from 'react'
import { Typography, Box } from '@material-ui/core'

import Page from '@/components/Page'
import PlanSelection from './components/PlanSelection'

const Plans = () => (
  <Page title="Plans" subtitle={`Simple plans, fair pricing.`}>
    <Box mb={6}>
      <Typography variant="h3">Plans</Typography>
      <Typography variant="body1">Choose wisely…</Typography>
    </Box>
    <PlanSelection />
  </Page>
)

export default Plans
