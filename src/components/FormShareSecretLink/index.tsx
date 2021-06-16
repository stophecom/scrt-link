import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'

import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'

import BaseButton from '@/components/BaseButton'
import { shareSecretViaEmailSchema } from '@/utils/validationSchemas'
import { emailPlaceholder } from '@/constants'
import { api } from '@/utils/api'

// @todo move this to types
export type Response = {
  message: string
}

export interface FormShareSecretLinkProps {
  recipientEmail: string
  secretUrl: string
  recipientName?: string
  message?: string
}
type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

interface State {
  error?: string
  message?: string
}

const initialState: State = {
  message: '',
  error: undefined,
}

const FormShareSecretLink = ({ secretUrl }: Pick<FormShareSecretLinkProps, 'secretUrl'>) => {
  const [state, setState] = useState(initialState)

  const handleSubmit: OnSubmit<FormShareSecretLinkProps> = async (values, formikHelpers) => {
    try {
      const response = await api<Response>(`/sendmail`, { method: 'POST' }, { ...values })
      setState(response)
      formikHelpers.resetForm()
    } catch (err) {
      setState({ error: err.message })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const { message, error } = state

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (message) {
    return <Alert severity="success">{message}</Alert>
  }

  return (
    <Formik<FormShareSecretLinkProps>
      initialValues={{
        recipientEmail: '',
        secretUrl,
        recipientName: '',
        message: '',
      }}
      validationSchema={shareSecretViaEmailSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => {
        return (
          <>
            <Form noValidate>
              <Box py={1}>
                <BaseTextField
                  name="recipientEmail"
                  label="Email"
                  placeholder={emailPlaceholder}
                  required
                />
              </Box>
              <Box py={1}>
                <BaseTextField name="recipientName" label="Recipient name" placeholder="Jane Doe" />
              </Box>
              <Box py={1}>
                <BaseTextField
                  name="message"
                  multiline
                  rows={3}
                  rowsMax={7}
                  label="Message"
                  placeholder="Message to be included in the email…"
                  helperText="We recommend to add a hint about who you are. Otherwise the recipient might mistake the email for spam."
                />
              </Box>

              <Box py={1}>
                <BaseButton
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  Send
                </BaseButton>
              </Box>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

export default FormShareSecretLink
