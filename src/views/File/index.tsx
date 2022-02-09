import { Widget } from '@/views/Home'
import { useTranslation } from 'next-i18next'
import { Typography } from '@material-ui/core'
import styled from 'styled-components'

import { CustomPage } from '@/types'
import Page from '@/components/Page'

const Disclaimer = styled(Typography)`
  opacity: 0.7;
  margin-top: 0.4em;
  margin-bottom: 0.3em;
`

const FileView: CustomPage = () => {
  const { t } = useTranslation('common')

  return (
    <Page
      title={t('common:views.Files.title', 'X Files')}
      subtitle={t('common:views.Files.subtitle', 'Share end-to-end encrypted files. One time.')}
      isBeta
    >
      <Widget limitedToSecretType="file" />

      <Disclaimer variant="body2">
        {t(
          'common:views.Files.flowDisclaimer',
          'File will be end-to-end encrypted and stored in Zürich, Switzerland by Flow Swiss AG.',
        )}
      </Disclaimer>
    </Page>
  )
}

export default FileView
