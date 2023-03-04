import { Widget } from '@/views/Home'
import { useTranslation } from 'next-i18next'
import { Typography } from '@mui/material'
import { Lock } from '@mui/icons-material'
import { styled } from '@mui/system'

import { CustomPage } from '@/types'
import Page from '@/components/Page'

const Disclaimer = styled(Typography)`
  opacity: 0.7;
  margin-top: 5em;
  margin-bottom: 0.3em;
  padding-left: clamp(0.1em, 10vw, 10em);
  padding-right: clamp(0.1em, 10vw, 10em);
  text-align: center;
`

const LockIcon = styled(Lock)`
  font-size: 1em;
  margin-right: 0.2em;
  position: relative;
  bottom: -0.1em;
`

const FilesView: CustomPage = () => {
  const { t } = useTranslation('common')

  return (
    <Page
      title={t('common:views.Files.title', 'Secret file')}
      subtitle={t('common:views.Files.subtitle', 'Share end-to-end encrypted files. One time.')}
      isBeta
    >
      <Widget limitedToSecretType="file" />

      <Disclaimer variant="body2">
        <LockIcon />
        {t(
          'common:views.Files.flowDisclaimer',
          'Swiss privacy: Files will be end-to-end encrypted and stored in Zürich, Switzerland by Flow Swiss AG.',
        )}
      </Disclaimer>
    </Page>
  )
}

export default FilesView
