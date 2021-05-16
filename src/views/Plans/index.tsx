import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Alert from '@material-ui/lab/Alert'

import { baseUrl } from '@/constants'
import Page from '@/components/Page'
import PlanSelection from './components/PlanSelection'

const Plans = () => {
  const router = useRouter()

  const { data, error } = useSWR(
    router.query.session_id ? `${baseUrl}/api/checkout/${router.query.session_id}` : null,
  )

  return (
    <Page title="Plans" subtitle={`Simple plans, fair pricing.`}>
      <Box mb={6}>
        <Typography variant="h3">Plans</Typography>
        <Typography variant="body1">Choose wisely…</Typography>
        {data && (
          <Alert severity="success">
            Stripe Response
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Alert>
        )}
        {error && <Alert severity="error">{error?.message}</Alert>}
      </Box>
      <PlanSelection />
    </Page>
  )
}

export default Plans
