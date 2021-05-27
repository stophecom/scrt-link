import React, { useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import NoSsr from '@material-ui/core/NoSsr'
import { useSession, signOut } from 'next-auth/client'

import Alert from '@material-ui/lab/Alert'

import BaseSwitchField from '@/components/BaseSwitchField'
import { Maybe } from '@/types'
import BaseButton from '@/components/BaseButton'
import { deleteCustomerValidationSchema } from '@/utils/validationSchemas'
import { doRequest, doSuccess, doError, createReducer } from '@/utils/axios'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

interface State {
  data: Maybe<{ message: string }>
  error: Maybe<string>
}

const initialState: State = {
  data: undefined,
  error: undefined,
}

const reducer = createReducer<State>()

type DeleteAccountProps = {
  isSure: boolean
}

const DeleteAccountForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [session] = useSession()

  const handleSubmit = useCallback<OnSubmit<DeleteAccountProps>>(async (_values, formikHelpers) => {
    dispatch(doRequest({}))

    try {
      const response = await axios.delete('/api/me')
      dispatch(doSuccess(response))
    } catch (error) {
      dispatch(doError(error))
    } finally {
      signOut()
      formikHelpers.setSubmitting(false)
    }
  }, [])

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
