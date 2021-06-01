import React, { useState, useCallback, useReducer } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Box, InputAdornment, Paper } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'
import { ArrowForward, ExpandLess, ExpandMore } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'

import { Link, BaseButtonLink } from '@/components/Link'
import { PageError } from '@/components/Error'
import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { Maybe } from '@/types'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import {
  DestructionMessage,
  DestructionTimeout,
  readReceiptsOptions,
} from '@/components/CustomerForm'
import TabsMenu from '@/components/TabsMenu'
import Section from '@/components/Section'
import BaseRadiosField from '@/components/BaseRadiosField'
import BasePhoneField from '@/components/BasePhoneField'
import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'
import { getLimits, generateNanoId, encryptMessage } from '@/utils'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'
import { urlAliasLength, encryptionKeyLength, emailPlaceholder } from '@/constants'
import { doReset, doRequest, doSuccess, doError, createReducer } from '@/utils/axios'
import { UIStore } from '@/store'
import { demoMessage } from '@/data/faq'
import { useCustomer } from '@/utils/api'
import { scrollIntoView } from '@/utils/browser'
import { ReadReceiptType } from '@/api/models/Customer'

const Accordion = dynamic(() => import('@/components/Accordion'))
const Result = dynamic(() => import('./components/Result'))
const Neogram = dynamic(() => import('@/components/Neogram'))

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type SecretUrlFormValues = Omit<SecretUrlFields, 'isEncryptedWithUserPassword'> & {
  password?: string
  encryptionKey: string
  readReceipts: ReadReceiptType
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
  text: {
    label: 'Your secret',
    tabLabel: 'Text',
    placeholder: 'Secret message, password, private key, etc.',
  },
  url: {
    label: 'URL',
    tabLabel: 'Redirect',
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
  const [secretType, setSecretType] = useState<SecretType>('text')
  const [readReceiptType, setReadReceiptType] = useState<ReadReceiptType>('none')
  const [neogramPreview, setNeogramPreview] = useState(false)
  const { data: customer } = useCustomer()

  const initialValues: SecretUrlFormValues = {
    message: '',
    secretType: 'text',
    alias: '',
    encryptionKey: '',
    neogramDestructionMessage:
      customer?.neogramDestructionMessage || 'This message will self-destruct in…',
    neogramDestructionTimeout: customer?.neogramDestructionTimeout || 3,
    receiptEmail: customer?.receiptEmail || '',
    receiptPhoneNumber: customer?.receiptPhoneNumber || '',
    readReceipts: (customer?.readReceipts as ReadReceiptType) || 'none',
  }

  const handleSubmit = useCallback<OnSubmit<SecretUrlFormValues>>(async (values, formikHelpers) => {
    const {
      password,
      secretType,
      alias,
      encryptionKey,
      readReceipts,
      receiptEmail,
      receiptPhoneNumber,
    } = values
    let { message } = values

    if (password) {
      message = encryptMessage(message, password)
    }

    // Default encryption
    message = encryptMessage(message, encryptionKey)

    dispatch(doRequest({ alias, encryptionKey }))
    window.scrollTo(0, 0)

    const data = {
      ...omit(['password', 'encryptionKey', 'readReceipts'], values),
      alias,
      message,
      secretType,
      receiptEmail: readReceipts === 'email' && receiptEmail ? receiptEmail : undefined,
      receiptPhoneNumber:
        readReceipts === 'sms' && receiptPhoneNumber ? receiptPhoneNumber : undefined,
      isEncryptedWithUserPassword: !!password,
    }
    try {
      const response = await axios.post('/api/secret', data)
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
    const charactersLeft = getLimits(customer?.role || 'visitor').maxMessageLength - messageLength
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
      <Paper elevation={1} id="create" style={{ scrollMarginTop: '70px' }}>
        <Box px={2} pt={1} pb={1}>
          <TabsMenu
            handleChange={handleMenuChange}
            value={secretType}
            tabsMenu={Object.values(tabsMenu)}
            label="Select secret type"
          />
        </Box>
        <Box px={2} pb={2} mb={5}>
          <Formik<SecretUrlFormValues>
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={getValidationSchemaByType(
              secretType,
              readReceiptType,
              customer?.role,
            )}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ isValid, isSubmitting, setFieldValue, setFieldTouched, touched, values }) => {
              // Workaround to validate field initially onChange, not onBlur
              if (!touched['readReceipts']) {
                setFieldTouched('readReceipts')
              }
              return (
                <>
                  <Form noValidate>
                    <Box position="relative" py={1}>
                      {secretType === 'url' && (
                        <BaseTextField
                          name="message"
                          label="URL"
                          required
                          InputLabelProps={{
                            shrink: undefined,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      {['text', 'neogram'].includes(secretType) && (
                        <>
                          <BaseTextField
                            name="message"
                            multiline
                            required
                            rows={3}
                            rowsMax={7}
                            label={getFormFieldConfigBySecretType(secretType).label}
                            placeholder={getFormFieldConfigBySecretType(secretType).placeholder}
                            InputLabelProps={{
                              shrink: undefined,
                            }}
                          />
                          <Counter messageLength={values.message.length} />
                        </>
                      )}
                    </Box>

                    <Collapse in={hasFormOptions}>
                      <Box py={1}>
                        <BasePasswordField className={clsx(classes.root)} name="password" />
                      </Box>
                      <Box pl={1} pt={3} pb={6}>
                        <BaseRadiosField
                          options={readReceiptsOptions}
                          name="readReceipts"
                          label="Read receipts"
                          onChange={(e: any) => {
                            setReadReceiptType(e.target.value)
                          }}
                        />
                        {values?.readReceipts === 'email' &&
                          ['free', 'premium'].includes(customer?.role || '') && (
                            <Box py={1}>
                              <BaseTextField
                                name="receiptEmail"
                                label="Email"
                                placeholder={emailPlaceholder}
                              />
                            </Box>
                          )}
                        {values?.readReceipts === 'sms' && customer?.role === 'premium' && (
                          <Box py={1}>
                            <BasePhoneField name="receiptPhoneNumber" label="Phone" />
                          </Box>
                        )}
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
                      >
                        <BaseButton
                          startIcon={hasFormOptions ? <ExpandLess /> : <ExpandMore />}
                          onClick={() => setHasFormOptions(!hasFormOptions)}
                        >
                          {hasFormOptions ? 'Less options' : 'More options'}
                        </BaseButton>

                        {secretType === 'neogram' && (
                          <Box ml="auto">
                            <BaseButton
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
                      <Box
                        key="formSubmit"
                        ml={{ xs: 0, sm: 1 }}
                        display="flex"
                        alignItems="center"
                      >
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
      </Paper>

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

      <Box display="flex" justifyContent="center">
        <BaseButtonLink
          href="#create"
          size="large"
          variant="contained"
          color="primary"
          onClick={scrollIntoView}
        >
          Share a secret
        </BaseButtonLink>
      </Box>
    </Page>
  )
}

export default HomeView
