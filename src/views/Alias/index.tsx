import React, { useEffect, useCallback, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { Box, CircularProgress, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Formik, Form, FormikConfig } from 'formik'
import { AES, enc } from 'crypto-js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ReplyIcon from '@material-ui/icons/Reply'
import { usePlausible } from 'next-plausible'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import { WindupChildren, Pause } from 'windups'
import { sha256 } from 'js-sha256'

import crawlers from 'crawler-user-agents'

import { UserSettingsFields } from '@/api/models/UserSettings'
import { passwordValidationSchema } from '@/utils/validationSchemas'
import { sanitizeUrl } from '@/utils/index'
import { SecretType } from '@/types'
import BasePasswordField from '@/components/BasePasswordField'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

interface PasswordForm {
  password: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    break: {
      wordBreak: 'break-word',
    },
    message: {
      fontSize: '1.1rem',
    },
    replyButton: {
      opacity: 0,

      '&.visible': {
        opacity: 1,
      },
    },
  }),
)
interface AliasViewProps {
  error?: string
  message?: string
  isEncryptedWithUserPassword?: boolean
  secretType?: SecretType
  meta: Partial<UserSettingsFields>
}
const AliasView: NextPage<AliasViewProps> = ({
  error,
  message = '',
  isEncryptedWithUserPassword = false,
  secretType,
  meta = {},
}) => {
  const classes = useStyles()
  const plausible = usePlausible()

  const [hasCopied, setHasCopied] = useState(false)
  const [localMessage, setLocalMessage] = useState(message)
  const [success, setSuccess] = useState(false)

  const countDown = Array.from(Array(meta?.neogramDestructionTimeout || 5).keys()).reverse()

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, 'Secret destroyed', '💥')
  }, [])

  const SelfDestructionSequence = () => {
    return (
      <WindupChildren onFinished={() => window.location.reload()}>
        <Typography variant="subtitle1" className={classes.break}>
          {localMessage}
        </Typography>
        <Typography variant="subtitle1" color="primary">
          <Pause ms={2000} />
          {meta?.neogramDestructionMessage || 'This message will self-destruct in five seconds!'}
          <br />
          <Pause ms={1000} />
          {countDown.map((item) => {
            return (
              <>
                {item + 1}…
                <Pause ms={1000} />
              </>
            )
          })}
          <br />
          <Pause ms={1000} />
          {'Booooom 💥'}
        </Typography>
      </WindupChildren>
    )
  }

  const ReplyButton = () => (
    <BaseButton
      href="/"
      color="primary"
      variant="contained"
      size="large"
      startIcon={<ReplyIcon />}
      onClick={() => plausible('ReplyButton')}
    >
      Reply with a secret
    </BaseButton>
  )

  const initialValues: PasswordForm = {
    password: '',
  }

  const handleSubmit = useCallback<OnSubmit<PasswordForm>>(async (values, formikHelpers) => {
    try {
      const { password } = values

      const hash = sha256(password)
      const bytes = AES.decrypt(message, hash)

      const result = bytes.toString(enc.Utf8)
      if (!result) {
        throw new Error('Wrong Password')
      } else {
        setSuccess(true)
        setLocalMessage(result)

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

  if (!message && !error) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    )
  }

  const needsPassword = isEncryptedWithUserPassword && !success

  const pageTitle = secretType === 'message' ? 'Psssst' : ''
  const pageSubTitle = needsPassword
    ? 'Enter password to decrypt your secret:'
    : 'You received a secret:'
  return (
    <>
      <Page title={pageTitle} subtitle={pageSubTitle} noindex>
        {!needsPassword && localMessage && (
          <Box mb={3}>
            {secretType === 'neogram' ? (
              <SelfDestructionSequence />
            ) : (
              <>
                <Paper elevation={3} className={clsx(classes.break, classes.message)}>
                  <Box px={4} pt={4} pb={2}>
                    {localMessage}
                    <Box pt={2} display="flex" justifyContent="flex-end">
                      <Box mr={2}>
                        <BaseButton variant="text" color="primary" size="small" href="/">
                          Destroy secret
                        </BaseButton>
                      </Box>
                      <CopyToClipboard
                        text={localMessage}
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
              </>
            )}
          </Box>
        )}

        {isEncryptedWithUserPassword && !success && (
          <Formik<PasswordForm>
            initialValues={initialValues}
            validationSchema={passwordValidationSchema}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ isValid, isSubmitting }) => {
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
                      >
                        Decrypt Message
                      </BaseButton>
                    </Box>
                  </Form>
                </>
              )
            }}
          </Formik>
        )}

        {error && (
          <>
            <Alert severity="error">{error}</Alert>
            <Box mt={3}>
              <ReplyButton />
            </Box>
          </>
        )}
      </Page>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context
  const { alias } = query

  // Block crawlers
  const userAgent = req?.headers['user-agent']
  if (userAgent && crawlers.some(({ pattern }) => RegExp(pattern).test(userAgent))) {
    return { props: {} }
  }

  let error
  try {
    const response = await axios.get(
      `${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}/api?alias=${alias}`,
    )
    const { data } = response
    const { secretType, message, isEncryptedWithUserPassword, meta } = data

    // If URL is in plain text, redirect early
    if (!isEncryptedWithUserPassword && secretType === 'url') {
      return {
        redirect: {
          destination: sanitizeUrl(message),
          permanent: false,
        },
      }
    }

    return {
      props: {
        secretType,
        message: decodeURIComponent(message),
        isEncryptedWithUserPassword,
        meta,
      },
    }
  } catch (err) {
    const { response } = err
    if (response) {
      const { data } = response
      error = `${data.statusCode}: ${data.message}`
    } else {
      error =
        'Error occured. If you see 💥 in the address bar you have most likely tried to re-visit a burned link.'
    }
    return { props: { error } }
  }
}

export default AliasView
