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
      <strong>Secrets</strong> created:&nbsp;
      {new Intl.NumberFormat('en-US').format(data?.totalSecretsCount || 0)} | viewed:&nbsp;
      {new Intl.NumberFormat('en-US').format(data?.totalSecretsViewCount || 0)} |
      compromised:&nbsp;0
    </span>
  )
}

export default Stats
