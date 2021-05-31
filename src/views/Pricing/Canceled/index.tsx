import React from 'react'
import { PageError } from '@/components/Error'

import { BaseButtonLink } from '@/components/Link'

const Canceled = () => (
  <PageError
    title="Payment canceled"
    error="You either canceled the payment process or something went wrong along the way. Sorry about that. Feel free to try again."
  >
    <BaseButtonLink href="/plans" color="primary" variant="contained" size="large">
      Back to plans
    </BaseButtonLink>
  </PageError>
)

export default Canceled
