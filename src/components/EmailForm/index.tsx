import React, { useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import { Maybe } from '@/types'

import BaseButton from '@/components/BaseButton'
import { emailValidationSchema } from '@/utils/validationSchemas'
import { doRequest, doSuccess, doError, createReducer } from '@/utils/axios'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

export interface FormInput {
  email: string
}

const initialValues: FormInput = {
  email: '',
}

interface State {
  data: Maybe<{ message: string }>
  error: Maybe<string>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      width: '100%',
    },
  }),
)

const initialState: State = {
  data: undefined,
  error: undefined,
}

const reducer = createReducer<State>()

const EmailForm = () => {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleSubmit = useCallback<OnSubmit<FormInput>>(async (values, formikHelpers) => {
    dispatch(doRequest())

    try {
      const response = await axios.post('/api/beta-invite', values)
      dispatch(doSuccess(response))

      formikHelpers.resetForm()
    } catch (error) {
      dispatch(doError(error))
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }, [])

  const { data, error } = state

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (data) {
    return <Alert severity="success">{data.message}</Alert>
  }

  return (
    <Formik<FormInput>
      initialValues={initialValues}
      validationSchema={emailValidationSchema}
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

export default EmailForm
