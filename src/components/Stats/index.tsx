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
      <strong>Secrets</strong> | Created:&nbsp;
      {new Intl.NumberFormat('en-US').format(data?.totalSecretsCount || 0)} | Viewed:&nbsp;
      {new Intl.NumberFormat('en-US').format(data?.totalSecretsViewCount || 0)} |
      Compromised:&nbsp;0
    </span>
  )
}

export default Stats
