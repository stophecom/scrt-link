import React, { useState, useCallback, useReducer } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Box, InputAdornment, Typography } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'

import { ArrowForward } from '@material-ui/icons'

import { Link, BaseButtonLink } from '@/components/Link'
import { PageError } from '@/components/Error'
import BooleanSwitch from '@/components/BooleanSwitch'
import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { Maybe } from '@/types'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import { DestructionMessage, DestructionTimeout } from '@/components/CustomerForm'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'

import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'
import { getLimits, generateNanoId, encryptMessage } from '@/utils'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import LinkIcon from '@material-ui/icons/Link'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'
import { urlAliasLength, encryptionKeyLength } from '@/constants'
import { doReset, doRequest, doSuccess, doError, createReducer } from '@/utils/axios'
import { UIStore } from '@/store'
import { demoMessage } from '@/data/faq'
import { useCustomer } from '@/utils/api'

const Accordion = dynamic(() => import('@/components/Accordion'))
const Result = dynamic(() => import('./components/Result'))
const PlanSelection = dynamic(() => import('@/components/PlanSelection'))
const Neogram = dynamic(() => import('@/components/Neogram'))

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

const HomeView: React.FunctionComponent = () => {
  const classes = useStyles()
  const plausible = usePlausible()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [secretType, setSecretType] = useState<SecretType>('message')
  const [neogramPreview, setNeogramPreview] = useState(false)
  const { data: customer } = useCustomer()

  const initialValues: SecretUrlFormValues = {
    message: '',
    secretType: 'message',
    alias: '',
    encryptionKey: '',
    neogramDestructionMessage:
      customer?.neogramDestructionMessage || 'This message will self-destruct in…',
    neogramDestructionTimeout: customer?.neogramDestructionTimeout || 5,
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

  const getFormFieldConfigBySecretType = (secretType: SecretType) => {
    return secretTypesMap[secretType]
  }

  type CounterProps = {
    messageLength: number
  }
  const Counter: React.FunctionComponent<CounterProps> = ({ messageLength = 0 }) => {
    const charactersLeft = getLimits(customer?.role).maxMessageLength - messageLength
    return (
      <small className={classes.counter}>
        {charactersLeft.toLocaleString()}
        {charactersLeft < 0 && (
          <>
            &nbsp;|&nbsp; Need more?&nbsp;
            <Link href="/account">Get free account</Link>
          </>
        )}
      </small>
    )
  }

  if (error) {
    return <PageError error={error} />
  }

  if (data) {
    return (
      <Page
        title="Success!"
        subtitle="Your secret link has been created - now share it with your confidant."
      >
        <Result
          data={data}
          isEmojiShortLinkEnabled={customer?.isEmojiShortLinkEnabled ?? false}
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
      <Box mb={1}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={secretType}
          tabsMenu={Object.values(tabsMenu)}
          label="Select secret type"
        />
      </Box>
      <Box mb={5}>
        <Formik<SecretUrlFormValues>
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={getValidationSchemaByType(
            secretType,
            hasFormOptions,
            getLimits(customer?.role).maxMessageLength,
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
                          <DestructionMessage
                            {...(customer?.role !== 'premium'
                              ? {
                                  disabled: true,
                                  helperText: 'Unlock this option with the premium plan.',
                                }
                              : {})}
                          />
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
                      <BooleanSwitch
                        checked={hasFormOptions}
                        onChange={setHasFormOptions}
                        name="formOptions"
                        label="With options"
                      />

                      {secretType === 'neogram' && (
                        <Box ml="auto">
                          <BaseButton
                            // href={`/l/preview?preview=${encodeURIComponent(
                            //   JSON.stringify({
                            //     ...omit(['password', 'encryptionKey'], values),
                            //     message: values.message || demoMessage,
                            //     secretType,
                            //   }),
                            // )}`}
                            variant="text"
                            target="_blank"
                            onClick={() => {
                              setNeogramPreview(true)
                              plausible(values?.message ? 'Preview' : 'Demo', {
                                props: { secretType },
                              })
                            }}
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
                {neogramPreview && (
                  <Neogram
                    message={values.message || demoMessage}
                    timeout={Number(values.neogramDestructionTimeout)}
                    destructionMessage={values.neogramDestructionMessage}
                    onFinished={() => setNeogramPreview(false)}
                    closable
                  />
                )}
              </>
            )
          }}
        </Formik>
      </Box>

      <Section
        title={'How it works'}
        subtitle={`Add your message, create a secret link and share it with your confidant. That's it. We do the magic in between.`}
      >
        <HowItWorks />
      </Section>

      <Section title={'FAQ'} subtitle="Frequently asked questions.">
        <Box mb={1}>
          <Accordion />
        </Box>
        <BaseButtonLink href="/faq" variant="text" color="primary" startIcon={<ArrowForward />}>
          Read more on FAQ page
        </BaseButtonLink>
      </Section>

      {customer?.role !== 'premium' && (
        <Section
          title={'Top Secret'}
          subtitle={`Do you have bigger secrets? Never worry about sharing sensitive information again.`}
        >
          <PlanSelection />
        </Section>
      )}
    </Page>
  )
}

export default HomeView
