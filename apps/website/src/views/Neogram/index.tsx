import { Widget } from '@/views/Home'
import { useTranslation } from 'next-i18next'

import { CustomPage } from '@/types'
import Page from '@/components/Page'

const Neogram: CustomPage = () => {
  const { t } = useTranslation('common')

  return (
    <Page
      title={t('common:views.Neogram.title', 'Neogram')}
      subtitle={t(
        'common:views.Neogram.subtitle',
        'Matrix-style disappearing messages. End-to-end encrypted.',
      )}
    >
      <Widget limitedToSecretType="neogram" />
    </Page>
  )
}

export default Neogram
