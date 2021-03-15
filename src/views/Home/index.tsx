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
import { usePlausible } from 'next-plausible'
import Alert from '@material-ui/lab/Alert'

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
  secretType: 'message',
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
    wordBreak: {
      wordBreak: 'break-word',
    },
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

type SecretTypeConfig = {
  label?: string
  tabLabel?: string
  placeholder?: string
}

type ObjKey = { [key: string]: SecretTypeConfig }

export const secretTypesMap = {
  message: {
    label: 'Secret Message',
    tabLabel: 'Message',
    placeholder: 'Your secret message, password, private key, etc.',
  },
  url: {
    label: 'URL',
    tabLabel: 'Redirect URL',
    placeholder: 'e.g. https://www.example.com',
  },
  neogram: {
    label: 'Neogram',
    tabLabel: 'Neogram™',
    placeholder: 'Wake up Neo…',
  },
} as ObjKey

const tabsMenu = Object.keys(secretTypesMap).map((item) => {
  const secretTypeItem = secretTypesMap[item]

  return {
    label: secretTypeItem.tabLabel as string,
    key: item,
  }
})

const HomeView = () => {
  const classes = useStyles()
  const plausible = usePlausible()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [secretType, setSecretType] = React.useState<SecretType>('message')

  const handleSubmit = useCallback<OnSubmit<UrlFormValues>>(async (values, formikHelpers) => {
    dispatch(doRequest())

    const { message, password } = values

    const data = {
      ...omit(['password'], values),
      message: password && message ? AES.encrypt(message, password).toString() : message,
      isEncryptedWithUserPassword: !!password,
    }
    try {
      const response = await axios.post('/api/shorturl', data)
      dispatch(doSuccess(response))

      plausible('SecretCreation', {
        props: { secretType, messageLength: message.length, withPassword: !!password },
      })
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

  const getFormFieldConfigBySecretType = (secretType: SecretType) => {
    return secretTypesMap[secretType]
  }

  if (error) {
    return (
      <Page title="An error occured!">
        <Box mb={3}>
          <Alert severity="error">
            <Box className={classes.wordBreak}>{error}</Box>
          </Alert>
        </Box>
      </Page>
    )
  }

  if (data) {
    return (
      <Page title="Secret link created!" subtitle="Now share the link with your confidant.">
        <Result data={data} />
      </Page>
    )
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
      <Box mb={2}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={secretType}
          tabsMenu={Object.values(tabsMenu)}
        />
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
                <Field type="hidden" name="secretType" value={secretType} />

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
                {['message', 'neogram'].includes(secretType) && (
                  <>
                    <Box position="relative" mb={2}>
                      <BaseTextField
                        name="message"
                        multiline
                        required
                        rows={3}
                        rowsMax={7}
                        label={getFormFieldConfigBySecretType(secretType).label}
                        placeholder={getFormFieldConfigBySecretType(secretType).placeholder}
                      />
                      <small className={classes.counter}>
                        {maxMessageLength - values.message.length}
                      </small>
                    </Box>
                  </>
                )}

                <Collapse in={hasPassword}>
                  <Box mb={2}>
                    <BasePasswordField required className={clsx(classes.root)} name="password" />
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
                      label="Include Password"
                    />
                  </Box>
                  <Box mb={1}>
                    <BaseButton
                      className={classes.submitButton}
                      onClick={() => {
                        setFieldValue('secretType', secretType)
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
    </Page>
  )
}

export default HomeView
