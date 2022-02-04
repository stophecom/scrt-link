import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Formik, Form, FormikConfig } from 'formik'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { formatBytes } from '@/utils/index'
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

// t('common:error.SECRET_NOT_FOUND', 'Secret not found - This usually means the secret link has already been visited and therefore no longer exists.')

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']
type SecretState = Omit<SecretUrlFields, 'receiptEmail' | 'receiptPhoneNumber' | 'receiptApi'>
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    break: {
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    message: {
      fontSize: '1.1rem',
    },
  }),
)

const AliasView: CustomPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const { t } = useTranslation()

  const { alias, preview } = router.query

  // Use preview mode if data if passed via URL params
  let previewData = {} as Partial<SecretState>
  if (preview) {
    const obj = decodeURIComponent(preview as string)
    previewData = JSON.parse(obj)
  }
  const isPreview = previewData?.secretType

  const [hasCopied, setHasCopied] = useState(false)
  const [secret, setSecret] = useState({} as Partial<SecretState>)
  const [s3FileUrl, setS3FileUrl] = useState<URL | null>(null)
  const [error, setError] = useState('' as Error['message'])

  const {
    message,
    isEncryptedWithUserPassword = false,
    secretType = 'text',
    neogramDestructionTimeout,
    neogramDestructionMessage,
    file,
  } = secret

  // Cleanup state
  useEffect(() => {
    const handleRouteChange = () => {
      setSecret({})
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  })

  useEffect(() => {
    const fetchSecret = async () => {
      if (!alias || message) {
        return
      }

      try {
        const decryptionKey = window.location.hash.substring(1)

        if (!decryptionKey) {
          throw new Error(t('common:error.missingDecryptionKey', 'Decryption key missing.'))
        }

        if (typeof alias !== 'string') {
          throw new Error(t('common:error.invalidAlias', 'Invalid alias.'))
        }

        const secret = await retrieveSecret(alias, decryptionKey, getBaseURL())
        setSecret({ ...secret })
        console.log(secret)

        // Download files
        if (secret.secretType === 'file' && secret?.file) {
          console.log(secret)
          const { key, bucket } = secret.file
          const { url } = await api(`/files?file=${key}&bucket=${bucket}`, { method: 'DELETE' })
          setS3FileUrl(url)
        }

        // eslint-disable-next-line no-restricted-globals
        // history.replaceState(null, 'Secret destroyed', '🔥')
      } catch (error) {
        let err = error as CustomError

        setError(`${err?.i18nErrorKey ? t(`common:error.${err.i18nErrorKey}`) : err.message}`)
      }
    }

    if (isPreview) {
      setSecret(previewData)
    } else {
      fetchSecret()
    }
  }, [alias])

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
          isEncryptedWithUserPassword: undefined,
        }))
      }

      formikHelpers.resetForm()
    } catch (error) {
      formikHelpers.setErrors({ password: t('common:error.wrongPassword', 'Wrong Password') })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  if (message) {
    if (isEncryptedWithUserPassword) {
      return (
        <Page
          title={t('common:views.Alias.passwordRequired', 'Password required')}
          subtitle={t('common:views.Alias.enterPassword', 'Enter password to decrypt your secret:')}
          noindex
        >
          <Formik<PasswordForm>
            initialValues={initialValues}
            validationSchema={passwordValidationSchema}
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
        </Page>
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
              timeout={Number(neogramDestructionTimeout)}
              destructionMessage={neogramDestructionMessage}
              onFinished={() => {
                setTimeout(() => router.push('/'), 100)
              }}
            />
          )
        }
        case 'file': {
          if (!file) {
            setError('File information missing!')
            return
          }

          const { name, fileType, size } = file

          return (
            <Page
              title={t('common:views.Alias.file.title', 'Knock knock')}
              subtitle={t('common:views.Alias.file.subtitle', 'You received a secret file:')}
              noindex
            >
              <Box mb={3}>
                <Box mb={1}>
                  <Alert severity="info">
                    {t(
                      'common:views.Alias.file.warning',
                      'Important! We have absolutely no knowledge about the contents of the file. Be sure to trust the sender!',
                    )}
                  </Alert>
                </Box>

                <Paper elevation={3} className={clsx(classes.break, classes.message)}>
                  <Box px={4} pb={2}>
                    <Box mb={3}>
                      <Typography variant="body2">
                        <br />
                        <strong>Name:</strong> {name}
                        <br />
                        <strong>Type:</strong> {fileType}
                        <br />
                        <strong>Size:</strong> {formatBytes(size)}
                        <br />
                        <br />
                        <em>Optional message:</em> {message}
                      </Typography>
                    </Box>
                    {s3FileUrl && (
                      <BaseButton
                        component={'a'}
                        href={s3FileUrl}
                        download
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Decrypt and Download
                      </BaseButton>
                    )}
                  </Box>
                </Paper>

                <Box mt={2}>
                  <ReplyButton />
                </Box>
              </Box>
            </Page>
          )
        }
        default: {
          return (
            <Page
              title={t('common:views.Alias.title', 'Shhh')}
              subtitle={t('common:views.Alias.subtitle', 'You received a secret:')}
              noindex
            >
              <Box mb={3}>
                <Paper elevation={3} className={clsx(classes.break, classes.message)}>
                  <Box px={4} pt={4} pb={2}>
                    {message}
                    <Box pt={2} display="flex" justifyContent="flex-end">
                      <Box mr={2}>
                        <BaseButtonLink href="/" variant="text" color="primary" size="small">
                          {t('common:button.destroySecret', 'Destroy secret')}
                        </BaseButtonLink>
                      </Box>
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
                          size="small"
                        >
                          {hasCopied
                            ? t('common:button.copied', 'Copied')
                            : t('common:button.copy', 'Copy')}
                        </BaseButton>
                      </CopyToClipboard>
                    </Box>
                  </Box>
                </Paper>

                <Box mt={2}>
                  <ReplyButton />
                </Box>
              </Box>
            </Page>
          )
        }
      }
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

  return <Spinner message={t('common:views.Alias.loadingSecret', 'Loading secret')} />
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
