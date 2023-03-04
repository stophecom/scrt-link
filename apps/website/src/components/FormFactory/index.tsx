import React, { ReactNode, useState } from 'react'
import { InferType } from 'yup'

import { Box, NoSsr, Alert } from '@mui/material'
import { Formik, Form, FormikConfig, FormikProps } from 'formik'
import { useTranslation } from 'next-i18next'

import { Maybe } from '@/types'
import BaseButton from '@/components/BaseButton'

import { api } from '@/utils/api'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']
type ResponsePost = Maybe<{ message: string }>
type State = {
  data?: ResponsePost
  error?: string
}

const initialState: State = {
  data: undefined,
  error: undefined,
}

interface FormFactoryProps {
  name: string
  endpoint: string
  initialValues: Record<string, unknown>
  validationSchema: any
  children: ReactNode
  onSuccess?: () => void
}
const FormFactory = ({
  name,
  endpoint,
  onSuccess,
  validationSchema,
  initialValues,
  children,
}: FormFactoryProps) => {
  const { t } = useTranslation()

  type FormType = InferType<typeof validationSchema>

  const [state, setState] = useState<State>(initialState)

  const handleSubmit: OnSubmit<FormType> = async (values, formikHelpers) => {
    try {
      const response = await api<ResponsePost>(endpoint, { method: 'POST' }, values)
      setState({ data: response })
      onSuccess && onSuccess()
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : `Form ${name} submission failed!`,
      })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const { data, error } = state

  const FormFooter: React.FC<Partial<FormikProps<FormType>>> = ({
    isValid,
    isSubmitting,
    dirty,
  }) => (
    <Box pt={5}>
      {(error || data?.message) && !dirty && (
        <NoSsr>
          <Box mb={1}>
            {error && <Alert severity="error">{error}</Alert>}
            {data?.message && (
              <Alert severity="success">
                {t('common:components.FormCustomer.success', 'Your settings have been saved!')}
              </Alert>
            )}
          </Box>
        </NoSsr>
      )}
      <BaseButton
        fullWidth
        type="submit"
        color="primary"
        variant="contained"
        size="large"
        loading={isSubmitting}
        disabled={!(isValid && dirty)}
      >
        {t('common:button.save', 'Save')}
      </BaseButton>
    </Box>
  )

  return (
    <div>
      <Formik<FormType>
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {(formikStateAndHelpers) => {
          return (
            <Form id={name} noValidate>
              <Box p={3}>
                {typeof children === 'function' ? children(formikStateAndHelpers) : children}
                <FormFooter {...formikStateAndHelpers} />
              </Box>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default FormFactory
