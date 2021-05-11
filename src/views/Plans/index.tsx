import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { GetStaticProps } from 'next'
import { baseUrl } from '@/constants'

import Page from '@/components/Page'
import PlanSelection from './components/PlanSelection'

const Plans = ({ plans = [] }) => (
  <Page title="Plans" subtitle={`Simple plans, fair pricing.`}>
    <Box mb={6}>
      <Typography variant="h3">Plans</Typography>
      <Typography variant="body1">Choose wisely…</Typography>
    </Box>
    <PlanSelection plans={plans} />
  </Page>
)

export default Plans

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetch(`${baseUrl}/api/plans`)
  const json = await res.json()

  return {
    props: {
      plans: json,
    },
  }
}
