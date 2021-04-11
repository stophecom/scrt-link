import React, { useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box, Typography } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import { Maybe, UserSettings } from '@/types'

import BaseButton from '@/components/BaseButton'
import { userSettingsValidationSchema } from '@/utils/validationSchemas'
import { doRequest, doSuccess, doError, createReducer } from '@/utils/axios'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

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

interface UserSettingsFormProps extends UserSettings {
  onSuccess: () => void
}
const UserSettingsForm = ({
  name,
  neogramDestructionMessage,
  onSuccess,
}: UserSettingsFormProps) => {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)

  const initialValues: UserSettings = {
    name: name || '',
    neogramDestructionMessage: neogramDestructionMessage || '',
  }

  const handleSubmit = useCallback<OnSubmit<UserSettings>>(async (values, formikHelpers) => {
    dispatch(doRequest())

    try {
      const response = await axios.post('/api/me', values)
      dispatch(doSuccess(response))
      formikHelpers.resetForm()
      onSuccess()
    } catch (error) {
      dispatch(doError(error))
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }, [])

  const { data, error } = state

  return (
    <>
      {error ||
        (data && (
          <Box mb={5}>
            {error && <Alert severity="error">{error}</Alert>}
            {data && <Alert severity="success">{data.message}</Alert>}
          </Box>
        ))}

      <Formik<UserSettings>
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={userSettingsValidationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => {
          return (
            <>
              <Form noValidate>
                <Box mb={5}>
                  <BaseTextField name="name" label="Name" />
                </Box>
                <Box mb={5}>
                  <Typography variant="h3">Neogram™</Typography>
                  <BaseTextField
                    name="neogramDestructionMessage"
                    label="Destruction message"
                    placeholder="This message will self-destruct in five seconds!"
                  />
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
    </>
  )
}

export default UserSettingsForm
