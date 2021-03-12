import React, { Fragment, useCallback, useReducer } from 'react'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { Box, InputAdornment, Typography } from '@material-ui/core'
import { Formik, Form, Field, FormikConfig } from 'formik'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { AES } from 'crypto-js'

import { ShortUrlData } from '@/api/models/ShortUrl'
import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { Maybe, FormInput, SecretType } from '@/types'

import TabsMenu from './components/TabsMenu'
import Result from './components/Result'
import Accordion from './components/Accordion'
import StrokeHighlight from './components/StrokeHighlight'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import LinkIcon from '@material-ui/icons/Link'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'
import { maxMessageLength } from '@/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type UrlFormValues = FormInput

const initialValues: UrlFormValues = {
  customAlias: '',
  message: '',
  type: 'message',
}

export interface State {
  data: Maybe<ShortUrlData>
  error: Maybe<string>
}

type Action =
  | { type: 'request' }
  | { type: 'success'; response: AxiosResponse }
  | { type: 'error'; error: AxiosError | Error }

const doRequest = (): Action => ({
  type: 'request',
})

const doSuccess = (response: AxiosResponse): Action => ({
  type: 'success',
  response,
})

const doError = (error: AxiosError | Error): Action => ({
  type: 'error',
  error,
})

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request':
      return { ...state, data: undefined, error: undefined }
    case 'success':
      return { ...state, data: action.response.data }
    case 'error':
      const { error } = action
      let errorMessage = error.message
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message ?? errorMessage
      }
      return {
        ...state,
        error: errorMessage,
      }
    default:
      throw new Error()
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: 0,
      width: '100%',
    },
    formFooter: {
      flexDirection: 'column',

      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    },
    submitButton: {
      width: '100%',
    },
    counter: {
      position: 'absolute',
      bottom: 5,
      right: 10,
    },
  }),
)

const initialState: State = {
  data: undefined,
  error: undefined,
}

const HomeView = () => {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [secretType, setSecretType] = React.useState<SecretType>('message')

  const handleSubmit = useCallback<OnSubmit<UrlFormValues>>(async (values, formikHelpers) => {
    dispatch(doRequest())

    const { message, password } = values

    const data = {
      ...omit(['password'], values),
      message: password && message ? AES.encrypt(message, password).toString() : message,
      isEncryptedWithUserPassword: !!values.password,
    }
    try {
      const response = await axios.post('/api/shorturl', data)
      dispatch(doSuccess(response))
      formikHelpers.resetForm()
    } catch (error) {
      dispatch(doError(error))
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }, [])

  const { data, error } = state

  const handleMenuChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: SecretType,
  ) => {
    setSecretType(newValue)
  }

  // Form options
  const [hasPassword, setHasPassword] = React.useState(false)
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasPassword(event.target.checked)
  }

  return (
    <Page
      title="Share a secret"
      subtitle={
        <>
          …with a link that only works <StrokeHighlight>one time</StrokeHighlight> and then{' '}
          <Box component="span" whiteSpace="nowrap">
            self-distructs.
          </Box>
        </>
      }
    >
      {data || error ? (
        <Result data={data} error={error} />
      ) : (
        <Fragment>
          <Box mb={3}>
            <TabsMenu handleChange={handleMenuChange} value={secretType} />
          </Box>
          <Formik<UrlFormValues>
            initialValues={initialValues}
            validationSchema={getValidationSchemaByType(secretType, hasPassword)}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ isValid, isSubmitting, setFieldValue, values }) => {
              return (
                <>
                  <Form noValidate>
                    <Field type="hidden" name="type" value={secretType} />

                    {secretType === 'url' && (
                      <>
                        <Box mb={2}>
                          <BaseTextField
                            name="message"
                            label="URL"
                            required
                            autoFocus
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box mb={2}>
                          <BaseTextField name="customAlias" label="Custom Alias (Optional)" />
                        </Box>
                      </>
                    )}
                    {secretType === 'message' && (
                      <>
                        <Box position="relative" mb={2}>
                          <BaseTextField
                            name="message"
                            multiline
                            required
                            rows={3}
                            rowsMax={7}
                            label="Message"
                            placeholder="Your secret message, password, private note…"
                          />
                          <small className={classes.counter}>
                            {maxMessageLength - values.message.length}
                          </small>
                        </Box>
                      </>
                    )}
                    {/* {secretType === 'password' && (
                        <BaseTextField name="message" label="Password" />
                      )} */}
                    <Collapse in={hasPassword}>
                      <Box mb={2}>
                        <BasePasswordField
                          required
                          className={clsx(classes.root)}
                          name="password"
                        />
                      </Box>
                    </Collapse>
                    <Box display="flex" className={classes.formFooter}>
                      <Box mb={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={hasPassword}
                              onChange={handleSwitchChange}
                              name="isEncryptedWithUserPassword"
                              color="primary"
                            />
                          }
                          label="Include password"
                        />
                      </Box>
                      <Box mb={1}>
                        <BaseButton
                          className={classes.submitButton}
                          onClick={() => {
                            setFieldValue('type', secretType)
                          }}
                          type="submit"
                          color="primary"
                          variant="contained"
                          size="large"
                          loading={isSubmitting}
                          disabled={!isValid}
                        >
                          Create secret link
                        </BaseButton>
                      </Box>
                    </Box>
                  </Form>
                </>
              )
            }}
          </Formik>

          <Box pt={15}>
            <Typography variant="h2">How it works</Typography>
            <Accordion />
          </Box>
        </Fragment>
      )}
    </Page>
  )
}

export default HomeView
