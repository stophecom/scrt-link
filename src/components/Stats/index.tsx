import React from 'react'
import { isEmpty } from 'ramda'
import { Typography } from '@material-ui/core'

import { usePusher } from '@/utils/pusher'
import { StatsFields } from '@/api/models/Stats'

import { UIStore } from '@/store'
import { useStats } from '@/utils/api'
import { useCustomerStats } from '@/utils/api'

const Stats = () => {
  const liveStatsEnabled = UIStore.useState((s) => s.liveStatsEnabled)

  const { stats } = useStats()
  const realtimeData = usePusher('stats', 'stats-update', liveStatsEnabled) as StatsFields

  const data = isEmpty(realtimeData) ? stats : realtimeData

  if (!data) {
    return null
  }

  return (
    <>
      <div>
        <strong>Secrets</strong>&nbsp;
      </div>
      <div>
        created:&nbsp;
        {new Intl.NumberFormat('en-US').format(data?.totalSecretsCount || 0)} | viewed:&nbsp;
        {new Intl.NumberFormat('en-US').format(data?.totalSecretsViewCount || 0)} |
        compromised:&nbsp;0
      </div>
    </>
  )
}

type PersonalStatsProps = {
  userId?: string
}
export const PersonalStats: React.FunctionComponent<PersonalStatsProps> = ({ userId }) => {
  const { stats } = useCustomerStats(userId)

  return (
    <Typography variant="body1">
      <strong>Total secrets created: {stats?.totalSecretsCount ?? 0}</strong>
      <br />
      Text:&nbsp;{stats?.secretsCount?.text ?? 0}
      <br />
      URL:&nbsp;{stats?.secretsCount?.url ?? 0}
      <br />
      Neogram:&nbsp;
      {stats?.secretsCount?.neogram ?? 0}
    </Typography>
  )
}

export default Stats
