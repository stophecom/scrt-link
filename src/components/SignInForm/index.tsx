import React, { useCallback, useState } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import { signIn } from 'next-auth/client'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import { SignIn } from '@/types'

import BaseButton from '@/components/BaseButton'
import { signInValidationSchema } from '@/utils/validationSchemas'

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

const SignInForm = () => {
  const classes = useStyles()
  const [state, setState] = useState(initialState)

  const handleSubmit = useCallback<OnSubmit<SignIn>>(async (values, formikHelpers) => {
    try {
      const response = await signIn('email', { ...values, redirect: false })
      setState(response)
      formikHelpers.resetForm()
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }, [])

  const { ok, error } = state

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (ok) {
    return (
      <Alert severity="success">
        Check your email! A sign in link has been sent to your email address.
      </Alert>
    )
  }

  return (
    <Formik<SignIn>
      initialValues={initialValues}
      validationSchema={signInValidationSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => {
        return (
          <>
            <Form noValidate>
              <Box mb={2}>
                <BaseTextField name="email" label="Email" required />
              </Box>
              <Box mb={1}>
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
                  Sign In
                </BaseButton>
              </Box>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default SignInForm
