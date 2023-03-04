import { Widget } from '@/views/Home'
import { useTranslation } from 'next-i18next'

import { CustomPage } from '@/types'
import Page from '@/components/Page'

const Text: CustomPage = () => {
  const { t } = useTranslation('common')

  return (
    <Page
      title={t('common:views.Text.title', 'Secret Text')}
      subtitle={t('common:views.Text.subtitle', 'Share end-to-end encrypted messages. One time.')}
    >
      <Widget limitedToSecretType="text" />
    </Page>
  )
}

export default Text
