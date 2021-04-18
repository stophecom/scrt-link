import React from 'react'

import { usePusher } from '@/utils/pusher'
import { StatsFields } from '@/api/models/Stats'

import { UIStore } from '@/store'

const Stats = () => {
  const liveStatsEnabled = UIStore.useState((s) => s.liveStatsEnabled)

  const data = usePusher('/stats', 'stats', 'stats-update', liveStatsEnabled) as StatsFields

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
