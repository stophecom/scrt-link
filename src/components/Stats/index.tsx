import React from 'react'

import { usePusher } from '@/utils/pusher'
import { StatsFields } from '@/api/models/Stats'

const Stats = () => {
  const data = usePusher('/stats', 'stats', 'stats-update') as StatsFields

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
