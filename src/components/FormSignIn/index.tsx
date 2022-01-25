import React, { useState, ReactNode } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import { signIn } from 'next-auth/react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { Trans, useTranslation } from 'next-i18next'

import BaseCheckboxField from '@/components/BaseCheckboxField'
import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import { SignIn } from '@/types'

import BaseButton from '@/components/BaseButton'
import { Link, BaseButtonLink } from '@/components/Link'
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
  children?: ReactNode
}
const FormSignIn: React.FunctionComponent<FormSignInProps> = ({
  callbackUrl,
  showSignUp = false,
  children,
}) => {
  const classes = useStyles()
  const [state, setState] = useState(initialState)
  const [email, setEmail] = useState('')
  const { t } = useTranslation()

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
                  className={classes.submitButton}
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
