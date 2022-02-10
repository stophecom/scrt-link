import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Formik, Form, FormikConfig } from 'formik'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation()

  const handleSubmit: OnSubmit<FormShareSecretLinkProps> = async (values, formikHelpers) => {
    try {
      const response = await api<Response>(`/sendmail`, { method: 'POST' }, { ...values })
      if (response) {
        setState(response)
      }
      formikHelpers.resetForm()
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : 'FormShareSecretLink submit failed.',
      })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const { message, error } = state

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (message) {
    return (
      <Alert severity="success">
        {t('common:components.FormShareSecretLink.success', 'Email successfully sent!')}
      </Alert>
    )
  }

  return (
    <Formik<FormShareSecretLinkProps>
      initialValues={{
        recipientEmail: '',
        secretUrl,
        recipientName: '',
        message: '',
      }}
      validationSchema={shareSecretViaEmailSchema(t)}
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
                  label={t('common:email', 'Email')}
                  placeholder={emailPlaceholder}
                  required
                />
              </Box>
              <Box py={1}>
                <BaseTextField
                  name="recipientName"
                  label={t(
                    'common:components.FormShareSecretLink.recipientName.label',
                    'Recipient name',
                  )}
                  placeholder={t(
                    'common:components.FormShareSecretLink.recipientName.placeholder',
                    'Jane Doe',
                  )}
                />
              </Box>
              <Box py={1}>
                <BaseTextField
                  name="message"
                  multiline
                  minRows={3}
                  maxRows={7}
                  label={t('common:components.FormShareSecretLink.message.label', 'Message')}
                  placeholder={t(
                    'common:components.FormShareSecretLink.message.placeholder',
                    'Message to be included in the email…',
                  )}
                  helperText={t(
                    'common:components.FormShareSecretLink.message.helperText',
                    'We recommend to add a hint about who you are. Otherwise the recipient might mistake the email for spam.',
                  )}
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
                  {t('common:button.send', 'Send')}
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
