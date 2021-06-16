import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import NoSsr from '@material-ui/core/NoSsr'
import { useSession, signOut } from 'next-auth/client'

import Alert from '@material-ui/lab/Alert'

import BaseSwitchField from '@/components/BaseSwitchField'
import { Maybe } from '@/types'
import BaseButton from '@/components/BaseButton'
import { deleteCustomerValidationSchema } from '@/utils/validationSchemas'
import { api } from '@/utils/api'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type ResponseDelete = Maybe<{ message: string }>

type State = {
  data?: ResponseDelete
  error?: string
}

type DeleteAccountProps = {
  isSure: boolean
}

const DeleteAccountForm = () => {
  const [session] = useSession()
  const [state, setState] = useState<State>({})

  const handleSubmit: OnSubmit<DeleteAccountProps> = async (_values, formikHelpers) => {
    try {
      const response = await api<ResponseDelete>('/me', { method: 'DELETE' })
      setState({ data: response })
    } catch (error) {
      setState({ error: error.message })
    } finally {
      formikHelpers.setSubmitting(false)
      signOut()
    }
  }

  const { data, error } = state

  if (!session) {
    return null
  }

  return (
    <>
      {(error || data?.message) && (
        <NoSsr>
          <Box mb={5}>
            {error && <Alert severity="error">{error}</Alert>}
            {data?.message && <Alert severity="success">{data.message}</Alert>}
          </Box>
        </NoSsr>
      )}

      <Formik<DeleteAccountProps>
        initialValues={{ isSure: false }}
        validationSchema={deleteCustomerValidationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => {
          return (
            <>
              <Form noValidate>
                <BaseSwitchField label="I want to delete my account." name="isSure" />

                <Box pt={5}>
                  <BaseButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    disabled={!isValid}
                  >
                    Delete Account
                  </BaseButton>
                </Box>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default DeleteAccountForm
