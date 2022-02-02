import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'
import Alert from '@material-ui/lab/Alert'

import { api } from '@/utils/api'
import { CustomPage } from '@/types'
import Page from '@/components/Page'
import DropZone from '@/components/DropZone'
import BaseButton from '@/components/BaseButton'
import { Error } from '@/components/Error'

const Disclaimer = styled(Typography)`
  opacity: 0.7;
  margin-top: 0.4em;
  margin-bottom: 0.3em;
`

const FilesView: CustomPage = () => {
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState(null)

  const { t } = useTranslation('common')

  const uploadFile = async (file: File) => {
    const filename = encodeURIComponent(file.name)
    const { url, fields } = await api(`/files?file=${filename}`)
    const formData = new FormData()

    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        return
      }
      formData.append(key, value)
    })
    formData.append('Content-type', 'application/octet-stream') // Setting content type a binary file.
    formData.append('file', file)

    // Using axios instead of fetch for progress info
    axios
      .request({
        method: 'post',
        url,
        data: formData,
        onUploadProgress: (p) => {
          setProgress(p.loaded / p.total)
        },
      })
      .then(() => {
        setProgress(1)
      })
      .catch((error) => {
        console.error(error)
        setProgress(0)
        setError(t('common:views.Files.error.fileUpload', 'Upload failed.'))
      })
  }

  return (
    <Page
      title={t('common:views.Files.title', 'X Files')}
      subtitle={t('common:views.Files.subtitle', 'Share end-to-end encrypted files. One time.')}
      isBeta
    >
      {progress === 1 && (
        <Alert severity="success">{t('common:views.Files.success', 'Upload successful!')}</Alert>
      )}

      <DropZone
        onChange={(file) => {
          setFile(file)
          setProgress(0)
          setError(null)
        }}
      />

      <Box key="upload" mt={1} display="flex" alignItems="center" flexDirection={'column'}>
        <BaseButton
          fullWidth={true}
          onClick={() => {
            setError(null)
            file && uploadFile(file)
          }}
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          loading={progress > 0 && progress < 1}
          disabled={!file}
        >
          {t('common:button.createSecretLink', 'Create secret link')}
        </BaseButton>

        {file && (
          <>
            <p>{progress * 100}%</p>
            <Disclaimer variant="body2">
              {t(
                'common:views.Files.flowDisclaimer',
                'File will be end-to-end encrypted and stored in Zürich, Switzerland by Flow Swiss AG.',
              )}
            </Disclaimer>
          </>
        )}
      </Box>

      {error && <Error error={error} />}
    </Page>
  )
}

export default FilesView
