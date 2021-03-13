import React, { useCallback, useState } from 'react'
import { NextPage } from 'next'
import axios from 'axios'
import { Box, CircularProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Formik, Form, FormikConfig } from 'formik'
import { AES, enc } from 'crypto-js'
import { parse } from 'uri-js'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { passwordValidationSchema } from '@/utils/validationSchemas'
import { SecretType } from '@/types'
import { isServer } from '@/utils'
import BasePasswordField from '@/components/BasePasswordField'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

// https://stackoverflow.com/a/19709846
const isAbsoluteUrl = (url: string) => {
  if (url.startsWith('//')) {
    return true
  }

  const uri = parse(url)
  return !!uri.scheme
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

interface AliasViewProps {
  error?: string
  message?: string
  isEncryptedWithUserPassword?: boolean
  type?: SecretType
}
interface PasswordForm {
  password: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      wordBreak: 'break-word',
    },
  }),
)

const AliasView: NextPage<AliasViewProps> = ({
  error,
  message = '',
  isEncryptedWithUserPassword = false,
  type,
}) => {
  const classes = useStyles()

  const [localMessage, setLocalMessage] = useState(message)
  const [success, setSuccess] = useState(false)

  const initialValues: PasswordForm = {
    password: '',
  }

  const pageRedirect = (url: string) => {
    if (!isServer()) {
      if (!isAbsoluteUrl(url)) {
        url = `http://${url}`
      }

      window.location.replace(url)
    }
  }

  // If URL is in plain text, redirect early
  if (!isEncryptedWithUserPassword && type === 'url') {
    pageRedirect(message)
  }

  const handleSubmit = useCallback<OnSubmit<PasswordForm>>(async (values, formikHelpers) => {
    try {
      const bytes = AES.decrypt(message, values.password)

      const result = bytes.toString(enc.Utf8)
      if (!result) {
        throw new Error('Wrong Password')
      } else {
        setSuccess(true)
        setLocalMessage(result)

        if (type === 'url') {
          pageRedirect(result)
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

  return (
    <>
      <Page title={`Your secret ${type}`} noindex>
        <meta name="robots" content="noindex,nofollow" />
        <Box mb={3}>
          {localMessage && (
            <Alert className={classes.alert} severity={success ? 'success' : 'info'}>
              {localMessage}
            </Alert>
          )}
        </Box>

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

        {error && <Alert severity="error">{error}</Alert>}
      </Page>
    </>
  )
}

// Tried this with "getServerSideProps" too.
// When the user directly opens this page, there are no problems.
// But when user redirects to this page from another page in the app,
// some CORS error is happening while redirecting the request.
// "getServerSideProps" runs twice and in the end we increase "clicks"
// twice. So, we are using "getInitialProps" for a while.
AliasView.getInitialProps = async ({ res, query }) => {
  const { alias } = query

  let error
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/shorturl?alias=${alias}`,
    )
    const { data } = response
    const { type, message, isEncryptedWithUserPassword } = data

    return { type, message: decodeURIComponent(message), isEncryptedWithUserPassword }
  } catch (err) {
    const { response } = err
    if (response) {
      const { data } = response
      error = `${data.statusCode}: ${data.message}`
    } else {
      error = 'An unknown error occured'
    }
    return { error }
  }
  return {}
}

export default AliasView
