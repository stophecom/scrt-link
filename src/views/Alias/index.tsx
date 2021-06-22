import React, { useEffect, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Formik, Form, FormikConfig } from 'formik'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'

import { useRouter } from 'next/router'

import { BaseButtonLink } from '@/components/Link'
import Neogram from '@/components/Neogram'
import ReplyButton from './components/ReplyButton'
import { passwordValidationSchema } from '@/utils/validationSchemas'
import { sanitizeUrl, decryptMessage } from '@/utils/index'
import { SecretUrlFields } from '@/api/models/SecretUrl'
import BasePasswordField from '@/components/BasePasswordField'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import Page from '@/components/Page'
import { useSecret } from '@/utils/api'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

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
type AliasViewProps = {
  preview?: Partial<SecretUrlFields>
  alias?: SecretUrlFields['alias']
  userAgent?: string
}
const AliasView: NextPage<AliasViewProps> = ({ alias, userAgent, preview = {} }) => {
  const classes = useStyles()
  const router = useRouter()

  const { data = {}, error: apiErrorMessage } = useSecret(alias, userAgent)

  // Use preview mode if data if passed via URL params
  const isPreview = preview?.secretType
  const secretRaw = isPreview ? preview : data

  const [hasCopied, setHasCopied] = useState(false)
  const [secret, setSecret] = useState({} as Partial<SecretUrlFields>)
  const [error, setError] = useState('' as Error['message'])

  const {
    message,
    isEncryptedWithUserPassword = false,
    secretType = 'text',
    neogramDestructionTimeout,
    neogramDestructionMessage,
  } = secret

  useEffect(() => {
    // Decrypt message once
    if (message || !secretRaw?.message) {
      return
    }

    // No need for decryption in preview mode
    if (isPreview) {
      setSecret(secretRaw)
    }
    try {
      const decryptionKey = window.location.hash.substring(1)
      if (decryptionKey) {
        const result = decryptMessage(secretRaw.message, decryptionKey)
        if (!result) {
          throw new Error('Decryption failed.')
        }
        setSecret({ ...secretRaw, message: result })
      }
    } catch (error) {
      setError(error.message)
    }

    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, 'Secret destroyed', '🔥')
  }, [secretRaw])

  // Catch error
  useEffect(() => {
    if (apiErrorMessage) {
      setError(apiErrorMessage)
    }
  }, [apiErrorMessage])

  interface PasswordForm {
    message: string
    password: string
  }
  const initialValues: PasswordForm = {
    message: '',
    password: '',
  }

  const handleSubmit: OnSubmit<PasswordForm> = async (values, formikHelpers) => {
    try {
      const { message, password } = values
      const result = decryptMessage(message, password)

      if (!result) {
        throw new Error('Wrong Password')
      } else {
        setSecret((previousState) => ({
          ...previousState,
          message: result,
          isEncryptedWithUserPassword: undefined,
        }))
      }

      formikHelpers.resetForm()
    } catch (error) {
      formikHelpers.setErrors({ password: 'Wrong Password' })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  if (message) {
    if (isEncryptedWithUserPassword) {
      return (
        <Page title="Password required" subtitle="Enter password to decrypt your secret:" noindex>
          <Formik<PasswordForm>
            initialValues={initialValues}
            validationSchema={passwordValidationSchema}
            validateOnMount
            onSubmit={handleSubmit}
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
                        Decrypt Message
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
        default: {
          return (
            <Page title="Shhh" subtitle="You received a secret:" noindex>
              <Box mb={3}>
                <Paper elevation={3} className={clsx(classes.break, classes.message)}>
                  <Box px={4} pt={4} pb={2}>
                    {message}
                    <Box pt={2} display="flex" justifyContent="flex-end">
                      <Box mr={2}>
                        <BaseButtonLink href="/" variant="text" color="primary" size="small">
                          Destroy secret
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
                          {hasCopied ? 'Copied' : 'Copy'}
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
      <Page title="Error occured" noindex>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <ReplyButton />
        </Box>
      </Page>
    )
  }

  return <Spinner message="Loading secret" />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context
  const {
    alias,
    preview, // This is for previews/demo only
  } = query

  if (preview) {
    const obj = decodeURIComponent(preview as string)

    return {
      props: {
        preview: JSON.parse(obj),
      },
    }
  }

  // Pass user agent to backend
  const userAgent = req?.headers['user-agent']

  return { props: { alias, userAgent } }
}

export default AliasView
