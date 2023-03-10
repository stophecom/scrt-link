import React, { useState, ReactNode } from 'react'
import { Formik, Form, FormikConfig } from 'formik'
import { signIn } from 'next-auth/react'

import { Trans, useTranslation } from 'next-i18next'
import { Box, Alert } from '@mui/material'
import { VpnKey as VpnKeyIcon } from '@mui/icons-material'

import BaseCheckboxField from '@/components/BaseCheckboxField'
import BaseTextField from '@/components/BaseTextField'
import { SignIn } from '@/types'

import BaseButton from '@/components/BaseButton'
import { Link } from '@/components/Link'
import { getSignInValidationSchema } from '@/utils/validationSchemas'
import { emailPlaceholder } from '@/constants'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

const initialValues: SignIn = {
  email: '',
}

// See @types/next-auth/react.d.ts
interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

type State = Partial<SignInResponse>

const initialState: State = {
  ok: false,
  error: undefined,
}

type FormSignInProps = {
  callbackUrl?: string
  showSignUp?: boolean
  children?: ReactNode
}
const FormSignIn: React.FunctionComponent<FormSignInProps> = ({
  callbackUrl,
  showSignUp = false,
  children,
}) => {
  const [state, setState] = useState(initialState)
  const [email, setEmail] = useState('')
  const { t } = useTranslation()

  const handleSubmit: OnSubmit<SignIn> = async (values, formikHelpers) => {
    try {
      const response = await signIn(
        'email',
        { ...values, callbackUrl, redirect: false },
        {
          signUpOrSignIn: showSignUp ? 'signUp' : 'signIn',
          ...(values?.name ? { name: values.name } : {}),
        },
      )
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
    return (
      <Box>
        <Alert severity="error" sx={{ marginBottom: '.5em' }}>
          {error === 'EmailSignin'
            ? showSignUp
              ? t(
                  'common:error.signUp.emailAlreadyExists',
                  'A user with this email already exists - you may sign in instead.',
                )
              : t(
                  'common:error.signIn.emailUnknown',
                  'Unknown email address. Check your email or try to sign up instead.',
                )
            : error}
        </Alert>
        <BaseButton onClick={() => setState(initialState)} color="primary" variant="contained">
          {t('common:button.tryAgain', 'Try again')}
        </BaseButton>
      </Box>
    )
  }

  if (ok) {
    return (
      <Alert severity="success">
        <Trans i18nKey="common:components.FormSignIn.success">
          Check your email! A sign in link has been sent to <em>{{ email }}</em>.
        </Trans>
      </Alert>
    )
  }

  return (
    <Formik<SignIn>
      initialValues={initialValues}
      validationSchema={getSignInValidationSchema(t, showSignUp)}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => {
        return (
          <>
            <Form noValidate>
              {showSignUp && (
                <Box pb={3}>
                  <BaseTextField name="name" label="Name" placeholder="Jane Doe" />
                </Box>
              )}
              <Box py={1}>
                <BaseTextField
                  name="email"
                  label={t('common:email', 'Email')}
                  placeholder={emailPlaceholder}
                  required
                />
              </Box>
              {showSignUp && (
                <Box py={1}>
                  <BaseCheckboxField
                    label={
                      <Trans i18nKey="common:components.FormSignIn.agreement">
                        I agree to the{' '}
                        <Link target="_blank" href="/terms-of-service">
                          Terms Of Service
                        </Link>{' '}
                        and the associated policies.
                      </Trans>
                    }
                    name="isConsentToTermsGiven"
                  />
                </Box>
              )}

              <Box py={1}>
                <BaseButton
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  disabled={!isValid}
                  startIcon={<VpnKeyIcon />}
                >
                  {showSignUp
                    ? t('common:button.signUp', 'Sign up')
                    : t('common:button.signIn', 'Sign in')}
                </BaseButton>
              </Box>
            </Form>
            {children}
          </>
        )
      }}
    </Formik>
  )
}

export default FormSignIn
