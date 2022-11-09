import React, { useEffect, useState, useReducer } from 'react'
import { styled } from '@mui/system'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Formik, Form, FormikConfig } from 'formik'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Alert, Paper, Box, Typography } from '@mui/material'
import { FileCopyOutlined as FileCopyOutlinedIcon } from '@mui/icons-material'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import usePrettyBytes from '@/hooks/usePrettyBytes'
import { api } from '@/utils/api'
import { CustomError } from '@/api/utils/createError'
import { decryptMessage, retrieveSecret } from 'scrt-link-core'
import { getBaseURL } from '@/utils'
import { CustomPage } from '@/types'
import { LayoutMinimal } from '@/layouts/Default'
import { BaseButtonLink } from '@/components/Link'
import Neogram from '@/components/Neogram'
import ReplyButton from './components/ReplyButton'
import { passwordValidationSchema } from '@/utils/validationSchemas'
import { sanitizeUrl } from '@/utils/index'
import { SecretUrlFields } from '@/api/models/SecretUrl'
import BasePasswordField from '@/components/BasePasswordField'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import Page from '@/components/Page'
import { decryptFile, decryptString } from '@/utils/crypto'

const Markdown = dynamic(() => import('@/components/Markdown'))
const PREFIX = 'AliasView'

const classes = {
  break: `${PREFIX}-break`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.break}`]: {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
}))

// t('common:error.API_SECRET_NOT_FOUND', 'Secret not found - This usually means the secret link has already been visited and therefore no longer exists.')

type FileMeta = {
  bucket: string
  key: string
  name: string
  size: number
  fileType: string
  message?: string
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']
type SecretState = Omit<SecretUrlFields, 'receiptEmail' | 'receiptPhoneNumber' | 'receiptApi'> & {
  decryptionKey: string
}

const AliasView: CustomPage = () => {
  const router = useRouter()
  const prettyBytes = usePrettyBytes()
  const { t } = useTranslation()

  const { preview, f } = router.query

  // Use preview mode if data if passed via URL params
  let previewData = {} as Partial<SecretState>
  if (preview) {
    const obj = decodeURIComponent(preview as string)
    previewData = JSON.parse(obj)
  }
  const isPreview = previewData?.secretType

  // Render secret as markdown
  // Use parameter "?f=md"
  type Format = 'md' | null
  let format: Format = null
  if (f) {
    format = decodeURIComponent(f as string) as Format
  }

  const titles = [
    t('common:views.Alias.title1', 'Shhh'),
    t('common:views.Alias.title2', 'Knock Knock'),
    t('common:views.Alias.title3', 'Hello'),
    t('common:views.Alias.title4', 'Incoming…'),
  ]

  const [hasCopied, setHasCopied] = useState(false)
  const [isSecretRevealed, revealSecret] = useReducer(() => true, false)
  const [secret, setSecret] = useState<Partial<SecretState>>({})
  const [file, setFile] = useState<Partial<FileMeta & { url: string }>>({})
  const [error, setError] = useState<Error['message']>('')
  const [title, setTitle] = useState(titles[0])

  const {
    message,
    isEncryptedWithUserPassword = false,
    secretType = 'text',
    neogramDestructionTimeout,
    neogramDestructionMessage,
    decryptionKey,
  } = secret

  // Cleanup state
  useEffect(() => {
    const handleRouteChange = () => {
      setSecret({})
    }

    setTitle(titles[Math.floor(Math.random() * titles.length)])

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  })

  useEffect(() => {
    const fetchSecret = async () => {
      if (message || !isSecretRevealed) {
        return
      }

      try {
        const hashData = window.location.hash.substring(1).split('/')
        const alias = hashData[0]
        const decryptionKey = hashData[1]

        if (!alias || typeof alias !== 'string') {
          throw new Error(t('common:error.invalidAlias', 'Invalid alias.'))
        }
        if (!decryptionKey) {
          throw new Error(t('common:error.missingDecryptionKey', 'Decryption key missing.'))
        }

        const secret = await retrieveSecret(alias, decryptionKey, getBaseURL())

        if (!secret.message) {
          throw new Error(t('common:error.noMessage', 'No message.'))
        }

        setSecret({ ...secret, decryptionKey })

        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, 'Secret destroyed', 'l/🔥')
      } catch (e: unknown) {
        let error = `Undefined error: ${JSON.stringify(e)}`

        if (e instanceof Error) {
          error = e.message
        }

        // Custom error
        if ((e as CustomError)?.i18nErrorKey) {
          error = t(`common:error.${(e as CustomError)?.i18nErrorKey}`)
        }
        setError(error)
      }
    }

    if (isPreview) {
      setSecret(previewData)
    } else {
      fetchSecret()
    }
  }, [isSecretRevealed])

  // Additional actions after password
  useEffect(() => {
    handlePasswordInput()
  }, [isEncryptedWithUserPassword, secretType])

  interface PasswordForm {
    message: string
    password: string
  }
  const initialValues: PasswordForm = {
    message: '',
    password: '',
  }

  const handlePasswordSubmit: OnSubmit<PasswordForm> = async (values, formikHelpers) => {
    try {
      const { message, password } = values
      const result = decryptMessage(message, password)

      if (!result) {
        throw new Error(t('common:error.wrongPassword', 'Wrong Password'))
      } else {
        setSecret((previousState) => ({
          ...previousState,
          message: result,
          isEncryptedWithUserPassword: false,
        }))
      }

      formikHelpers.resetForm()
    } catch (error) {
      formikHelpers.setErrors({ password: t('common:error.wrongPassword', 'Wrong Password') })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const handlePasswordInput = async () => {
    if (isEncryptedWithUserPassword) {
      return
    }

    if (secretType === 'file') {
      if (!message || !decryptionKey) {
        throw new Error(`Missing data to fetch file.`)
      }

      const decryptedFileMeta = await decryptString(message, decryptionKey)
      const meta: FileMeta = JSON.parse(decryptedFileMeta)

      const { key, bucket, name } = meta

      if (!key) {
        throw new Error(`Couldn't get file meta data.`)
      }

      setFile({ ...meta })

      const { url } = await api(`/files?file=${key}&bucket=${bucket}`, { method: 'DELETE' })
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Couldn't retrieve file - it may no longer exist.`)
      }

      const encryptedFile = await response.blob()
      const decryptedFile = await decryptFile(encryptedFile, decryptionKey, name)

      const objectUrl = window.URL.createObjectURL(decryptedFile)
      setFile((prevState) => {
        return { ...prevState, url: objectUrl }
      })
    }
  }

  if (error && !isPreview) {
    return (
      <Page title={t('common:views.Alias.errorOccurred', 'Error occurred')} noindex>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <ReplyButton />
        </Box>
      </Page>
    )
  }

  const Inner = () => {
    if (!isSecretRevealed) {
      return (
        <Box mb={3}>
          <Paper className={clsx(classes.break)} variant="outlined">
            <Box
              px={4}
              py={4}
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems="center"
            >
              <Typography
                variant={'body2'}
                mb={{ xs: 2, sm: 0 }}
                mr={{ xs: 0, sm: 2 }}
                display={'flex'}
              >
                {t(
                  'common:views.Alias.secretRevelationInfo',
                  `Be aware! The following secret can only be revealed one time.`,
                )}
              </Typography>

              <BaseButton
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
                size="large"
                onClick={revealSecret}
              >
                {t('common:button.revealSecret', 'Reveal Secret')}
              </BaseButton>
            </Box>
          </Paper>
        </Box>
      )
    }

    if (message) {
      if (isEncryptedWithUserPassword) {
        return (
          <Paper
            className={clsx(classes.break)}
            variant="outlined"
            sx={{ borderColor: (theme) => theme.palette.primary.main }}
          >
            <Box px={4} pt={4} pb={2}>
              <Typography variant="h3" color="primary">
                {t('common:views.Alias.passwordRequired', 'Password required')}
              </Typography>
              <Typography variant="subtitle2">
                {t('common:views.Alias.enterPassword', 'Enter password to decrypt your secret:')}
              </Typography>

              <Formik<PasswordForm>
                initialValues={initialValues}
                validationSchema={passwordValidationSchema(t)}
                validateOnMount
                onSubmit={handlePasswordSubmit}
              >
                {({ isValid, isSubmitting, setFieldValue }) => {
                  return (
                    <>
                      <Form noValidate>
                        <Box mb={2}>
                          <BasePasswordField required name="password" />
                        </Box>
                        <Box mb={1}>
                          <BaseButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            loading={isSubmitting}
                            disabled={!isValid}
                            onClick={() => {
                              setFieldValue('message', message)
                            }}
                          >
                            {t('common:button.decryptMessage', 'Decrypt Message')}
                          </BaseButton>
                        </Box>
                      </Form>
                    </>
                  )
                }}
              </Formik>
            </Box>
          </Paper>
        )
      } else {
        switch (secretType) {
          case 'url': {
            window.location.replace(sanitizeUrl(message))
            return null
          }
          case 'neogram': {
            return (
              <Neogram
                message={message}
                open={true}
                timeout={Number(neogramDestructionTimeout)}
                destructionMessage={neogramDestructionMessage}
                onFinished={() => {
                  setTimeout(() => router.push('/'), 100)
                }}
              />
            )
          }
          case 'file': {
            if (!file.size) {
              return null
            }
            const { name, fileType, size, url, message } = file

            return (
              <Box mb={3}>
                <Box mb={1}>
                  <Alert severity="info">
                    {t(
                      'common:views.Alias.file.warning',
                      'Important! We have absolutely no knowledge about the contents of the file. Be sure to trust the sender!',
                    )}
                  </Alert>
                </Box>

                <Paper className={clsx(classes.break)} variant="outlined">
                  <Box px={4} pt={3} pb={3}>
                    <Box mb={2}>
                      <Typography variant="subtitle2">
                        {t('common:views.Alias.file.info', 'Secret file')}
                      </Typography>
                      <Typography variant="body1">
                        <Box display={'flex'}>
                          <Typography mr={1} fontWeight={'bold'}>
                            {t('common:views.Alias.file.name', 'Name')}:
                          </Typography>
                          <Typography noWrap mr={2}>
                            {name}
                          </Typography>
                        </Box>
                        <Box display={'flex'}>
                          <Typography mr={1} fontWeight={'bold'}>
                            {t('common:views.Alias.file.type', 'Type')}:
                          </Typography>
                          <Typography noWrap mr={2}>
                            {fileType}
                          </Typography>
                        </Box>
                        <Box display={'flex'}>
                          <Typography mr={1} fontWeight={'bold'}>
                            {t('common:views.Alias.file.size', 'Size')}:
                          </Typography>
                          <Typography noWrap mr={2}>
                            {prettyBytes(size)}
                          </Typography>
                        </Box>
                        {message && (
                          <Box display={'flex'}>
                            <Typography mr={1} fontWeight={'bold'}>
                              {t('common:views.Alias.file.optionalMessage', 'Message')}:
                            </Typography>
                            <Typography fontStyle={'italic'} mr={2}>
                              {message}
                            </Typography>
                          </Box>
                        )}
                      </Typography>
                    </Box>
                    <BaseButton
                      component={'a'}
                      href={url}
                      download={name}
                      variant="contained"
                      loading={!url}
                      disabled={!url}
                      color="primary"
                      size="large"
                      fullWidth
                    >
                      {t('common:views.Alias.file.button.label', 'Decrypt and Download')}
                    </BaseButton>
                  </Box>
                </Paper>

                <Box mt={2}>
                  <ReplyButton />
                </Box>
              </Box>
            )
          }
          default: {
            return (
              <Box mb={3}>
                <Paper variant="outlined">
                  <Box px={{ xs: 3, sm: 4 }} pt={4} pb={2}>
                    <Box id="secret-decrypted">
                      {format === 'md' ? (
                        <Markdown source={message} />
                      ) : (
                        <Box className={clsx(classes.break)} sx={{ fontSize: '1.2rem' }}>
                          {message}
                        </Box>
                      )}
                    </Box>

                    <Box pt={2} display="flex" justifyContent="flex-end">
                      <Box mr={2}>
                        <BaseButtonLink href="/" variant="text" color="primary">
                          {t('common:button.destroySecret', 'Destroy secret')}
                        </BaseButtonLink>
                      </Box>
                      {format !== 'md' && (
                        <CopyToClipboard
                          text={message}
                          onCopy={() => {
                            setHasCopied(true)
                            setTimeout(() => {
                              setHasCopied(false)
                            }, 2000)
                          }}
                        >
                          <BaseButton
                            startIcon={<FileCopyOutlinedIcon />}
                            variant="contained"
                            color="primary"
                          >
                            {hasCopied
                              ? t('common:button.copied', 'Copied')
                              : t('common:button.copy', 'Copy')}
                          </BaseButton>
                        </CopyToClipboard>
                      )}
                    </Box>
                  </Box>
                </Paper>

                <Box mt={2}>
                  <ReplyButton />
                </Box>
              </Box>
            )
          }
        }
      }
    }
    return <Spinner message={t('common:views.Alias.loadingSecret', 'Loading secret')} />
  }

  return (
    <Page
      title={title}
      subtitle={t('common:views.Alias.subtitle', 'You received a secret')}
      noindex
    >
      <Root>
        <Inner />
      </Root>
    </Page>
  )
}

AliasView.layout = LayoutMinimal
export default AliasView

export const getServerSideProps: GetServerSideProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
