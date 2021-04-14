import React from 'react'

import { sanitizeUrl } from '@/utils/index'
import { useEventSource } from '@/utils/serverSentEvents'

import { StatsFields } from '@/api/models/Stats'

const Stats = () => {
  const data = useEventSource(
    `${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}/api/stats`,
  ) as null | StatsFields

  if (!data) {
    return null
  }

  return (
    <span>
      Secrets created: {new Intl.NumberFormat('en-US').format(data?.totalSecretsCount || 0)} |
      Viewed: {new Intl.NumberFormat('en-US').format(data?.totalSecretsViewCount || 0)} |
      Compromised: 0
    </span>
  )
}

export default Stats
