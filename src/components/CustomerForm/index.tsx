import React, { useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box, Typography, FormLabel } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import NoSsr from '@material-ui/core/NoSsr'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'

import BaseRadiosField from '@/components/BaseRadiosField'
import BaseTextField, { BaseTextFieldProps } from '@/components/BaseTextField'
import BasePhoneField from '@/components/BasePhoneField'
import BaseSwitchField from '@/components/BaseSwitchField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Maybe } from '@/types'
import { CustomerFields } from '@/api/models/Customer'
import BaseButton from '@/components/BaseButton'
import { customerValidationSchema } from '@/utils/validationSchemas'
import { doRequest, doSuccess, doError, createReducer } from '@/utils/axios'
import { MenuItem } from '@/views/Account'

export const DestructionMessage: React.FunctionComponent<
  Pick<BaseTextFieldProps, 'disabled' | 'helperText'>
> = ({ ...props }) => (
  <BaseTextField
    name="neogramDestructionMessage"
    label="Destruction message"
    placeholder="This message will self-destruct in five seconds!"
    {...props}
  />
)

export const DestructionTimeout: React.FunctionComponent<
  Pick<BaseTextFieldProps, 'disabled' | 'helperText'>
> = ({ ...props }) => (
  <Box width="60%" minWidth={280}>
    <BaseTextField
      name="neogramDestructionTimeout"
      label="Destruction countdown"
      type="number"
      InputProps={{
        endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
      }}
      {...props}
    />
  </Box>
)

type ReadReceiptsOptionsProps = {
  isSMSDisabled: boolean
  isEmailDisabled: boolean
}

export const ReadReceiptsOptions: React.FunctionComponent<ReadReceiptsOptionsProps> = ({
  isEmailDisabled,
  isSMSDisabled,
}) => {
  const readReceiptsOptions = [
    { value: 'none', label: 'None' },
    {
      value: 'sms',
      label: 'Via SMS',
      disabled: isSMSDisabled,
    },
    {
      value: 'email',
      label: 'Via email',
      disabled: isEmailDisabled,
    },
  ]
  return (
    <BaseRadiosField
      options={readReceiptsOptions}
      name="readReceipts"
      label="Read receipts"
      helperText={
        !isSMSDisabled || !isEmailDisabled
          ? `To enable, you need to add corresponding contact options first.`
          : ''
      }
    />
  )
}

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

type Customer = Partial<CustomerFields>
interface CustomerFormProps extends Customer {
  onSuccess: () => void
  formFieldsSelection: MenuItem['key']
}
const CustomerForm = ({ onSuccess, formFieldsSelection, ...props }: CustomerFormProps) => {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleSubmit = useCallback<OnSubmit<Customer>>(async (values, formikHelpers) => {
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
      <Formik<Customer>
        initialValues={props}
        enableReinitialize={true}
        validationSchema={customerValidationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting, values, errors }) => {
          return (
            <>
              <Form noValidate>
                {formFieldsSelection === 'contact' && (
                  <>
                    <Box mb={5}>
                      <Typography variant="h3">Contact information</Typography>
                    </Box>
                    <Box mb={3}>
                      <BaseTextField name="name" label="Name" placeholder="John Doe" />
                    </Box>

                    <Box mb={3}>
                      <BaseTextField
                        name="receiptEmail"
                        label="Email"
                        placeholder="example@gmail.com"
                      />
                    </Box>

                    <Box mb={3}>
                      <BasePhoneField name="receiptPhoneNumber" label="Phone" />
                    </Box>
                  </>
                )}

                {formFieldsSelection === 'secrets' && (
                  <>
                    <Box mb={10}>
                      <Box mb={5}>
                        <Typography variant="h3">General settings</Typography>
                      </Box>
                      <ReadReceiptsOptions
                        isSMSDisabled={!values.receiptPhoneNumber || !!errors.receiptPhoneNumber}
                        isEmailDisabled={!values.receiptEmail || !!errors.receiptEmail}
                      />
                    </Box>

                    <Box mb={10}>
                      <Box mb={2}>
                        <FormLabel component="legend">Emoji link 🤫</FormLabel>
                      </Box>
                      <Typography variant="body2">
                        You can enable emoji links to share your secrets. Example:{' '}
                        <Typography variant="body2" noWrap component="span">
                          <strong>https://🤫.st/nxKFy…</strong>{' '}
                        </Typography>
                        (Note that not all chat applications support emoji links: Whatsapp,
                        Telegram, Threema, Twitter, Matrix, Wire, do work. Signal, Slack, Snapchat
                        do not.)
                      </Typography>
                      <BaseSwitchField label="Use emoji link" name="isEmojiShortLinkEnabled" />
                    </Box>

                    <Box>
                      <Typography variant="h3">Neogram™</Typography>
                      <Box mb={3}>
                        <DestructionMessage />
                      </Box>
                      <Box mb={1}>
                        <DestructionTimeout />
                      </Box>
                    </Box>
                  </>
                )}

                <Box pt={5}>
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
                  {(error || data?.message) && (
                    <NoSsr>
                      <Box mt={1}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {data?.message && <Alert severity="success">{data.message}</Alert>}
                      </Box>
                    </NoSsr>
                  )}
                </Box>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default CustomerForm
