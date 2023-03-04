import React from 'react'
import { PageError } from '@/components/Error'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'

const Canceled = () => {
  const { t } = useTranslation('common')

  return (
    <PageError
      title={t('common:views.Pricing.Canceled.title', 'Payment canceled')}
      error={t(
        'common:views.Pricing.Canceled.error',
        'You either canceled the payment process or something went wrong along the way. Sorry about that. Feel free to try again.',
      )}
    >
      <BaseButtonLink href="/pricing" color="primary" variant="contained" size="large">
        {t('common:button.backToPlans', 'Back to plans')}
      </BaseButtonLink>
    </PageError>
  )
}

export default Canceled
