import React, { useState, useCallback, useReducer } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Box, InputAdornment, Typography, Link } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'
import Alert from '@material-ui/lab/Alert'
import { GetServerSideProps } from 'next'
import { useSession, getSession } from 'next-auth/client'
import NextLink from 'next/link'
import { ArrowForward } from '@material-ui/icons'

import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { Maybe } from '@/types'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import { UserSettingsFields } from '@/api/models/UserSettings'
import { DestructionMessage, DestructionTimeout } from '@/components/UserSettingsForm'
import { baseUrl } from '@/constants'
import TabsMenu from './components/TabsMenu'

import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'
import { generateNanoId, encryptMessage } from '@/utils'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import LinkIcon from '@material-ui/icons/Link'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'
import { getMaxMessageLength, urlAliasLength, encryptionKeyLength } from '@/constants'
import { doReset, doRequest, doSuccess, doError, createReducer } from '@/utils/axios'
import { UIStore } from '@/store'
import { demoMessage } from '@/data/faq'

const Accordion = dynamic(() => import('./components/Accordion'))
const Result = dynamic(() => import('./components/Result'))

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type SecretUrlFormValues = Omit<SecretUrlFields, 'userId' | 'isEncryptedWithUserPassword'> & {
  password?: string
  encryptionKey: string
}

export interface State {
  data: Maybe<Pick<SecretUrlFields, 'alias'> & { message: string; encryptionKey: string }>
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
      bottom: 12,
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

type HomeViewProps = {
  userSettings: Partial<UserSettingsFields>
}
const HomeView: React.FunctionComponent<HomeViewProps> = ({ userSettings }) => {
  const [session] = useSession()
  const classes = useStyles()
  const plausible = usePlausible()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [secretType, setSecretType] = useState<SecretType>('message')

  const {
    isEmojiShortLinkEnabled = false,
    neogramDestructionMessage,
    neogramDestructionTimeout,
  } = userSettings

  const initialValues: SecretUrlFormValues = {
    message: '',
    secretType: 'message',
    alias: '',
    encryptionKey: '',
    neogramDestructionMessage: neogramDestructionMessage || 'This message will self-destruct in…',
    neogramDestructionTimeout: neogramDestructionTimeout || 5,
  }

  const handleSubmit = useCallback<OnSubmit<SecretUrlFormValues>>(async (values, formikHelpers) => {
    const { password, secretType, alias, encryptionKey } = values
    let { message } = values

    if (password) {
      message = encryptMessage(message, password)
    }

    // Default encryption
    message = encryptMessage(message, encryptionKey)

    dispatch(doRequest({ alias, encryptionKey }))
    window.scrollTo(0, 0)

    const data = {
      ...omit(['password', 'encryptionKey'], values),
      alias,
      message,
      secretType,
      isEncryptedWithUserPassword: !!password,
    }
    try {
      const response = await axios.post('/api', data)
      response.data['encryptionKey'] = encryptionKey
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
  const [hasFormOptions, setHasFormOptions] = React.useState(false)
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasFormOptions(event.target.checked)
  }

  const getFormFieldConfigBySecretType = (secretType: SecretType) => {
    return secretTypesMap[secretType]
  }

  type CounterProps = {
    messageLength: number
  }
  const Counter: React.FunctionComponent<CounterProps> = ({ messageLength }) => {
    const charactersLeft = getMaxMessageLength(!!session) - messageLength
    return (
      <small className={classes.counter}>
        {charactersLeft}
        {charactersLeft < 0 && (
          <>
            &nbsp;|&nbsp; Need more?&nbsp;
            <NextLink href="/account" passHref>
              <Link>Get free account</Link>
            </NextLink>
          </>
        )}
      </small>
    )
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
          isEmojiShortLinkEnabled={isEmojiShortLinkEnabled}
          onReset={() => {
            dispatch(doReset())
            setHasFormOptions(false)
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
        validationSchema={getValidationSchemaByType(
          secretType,
          hasFormOptions,
          getMaxMessageLength(!!session),
        )}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting, setFieldValue, values }) => {
          return (
            <>
              <Form noValidate>
                <Box position="relative" py={1}>
                  {secretType === 'url' && (
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
                  )}
                  {['message', 'neogram'].includes(secretType) && (
                    <>
                      <BaseTextField
                        name="message"
                        multiline
                        required
                        rows={3}
                        rowsMax={7}
                        label={getFormFieldConfigBySecretType(secretType).label}
                        placeholder={getFormFieldConfigBySecretType(secretType).placeholder}
                      />
                      <Counter messageLength={values.message.length} />
                    </>
                  )}
                </Box>

                <Collapse in={hasFormOptions}>
                  <Box py={1}>
                    <BasePasswordField className={clsx(classes.root)} name="password" />
                  </Box>
                  {secretType === 'neogram' && (
                    <>
                      <Box py={1}>
                        <DestructionMessage />
                      </Box>
                      <Box py={1}>
                        <DestructionTimeout />
                      </Box>
                    </>
                  )}
                </Collapse>
                <Box display="flex" className={classes.formFooter}>
                  <Box
                    key="formControls"
                    display="flex"
                    alignItems="center"
                    flexGrow={1}
                    py={{ xs: 1, sm: 0 }}
                    mb={{ xs: 1, sm: 0 }}
                    pl={1}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={hasFormOptions}
                          onChange={handleSwitchChange}
                          name="formOptions"
                          color="primary"
                          size="small"
                        />
                      }
                      label="With options"
                    />
                    {secretType === 'neogram' && (
                      <Box ml="auto">
                        <BaseButton
                          href={`/l/preview?preview=${encodeURIComponent(
                            JSON.stringify({
                              ...omit(['password', 'encryptionKey'], values),
                              message: values.message || demoMessage,
                              secretType,
                            }),
                          )}`}
                          variant="text"
                          target="_blank"
                        >
                          {values?.message ? 'Preview' : 'Demo'}
                        </BaseButton>
                      </Box>
                    )}
                  </Box>
                  <Box key="formSubmit" ml={{ xs: 0, sm: 1 }} display="flex" alignItems="center">
                    <BaseButton
                      className={classes.submitButton}
                      onClick={() => {
                        setFieldValue('secretType', secretType)
                        setFieldValue('alias', generateNanoId(urlAliasLength))
                        setFieldValue('encryptionKey', generateNanoId(encryptionKeyLength))

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
        <Box mb={1}>
          <Accordion />
        </Box>
        <NextLink href="/faq" passHref>
          <BaseButton variant="text" color="primary" startIcon={<ArrowForward />}>
            Read more on FAQ page
          </BaseButton>
        </NextLink>
      </Box>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  let userSettings = {}

  if (session) {
    const options = { headers: { cookie: context.req.headers.cookie as string } }
    const res = await fetch(`${baseUrl}/api/me`, options)
    const json = await res.json()
    userSettings = json?.userSettings
  }

  return {
    props: { userSettings },
  }
}

export default HomeView
