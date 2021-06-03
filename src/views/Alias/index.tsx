import React, { useEffect, useCallback, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Formik, Form, FormikConfig } from 'formik'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import crawlers from 'crawler-user-agents'
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
interface AliasViewProps {
  preview?: Partial<SecretUrlFields>
}
const AliasView: NextPage<AliasViewProps & Pick<SecretUrlFields, 'alias'>> = ({
  alias,
  preview = {},
}) => {
  const classes = useStyles()
  const router = useRouter()

  const { data = {}, error } = useSecret(alias)

  // If preview mode
  const secret = preview?.secretType ? preview : data

  const {
    message,
    isEncryptedWithUserPassword = false,
    secretType = 'text',
    neogramDestructionTimeout,
    neogramDestructionMessage,
  } = secret

  const [hasCopied, setHasCopied] = useState(false)
  const [decryptedMessage, setDecryptedMessage] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [decryptionSuccess, setDecryptionSuccess] = useState(false)

  const needsPassword = isEncryptedWithUserPassword && !passwordSuccess

  useEffect(() => {
    // Decrypt message
    if (!message || passwordSuccess || decryptionSuccess) {
      return
    }
    const decryptionKey = window.location.hash.substring(1)
    if (decryptionKey) {
      const result = decryptMessage(message, decryptionKey)

      if (!isEncryptedWithUserPassword && secretType === 'url') {
        window.location.replace(sanitizeUrl(result))
        return
      }
      setDecryptedMessage(result)
      setDecryptionSuccess(true)
    }

    // eslint-disable-next-line no-restricted-globals
    // history.pushState(null, 'Secret destroyed', '🔥')
  }, [message])

  interface PasswordForm {
    message: string
    password: string
  }
  const initialValues: PasswordForm = {
    message: '',
    password: '',
  }

  const handleSubmit = useCallback<OnSubmit<PasswordForm>>(async (values, formikHelpers) => {
    try {
      const { message, password } = values
      const result = decryptMessage(message, password)

      if (!result) {
        throw new Error('Wrong Password')
      } else {
        setPasswordSuccess(true)
        setDecryptedMessage(result)

        if (secretType === 'url') {
          window.location.replace(sanitizeUrl(result))
        }
      }

      formikHelpers.resetForm()
    } catch (error) {
      formikHelpers.setErrors({ password: 'Wrong Password' })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }, [])

  if (error && !needsPassword && !decryptedMessage) {
    return (
      <Page title="Error occured" noindex>
        <Alert severity="error">{error}</Alert>
        <Box mt={3}>
          <ReplyButton />
        </Box>
      </Page>
    )
  }

  if (!needsPassword && secretType === 'neogram') {
    return (
      <Neogram
        message={decryptedMessage}
        timeout={Number(neogramDestructionTimeout)}
        destructionMessage={neogramDestructionMessage}
        onFinished={() => {
          setTimeout(() => router.push('/'), 100)
        }}
      />
    )
  }

  if (needsPassword) {
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
                        setFieldValue('message', decryptedMessage)
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
  }

  if (decryptedMessage) {
    return (
      <Page title="Shhh" subtitle="You received a secret:" noindex>
        <Box mb={3}>
          <Paper elevation={3} className={clsx(classes.break, classes.message)}>
            <Box px={4} pt={4} pb={2}>
              {decryptedMessage}
              <Box pt={2} display="flex" justifyContent="flex-end">
                <Box mr={2}>
                  <BaseButtonLink href="/" variant="text" color="primary" size="small">
                    Destroy secret
                  </BaseButtonLink>
                </Box>
                <CopyToClipboard
                  text={decryptedMessage}
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

          <Box mt={3}>
            <ReplyButton />
          </Box>
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

  // Block crawlers
  const userAgent = req?.headers['user-agent']
  if (userAgent && crawlers.some(({ pattern }) => RegExp(pattern).test(userAgent))) {
    return { notFound: true }
  }

  return { props: { alias } }
}

export default AliasView
