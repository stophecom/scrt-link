import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'
import Alert from '@material-ui/lab/Alert'
import { createSecret, generateAlias, generateEncryptionKey } from 'scrt-link-core'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'
import { getBaseURL } from '@/utils'

import { api } from '@/utils/api'
import { CustomPage } from '@/types'
import Page from '@/components/Page'
import DropZone from '@/components/DropZone'
import BaseButton from '@/components/BaseButton'
import { Error } from '@/components/Error'
import { encryptFile, generateEncryptionKeyString } from '@/utils/file'

const Disclaimer = styled(Typography)`
  opacity: 0.7;
  margin-top: 0.4em;
  margin-bottom: 0.3em;
`
const bucket = process.env.NEXT_PUBLIC_FLOW_S3_BUCKET

type PresignedPostResponse = { url: string; fields: Record<string, string> }

const FilesView: CustomPage = () => {
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState(null)
  const [secretLink, setSecretLink] = useState<string | null>(null)

  const { t, i18n } = useTranslation('common')

  const uploadFile = async (file: File) => {
    const filename = encodeURIComponent(file.name)

    try {
      const alias = generateAlias()
      // const encryptionKey = generateEncryptionKey() //old method
      const encryptionKey = await generateEncryptionKeyString()

      const encryptedFile = await encryptFile(file, encryptionKey)

      const { url, fields } = await api<PresignedPostResponse>(
        `/files?file=${filename}&bucket=${bucket}`,
      )

      // Save reference to DB
      await createSecret(
        'You received a file!',
        {
          alias,
          encryptionKey,
          secretType: 'file',
          file: {
            bucket: bucket,
            key: filename,
            name: file.name,
            size: file.size,
            fileType: file.type,
          },
        },
        getBaseURL(),
      )

      // Generate secret link (don't wait until everything is done.)
      const link = getAbsoluteLocalizedUrl(`/l/${alias}#${encryptionKey}`, i18n.language)
      setSecretLink(link)

      // Post file to S3
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        if (typeof value !== 'string') {
          return
        }
        formData.append(key, value)
      })
      formData.append('Content-type', 'application/octet-stream') // Setting content type a binary file.
      formData.append('file', encryptedFile)

      // Using axios instead of fetch for progress info
      await axios.request({
        method: 'POST',
        url,
        data: formData,
        onUploadProgress: (p) => {
          setProgress(p.loaded / p.total)
        },
      })

      setProgress(1)
    } catch (error) {
      console.error({ error })
      setProgress(0)
      setError(t('common:views.Files.error.fileUpload', 'Upload failed.'))
    }
  }

  return (
    <Page
      title={t('common:views.Files.title', 'X Files')}
      subtitle={t('common:views.Files.subtitle', 'Share end-to-end encrypted files. One time.')}
      isBeta
    >
      {secretLink && <Alert severity="info">{secretLink}</Alert>}

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
