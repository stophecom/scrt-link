import React, { useState } from 'react'
import { Box, Typography, FormLabel } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import NoSsr from '@material-ui/core/NoSsr'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'

import BaseRadioGroupField from '@/components/BaseRadioGroupField'
import BaseTextField, { BaseTextFieldProps } from '@/components/BaseTextField'
import BasePhoneField from '@/components/BasePhoneField'
import BaseSwitchField from '@/components/BaseSwitchField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Maybe } from '@/types'
import { CustomerFields } from '@/api/models/Customer'
import BaseButton from '@/components/BaseButton'
import UpgradeNotice from '@/components/UpgradeNotice'
import { getCustomerValidationSchema } from '@/utils/validationSchemas'
import { MenuItem } from '@/views/Account'
import {
  emailPlaceholder,
  neogramDestructionMessageDefault,
  neogramDestructionTimeoutDefault,
} from '@/constants'
import { ReadReceiptMethod } from '@/api/models/Customer'
import { useCustomer, api } from '@/utils/api'

export const DestructionMessage = () => {
  const { data: customer } = useCustomer()

  return (
    <BaseTextField
      name="neogramDestructionMessage"
      label="Destruction message"
      placeholder={neogramDestructionMessageDefault}
      {...(customer?.role !== 'premium'
        ? {
            disabled: true,
            helperText: <UpgradeNotice requiredRole="premium" />,
          }
        : {})}
    />
  )
}

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

export const readReceiptsOptions = [
  { value: 'none', label: 'None' },
  {
    value: 'email',
    label: 'Via Email',
  },
  {
    value: 'sms',
    label: 'Via SMS',
  },
]

const PrivacyNotice = () => (
  <>
    This information is <strong>private</strong> and will never be shown to anybody. We only use it
    to send you read receipts.
  </>
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      width: '100%',
    },
  }),
)

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

type CustomerProps = Partial<CustomerFields>
interface FormCustomerProps extends CustomerProps {
  onSuccess: () => void
  formFieldsSelection: MenuItem['key']
}
const FormCustomer = ({ onSuccess, formFieldsSelection, ...props }: FormCustomerProps) => {
  const { data: customer } = useCustomer()
  const classes = useStyles()
  const [state, setState] = useState<State>(initialState)
  const [readReceiptMethod, setReadReceiptMethod] = useState<ReadReceiptMethod>('none')

  const handleSubmit: OnSubmit<CustomerProps> = async (values, formikHelpers) => {
    try {
      const response = await api<ResponsePost>('/me', { method: 'POST' }, values)
      setState({ data: response })
      onSuccess()
    } catch (error) {
      setState({ error: error.message })
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

  const { data, error } = state

  return (
    <>
      <Formik<CustomerProps>
        initialValues={{
          readReceiptMethod: 'none',
          ...props,
          neogramDestructionMessage:
            props?.neogramDestructionMessage || neogramDestructionMessageDefault,
          neogramDestructionTimeout:
            props?.neogramDestructionTimeout || neogramDestructionTimeoutDefault,
        }}
        enableReinitialize={true}
        validationSchema={getCustomerValidationSchema(readReceiptMethod)}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting, values }) => {
          return (
            <>
              <Form noValidate>
                <Box mb={10}>
                  <Box mb={8}>
                    <Typography variant="h2">General settings</Typography>
                  </Box>
                  <Box mb={7}>
                    <BaseTextField
                      name="name"
                      label="Name"
                      placeholder="Jane Doe"
                      helperText={
                        <>
                          This information is <strong>private</strong> and will never be shown to
                          anybody. We only use it give you a personalized experience.
                        </>
                      }
                    />
                  </Box>
                  <BaseRadioGroupField
                    options={readReceiptsOptions}
                    name="readReceiptMethod"
                    label="Read receipts"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setReadReceiptMethod(e.target.value as ReadReceiptMethod)
                    }}
                  />
                  {values?.readReceiptMethod !== 'none' && (
                    <Box pt={2}>
                      {values?.readReceiptMethod === 'email' && (
                        <BaseTextField
                          name="receiptEmail"
                          label="Email"
                          required
                          placeholder={emailPlaceholder}
                          helperText={<PrivacyNotice />}
                        />
                      )}
                      {values?.readReceiptMethod === 'sms' && (
                        <>
                          <BasePhoneField
                            name="receiptPhoneNumber"
                            label="Phone"
                            required
                            disabled={customer?.role !== 'premium'}
                            helperText={
                              customer?.role !== 'premium' ? (
                                <UpgradeNotice requiredRole="premium" />
                              ) : (
                                <PrivacyNotice />
                              )
                            }
                          />
                        </>
                      )}
                    </Box>
                  )}
                </Box>

                <Box mb={10}>
                  <Box mb={2}>
                    <FormLabel component="legend">Emoji link 🤫</FormLabel>
                  </Box>
                  <Typography variant="body2">
                    Add some fun with a special emoji link. Example:{' '}
                    <Typography variant="body2" noWrap component="span">
                      <strong>https://🤫.st/nxKFy…</strong>{' '}
                    </Typography>
                    <br />
                    <strong>Be aware.</strong> Emoji links are supported in:{' '}
                    <em>Whatsapp, Telegram, Threema, Twitter, Matrix, Wire</em>. <br />
                    Currently not supported in: <em>Signal, Slack, Snapchat</em>.
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

                <Box pt={5}>
                  {(error || data?.message) && (
                    <NoSsr>
                      <Box mb={1}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {data?.message && <Alert severity="success">{data.message}</Alert>}
                      </Box>
                    </NoSsr>
                  )}
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

export default FormCustomer
