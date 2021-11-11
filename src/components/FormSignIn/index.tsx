import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import { signIn } from 'next-auth/client'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { useRouter } from 'next/router'

import BaseCheckboxField from '@/components/BaseCheckboxField'
import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import { SignIn } from '@/types'

import BaseButton from '@/components/BaseButton'
import ExternalLink from '@/components/ExternalLink'
import { getSignInValidationSchema } from '@/utils/validationSchemas'
import { emailPlaceholder } from '@/constants'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

const initialValues: SignIn = {
  email: '',
}

// See @types/next-auth/client.d.ts
interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

type State = Partial<SignInResponse>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      width: '100%',
    },
  }),
)

const initialState: State = {
  ok: false,
  error: undefined,
}

type FormSignInProps = {
  callbackUrl?: string
  showSignUp?: boolean
}
const FormSignIn: React.FunctionComponent<FormSignInProps> = ({
  callbackUrl,
  showSignUp = false,
}) => {
  const classes = useStyles()
  const [state, setState] = useState(initialState)
  const [email, setEmail] = useState('')
  const [isSignUp, setIsSignUp] = useState(showSignUp)
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.signup) {
      setIsSignUp(true)
    }
  }, [router])

  const handleSubmit: OnSubmit<SignIn> = async (values, formikHelpers) => {
    try {
      const response = await signIn('email', { ...values, callbackUrl, redirect: false })
      if (response) {
        setState(response)
      }
      setEmail(values.email)
      formikHelpers.resetForm()
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const { ok, error } = state

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (ok) {
    return (
      <Alert severity="success">
        Check your email! A sign in link has been sent to <em>{email}</em>.
      </Alert>
    )
  }

  return (
    <Formik<SignIn>
      initialValues={initialValues}
      validationSchema={getSignInValidationSchema(isSignUp)}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => {
        return (
          <>
            <Form noValidate>
              <Box py={1}>
                <BaseTextField name="email" label="Email" placeholder={emailPlaceholder} required />
              </Box>
              {isSignUp && (
                <Box py={1}>
                  <BaseCheckboxField
                    label={
                      <>
                        I agree to the{' '}
                        <ExternalLink href="/terms-of-service">Terms Of Service</ExternalLink> and
                        the associated policies.
                      </>
                    }
                    name="isConsentToTermsGiven"
                  />
                </Box>
              )}

              <Box py={1}>
                <BaseButton
                  className={classes.submitButton}
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  disabled={!isValid}
                  startIcon={<VpnKeyIcon />}
                >
                  {isSignUp ? 'Sign up' : 'Sign in'}
                </BaseButton>
              </Box>
            </Form>
            {isSignUp ? 'Already got an account?' : 'No Account yet?'}{' '}
            <BaseButton
              variant="text"
              size="small"
              color="primary"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </BaseButton>
          </>
        )
      }}
    </Formik>
  )
}

export default FormSignIn
