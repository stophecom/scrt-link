import React from 'react'

import { useStats } from '@/utils/api'

const Stats = () => {
  const { stats } = useStats()

  return (
    <>
      <div>
        <strong>Secrets</strong>&nbsp;
      </div>
      <div>
        created:&nbsp;
        {new Intl.NumberFormat('en-US').format(stats?.totalSecretsCount || 0)} | viewed:&nbsp;
        {new Intl.NumberFormat('en-US').format(stats?.totalSecretsViewCount || 0)} |
        compromised:&nbsp;0
      </div>
    </>
  )
}

export default Stats
