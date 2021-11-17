import React from 'react'
import { useTranslation } from 'next-i18next'

import { useStats } from '@/utils/api'

const Stats = () => {
  const { stats } = useStats()
  const { t } = useTranslation()
  return (
    <>
      <div>
        <strong>{t('common:components.Stats.title', 'Secrets')}</strong>&nbsp;
      </div>
      <div>
        {t('common:components.Stats.created', 'created:')}&nbsp;
        {new Intl.NumberFormat('en-US').format(stats?.totalSecretsCount || 0)} |{' '}
        {t('common:components.Stats.viewed', 'viewed:')}&nbsp;
        {new Intl.NumberFormat('en-US').format(stats?.totalSecretsViewCount || 0)} |{' '}
        {t('common:components.Stats.compromised', 'compromised:')}&nbsp;0
      </div>
    </>
  )
}

export default Stats
