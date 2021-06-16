import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, InputAdornment } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'

import { Link } from '@/components/Link'
import BaseTextField from '@/components/BaseTextField'
import BasePasswordField from '@/components/BasePasswordField'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import {
  DestructionMessage,
  DestructionTimeout,
  readReceiptsOptions,
} from '@/components/FormCustomer'
import TabsMenu from '@/components/TabsMenu'
import BaseRadiosField from '@/components/BaseRadiosField'
import BasePhoneField from '@/components/BasePhoneField'
import UpgradeNotice from '@/components/UpgradeNotice'

import { getLimits, generateNanoId, encryptMessage } from '@/utils'
import { getValidationSchemaByType } from '@/utils/validationSchemas'
import BaseButton from '@/components/BaseButton'

import { urlAliasLength, encryptionKeyLength, emailPlaceholder } from '@/constants'
import { UIStore } from '@/store'
import { demoMessage } from '@/data/faq'
import { api, useCustomer } from '@/utils/api'
import { SecretPost } from '@/types'

import { ReadReceiptMethod } from '@/api/models/Customer'
import { Action, doRequest, doSuccess, doError } from '@/views/Home'

const Neogram = dynamic(() => import('@/components/Neogram'))

type SecretTypeConfig = {
  label?: string
  tabLabel?: string
  placeholder?: string
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type SecretUrlFormValues = Omit<SecretUrlFields, 'isEncryptedWithUserPassword'> & {
  password?: string
  encryptionKey: string
  readReceiptMethod: ReadReceiptMethod
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
    tabLabel: 'Link',
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
    counter: {
      position: 'absolute',
      bottom: 12,
      right: 10,
    },
  }),
)

type FormCreateSecretProps = {
  dispatch: React.Dispatch<Action>
}
const FormCreateSecret: React.FunctionComponent<FormCreateSecretProps> = ({ dispatch }) => {
  const classes = useStyles()
  const plausible = usePlausible()
  const [secretType, setSecretType] = useState<SecretType>('text')
  const [readReceiptMethod, setReadReceiptMethod] = useState<ReadReceiptMethod>('none')
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
    readReceiptMethod: (customer?.readReceiptMethod as ReadReceiptMethod) || 'none',
  }

  const handleSubmit: OnSubmit<SecretUrlFormValues> = async (values, formikHelpers) => {
    const {
      password,
      secretType,
      alias,
      encryptionKey,
      readReceiptMethod,
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

    let data = {
      ...omit(['password', 'encryptionKey', 'readReceiptMethod'], values),
      alias,
      message,
      secretType,
      receiptEmail: readReceiptMethod === 'email' && receiptEmail ? receiptEmail : undefined,
      receiptPhoneNumber:
        readReceiptMethod === 'sms' && receiptPhoneNumber ? receiptPhoneNumber : undefined,
      isEncryptedWithUserPassword: !!password,
    }

    if (secretType !== 'neogram') {
      data = omit(['neogramDestructionMessage', 'neogramDestructionTimeout'], data)
    }

    try {
      const response = await api<SecretPost>('/secret', { method: 'POST' }, data)

      if (response) {
        dispatch(doSuccess({ ...response, encryptionKey, readReceiptMethod }))
      }
      plausible('SecretCreation', {
        props: {
          secretType: secretType,
          messageLength: message.length,
          withPassword: !!password,
        },
      })
      formikHelpers.resetForm()
    } catch (error) {
      dispatch(doError(error))
    } finally {
      formikHelpers.setSubmitting(false)
    }
  }

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
            <Link href="/account?signup=true">Get free account</Link>
          </>
        )}
      </small>
    )
  }

  return (
    <>
      <Box px={2} pt={1} pb={1}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={secretType}
          tabsMenu={Object.values(tabsMenu)}
          label="Select secret type"
        />
      </Box>
      <Box px={2} pb={2}>
        <Formik<SecretUrlFormValues>
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={getValidationSchemaByType(
            secretType,
            readReceiptMethod,
            customer?.role,
          )}
          validateOnMount
          onSubmit={handleSubmit}
        >
          {({ isValid, isSubmitting, setFieldValue, setFieldTouched, touched, values }) => {
            return (
              <>
                <Form noValidate>
                  <Box position="relative" py={1}>
                    {secretType === 'url' && (
                      <BaseTextField
                        name="message"
                        label="Secret URL"
                        placeholder="example.com"
                        required
                        InputLabelProps={{
                          shrink: undefined,
                        }}
                        helperText="The URL to get redirected to (one time)."
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
                        name="readReceiptMethod"
                        label="Read receipts"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setReadReceiptMethod(e.target.value as ReadReceiptMethod)
                        }}
                      />
                      {values?.readReceiptMethod === 'email' &&
                        (['free', 'premium'].includes(customer?.role || '') ? (
                          <Box pt={2}>
                            <BaseTextField
                              name="receiptEmail"
                              label="Email"
                              required
                              placeholder={emailPlaceholder}
                            />
                          </Box>
                        ) : (
                          <Box pt={1}>
                            <UpgradeNotice requiredRole="free" />
                          </Box>
                        ))}

                      {values?.readReceiptMethod === 'sms' &&
                        (customer?.role === 'premium' ? (
                          <Box pt={2}>
                            <BasePhoneField name="receiptPhoneNumber" required label="Phone" />
                          </Box>
                        ) : (
                          <Box pt={1}>
                            <UpgradeNotice requiredRole="premium" />
                          </Box>
                        ))}
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
                    >
                      <BaseButton
                        startIcon={hasFormOptions ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => {
                          // Workaround to validate field initially onChange, not onBlur
                          if (!touched.readReceiptMethod) {
                            setFieldTouched('readReceiptMethod')
                          }
                          setHasFormOptions(!hasFormOptions)
                        }}
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
                    <Box key="formSubmit" ml={{ xs: 0, sm: 1 }} display="flex" alignItems="center">
                      <BaseButton
                        fullWidth={true}
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
    </>
  )
}

export default FormCreateSecret
