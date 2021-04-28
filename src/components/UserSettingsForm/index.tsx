import React, { useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box, Typography } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import BasePhoneField from '@/components/BasePhoneField'
import BaseSwitch from '@/components/BaseSwitch'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Maybe } from '@/types'
import { UserSettingsFields } from '@/api/models/UserSettings'
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

type UserSettings = Partial<UserSettingsFields>
interface UserSettingsFormProps extends UserSettings {
  onSuccess: () => void
}
const UserSettingsForm = ({
  name,
  neogramDestructionMessage,
  neogramDestructionTimeout,
  receiptEmail,
  receiptPhoneNumber,
  isReadReceiptsViaEmailEnabled,
  isReadReceiptsViaPhoneEnabled,
  onSuccess,
}: UserSettingsFormProps) => {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)

  const initialValues: UserSettings = {
    name: name || '',
    neogramDestructionMessage: neogramDestructionMessage || '',
    neogramDestructionTimeout: neogramDestructionTimeout || 5,
    receiptEmail,
    receiptPhoneNumber,
    isReadReceiptsViaEmailEnabled,
    isReadReceiptsViaPhoneEnabled,
  }

  const handleSubmit = useCallback<OnSubmit<UserSettings>>(async (values, formikHelpers) => {
    dispatch(doRequest({}))

    try {
      const response = await axios.post('/api/me', values)
      dispatch(doSuccess(response))
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
        (data?.message && (
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
                <Box mb={10}>
                  <Box mb={4}>
                    <Typography variant="h3">General</Typography>
                    <Typography variant="body1">
                      The following information is private and will never be shown to anybody.
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <BaseTextField name="name" label="Name" />
                  </Box>
                </Box>

                <Box mb={10}>
                  <Box mb={4}>
                    <Typography variant="h3">Read receipts</Typography>
                    <Typography variant="body1">
                      The following information is private and will never be shown to anybody.
                    </Typography>
                  </Box>

                  <Box mb={3}>
                    <BaseTextField name="receiptEmail" label="Email" value={receiptEmail} />
                    <BaseSwitch
                      label="Get notified via email"
                      name="isReadReceiptsViaEmailEnabled"
                    />
                  </Box>
                  <Box>
                    <BasePhoneField
                      name="receiptPhoneNumber"
                      label="Phone"
                      value={receiptPhoneNumber}
                    />
                    <BaseSwitch label="Get notified via SMS" name="isReadReceiptsViaPhoneEnabled" />
                  </Box>
                </Box>

                <Box mb={10}>
                  <Typography variant="h3">Neogram™</Typography>
                  <Box mb={3}>
                    <BaseTextField
                      name="neogramDestructionMessage"
                      label="Destruction message"
                      placeholder="This message will self-destruct in five seconds!"
                    />
                  </Box>
                  <Box mb={1} width="60%" minWidth={280}>
                    <BaseTextField
                      name="neogramDestructionTimeout"
                      label="Destruction timeout"
                      type="number"
                      helperText="Countdown time before message gets destroyed. Defaults to 5s."
                      InputProps={{
                        endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                      }}
                    />
                  </Box>
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
                    Save
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
