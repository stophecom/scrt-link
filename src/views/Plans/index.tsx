import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { GetStaticProps } from 'next'

import stripe from '@/api/utils/stripe'
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
  const { data } = await stripe.products.list()

  const getPlans = async () =>
    Promise.all(
      data.map(async (item) => {
        const { data } = await stripe.prices.list({
          product: item.id,
          active: true,
        })

        const priceByInterval = (interval: string) =>
          data.find(({ recurring }) => recurring?.interval === interval)

        return {
          name: item.name,
          prices: { monthly: priceByInterval('month'), yearly: priceByInterval('year') },
        }
      }),
    )

  return {
    props: {
      plans: await getPlans(),
    },
  }
}
