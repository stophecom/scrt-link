import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { GetServerSideProps } from 'next'

import Page from '@/components/Page'
import PlanSelection from './components/PlanSelection'

const Plans = ({ stripeSessionId }: any) => (
  <Page title="Plans" subtitle={`Simple plans, fair pricing.`}>
    <Box mb={6}>
      <Typography variant="h3">Plans</Typography>
      <Typography variant="body1">Choose wisely…</Typography>
      Stripe: {stripeSessionId}
    </Box>
    <PlanSelection />
  </Page>
)

export default Plans

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { session_id = null } = query

  return {
    props: {
      stripeSessionId: session_id,
    },
  }
}
