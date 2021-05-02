import React, { useState, useCallback, useReducer } from 'react'
import axios from 'axios'
import { Box, InputAdornment, Typography } from '@material-ui/core'
import { Formik, Form, Field, FormikConfig } from 'formik'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'
import Alert from '@material-ui/lab/Alert'

import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { Maybe } from '@/types'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'

import TabsMenu from './components/TabsMenu'
import Result from './components/Result'
import Accordion from './components/Accordion'
import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'
import { generateNanoId, encryptMessage } from '@/utils'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import LinkIcon from '@material-ui/icons/Link'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'
import { maxMessageLength, urlAliasLength, encryptionKeyLength } from '@/constants'
import { doReset, doRequest, doSuccess, doError, createReducer } from '@/utils/axios'
import { UIStore } from '@/store'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type SecretUrlFormValues = Pick<SecretUrlFields, 'secretType' | 'alias' | 'message'> & {
  password?: string
}

const initialValues: SecretUrlFormValues = {
  message: '',
  secretType: 'message',
  alias: '',
}

export interface State {
  data: Maybe<Pick<SecretUrlFields, 'alias'> & { message: string }>
  error: Maybe<string>
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

const reducer = createReducer<State>()

const HomeView = () => {
  const classes = useStyles()
  const plausible = usePlausible()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [secretType, setSecretType] = useState<SecretType>('message')
  const [encryptionKey, setEncryptionKey] = useState(generateNanoId(encryptionKeyLength))

  const handleSubmit = useCallback<OnSubmit<SecretUrlFormValues>>(async (values, formikHelpers) => {
    const { password, secretType, alias } = values
    let { message } = values

    // Default encryption
    message = encryptMessage(message, encryptionKey)

    dispatch(doRequest({ alias }))
    window.scrollTo(0, 0)

    if (password) {
      encryptMessage(message, password)
    }

    const data = {
      ...omit(['password'], values),
      alias,
      message,
      secretType,
      isEncryptedWithUserPassword: !!password,
    }
    try {
      const response = await axios.post('/api', data)
      dispatch(doSuccess(response))

      plausible('SecretCreation', {
        props: { secretType: secretType, messageLength: message.length, withPassword: !!password },
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
    _event: React.ChangeEvent<Record<string, unknown>>,
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
        <Box mb={2}>
          <Alert severity="error">
            <Box className={classes.wordBreak}>{error}</Box>
          </Alert>
        </Box>
        <BaseButton href="/" color="primary" variant="contained">
          Take me home
        </BaseButton>
      </Page>
    )
  }

  if (data) {
    return (
      <Page
        title="Success!"
        subtitle="Your secret link has been created - now share it with your confidant."
      >
        <Result
          data={data}
          encryptionKey={encryptionKey}
          onReset={() => {
            setEncryptionKey(generateNanoId(encryptionKeyLength))
            dispatch(doReset())
            setHasPassword(false)
          }}
        />
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
            self-destructs.
          </Box>
        </>
      }
      keywords="end-to-end encrypted, secret messages, one-time links, neogram, private note"
    >
      <Box mb={2}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={secretType}
          tabsMenu={Object.values(tabsMenu)}
        />
      </Box>
      <Formik<SecretUrlFormValues>
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
                <Field type="hidden" name="alias" />
                {secretType === 'url' && (
                  <>
                    <Box mb={2}>
                      <BaseTextField
                        name="message"
                        label="URL"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
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
                    <BasePasswordField
                      autoFocus={hasPassword}
                      required={hasPassword}
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
                        setFieldValue('secretType', secretType)
                        setFieldValue('alias', generateNanoId(urlAliasLength))

                        UIStore.update((s) => {
                          s.liveStatsEnabled = true
                        })
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

      <Box py={15}>
        <Typography variant="h2">How it works</Typography>
        <HowItWorks />
      </Box>

      <Box>
        <Typography variant="h2">FAQ</Typography>
        <Accordion />
      </Box>
    </Page>
  )
}

export default HomeView
