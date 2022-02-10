import { Widget } from '@/views/Home'
import { useTranslation } from 'next-i18next'

import { CustomPage } from '@/types'
import Page from '@/components/Page'

const Redirect: CustomPage = () => {
  const { t } = useTranslation('common')

  return (
    <Page
      title={t('common:views.Redirect.title', 'Secret Redirect')}
      subtitle={t('common:views.Redirect.subtitle', 'Create a one-time redirect. Without a trace.')}
    >
      <Widget limitedToSecretType="url" />
    </Page>
  )
}

export default Redirect
