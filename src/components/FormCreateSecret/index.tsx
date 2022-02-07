import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Box, InputAdornment, NoSsr } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import { omit } from 'ramda'
import { usePlausible } from 'next-plausible'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'
import { useTranslation, TFunction } from 'next-i18next'
import axios from 'axios'

import { createSecret, generateAlias } from 'scrt-link-core'

import DropZone from '@/components/DropZone'
import { getLimits } from '@/utils'
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
import BaseRadioGroupField from '@/components/BaseRadioGroupField'
import BasePhoneField from '@/components/BasePhoneField'
import UpgradeNotice from '@/components/UpgradeNotice'

import { getValidationSchemaByType } from '@/utils/validationSchemas'
import BaseButton from '@/components/BaseButton'
import { api } from '@/utils/api'
import { emailPlaceholder } from '@/constants'
import { demoNeogramMessage } from '@/data/faq/product'
import { useCustomer } from '@/utils/api'
import { getBaseURL } from '@/utils'

import { ReadReceiptMethod } from '@/api/models/Customer'
import { Action, doRequest, doSuccess, doError } from '@/views/Home'
import { encryptFile, encryptString, generateEncryptionKeyString } from '@/utils/crypto'

const bucket = process.env.NEXT_PUBLIC_FLOW_S3_BUCKET

const Neogram = dynamic(() => import('@/components/Neogram'))

type SecretTypeConfig = {
  label?: string
  tabLabel?: string
  placeholder?: string
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type PresignedPostResponse = { url: string; fields: Record<string, string> }

type SecretUrlFormValues = Omit<SecretUrlFields, 'isEncryptedWithUserPassword'> & {
  password?: string
  encryptionKey: string
  alias: string
  readReceiptMethod: ReadReceiptMethod
  file?: File
}

type ObjKey = { [key: string]: SecretTypeConfig }

export const secretTypesMap = (t: TFunction) =>
  ({
    text: {
      label: t('common:secretType.text.label', 'Your secret'),
      tabLabel: t('common:secretType.text.tabLabel', 'Text'),
      placeholder: t(
        'common:secretType.text.placeholder',
        'Secret message, password, private key, etc.',
      ),
    },
    file: {
      label: t('common:secretType.file.label', 'Optional Message'),
      tabLabel: t('common:secretType.file.tabLabel', 'File'),
      placeholder: t(
        'common:secretType.file.placeholder',
        'Add an optional message for the recipient…',
      ),
    },
    url: {
      label: t('common:secretType.url.label', 'URL'),
      tabLabel: t('common:secretType.url.tabLabel', 'Link'),
      placeholder: t('common:secretType.url.placeholder', 'e.g. https://www.example.com'),
    },
    neogram: {
      label: t('common:secretType.neogram.label', 'Your secret'),
      tabLabel: t('common:secretType.neogram.tabLabel', 'Neogram™'),
      placeholder: t('common:secretType.neogram.placeholder', 'Wake up Neo…'),
    },
  } as ObjKey)

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
  isStandalone?: boolean
}
const FormCreateSecret: React.FunctionComponent<FormCreateSecretProps> = ({
  dispatch,
  isStandalone,
}) => {
  const { t } = useTranslation('common')
  const classes = useStyles()
  const plausible = usePlausible()
  const [secretType, setSecretType] = useState<SecretType>('text')
  const [progress, setProgress] = useState(0)
  const [readReceiptMethod, setReadReceiptMethod] = useState<ReadReceiptMethod>('none')
  const [neogramPreview, setNeogramPreview] = useState(false)
  const [key, setKey] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const { data: customer } = useCustomer()

  const secretMap = secretTypesMap(t)
  const tabsMenu = Object.keys(secretMap).map((item) => {
    const secretTypeItem = secretMap[item]

    return {
      label: secretTypeItem.tabLabel as string,
      key: item,
    }
  })

  useEffect(() => {
    const getKey = async () => {
      const key = await generateEncryptionKeyString()
      setKey(key)
    }

    getKey()
  }, [])

  const initialValues = {
    message: '',
    secretType: 'text' as SecretType,
    alias: generateAlias(),
    encryptionKey: key,
    neogramDestructionMessage:
      customer?.neogramDestructionMessage ||
      t(
        'common:FormField.neogramDestructionMessage.placeholder',
        'This message will self-destruct in…',
      ),
    neogramDestructionTimeout: customer?.neogramDestructionTimeout || 3,
    receiptEmail: customer?.receiptEmail || '',
    receiptPhoneNumber: customer?.receiptPhoneNumber || '',
    readReceiptMethod: (customer?.readReceiptMethod as ReadReceiptMethod) || 'none',
  }

  const handleSubmit: OnSubmit<SecretUrlFormValues> = async (values, formikHelpers) => {
    const {
      password,
      message,
      secretType,
      alias,
      encryptionKey,
      readReceiptMethod,
      receiptEmail,
      receiptPhoneNumber,
    } = values
    const messageLength = message?.length || 0

    dispatch(doRequest({ alias, encryptionKey }))
    window.scrollTo(0, 0)

    let meta

    try {
      if (secretType === 'file' && file) {
        const encryptedFile = await encryptFile(file, encryptionKey)

        const filename = encodeURIComponent(alias)

        const fileMeta = {
          bucket: bucket,
          key: filename,
          name: file.name,
          size: file.size,
          fileType: file.type,
        }

        meta = await encryptString(JSON.stringify(fileMeta), encryptionKey)

        console.log({ meta })
        console.log({ fileMeta })

        const { url, fields } = await api<PresignedPostResponse>(
          `/files?file=${filename}&bucket=${bucket}`,
        )

        // Post file to S3
        const formData = new FormData()
        Object.entries(fields).forEach(([key, value]) => {
          if (typeof value !== 'string') {
            return
          }
          formData.append(key, value)
        })
        formData.append('Content-type', 'application/octet-stream') // Setting content type a binary file.
        formData.append('file', encryptedFile)

        // Using axios instead of fetch for progress info
        await axios
          .request({
            method: 'POST',
            url,
            data: formData,
            onUploadProgress: (p) => {
              setProgress(p.loaded / p.total)
              dispatch(
                doSuccess({
                  progress: p.loaded / p.total,
                }),
              )
            },
          })
          .catch((err) => {
            throw Error(`File upload failed. Make sure the file is within the size limit.`)
          })

        setProgress(1)
      }

      let data = {
        ...omit(['readReceiptMethod', 'message'], values),
        alias,
        encryptionKey,
        secretType,
        receiptEmail: readReceiptMethod === 'email' && receiptEmail ? receiptEmail : undefined,
        receiptPhoneNumber:
          readReceiptMethod === 'sms' && receiptPhoneNumber ? receiptPhoneNumber : undefined,
        meta,
      }

      if (secretType !== 'neogram') {
        data = omit(['neogramDestructionMessage', 'neogramDestructionTimeout'], data)
      }

      const response = await createSecret(
        message || t('common:components.FormCreateSecret.emptyMessage', 'None'),
        data,
        getBaseURL(),
      )

      if (response) {
        dispatch(
          doSuccess({
            message: t('common:components.FormCreateSecret.secretSaved', 'Secret saved!'),
            alias,
            encryptionKey,
            readReceiptMethod,
          }),
        )

        plausible('SecretCreation', {
          props: {
            secretType: secretType,
            messageLength: messageLength,
            withPassword: !!password,
          },
        })
      }

      formikHelpers.resetForm()
    } catch (error) {
      dispatch(doError(error instanceof Error ? error : new Error('Secret creation failed.')))
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
    return secretMap[secretType]
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
            &nbsp;|&nbsp; {t('common:components.FormCreateSecret.needMore', 'Need more?')}
            &nbsp;
            <Link href="/signup">
              {t('common:components.FormCreateSecret.getFreeAccount', 'Get free account')}
            </Link>
          </>
        )}
      </small>
    )
  }

  return (
    <>
      <Box pt={1} pb={1}>
        <TabsMenu
          handleChange={handleMenuChange}
          value={secretType}
          tabsMenu={Object.values(tabsMenu)}
          label={t('common:components.FormCreateSecret.selectSecretType', 'Select secret type')}
        />
      </Box>
      <Box pb={2}>
        <Formik<SecretUrlFormValues>
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={getValidationSchemaByType(
            t,
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
                    {secretType === 'file' && (
                      <DropZone
                        maxFileSize={getLimits(customer?.role || 'visitor').maxFileSize}
                        onChange={(file) => {
                          setFile(file)
                        }}
                      />
                    )}

                    {secretType === 'url' && (
                      <BaseTextField
                        name="message"
                        label={t('common:FormField.url.label', 'Secret URL')}
                        placeholder="example.com"
                        required
                        InputLabelProps={{
                          shrink: undefined,
                        }}
                        helperText={t(
                          'common:FormField.url.helperText',
                          'The URL to get redirected to (one time).',
                        )}
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
                          minRows={3}
                          maxRows={7}
                          label={getFormFieldConfigBySecretType(secretType).label}
                          placeholder={getFormFieldConfigBySecretType(secretType).placeholder}
                          InputLabelProps={{
                            shrink: undefined,
                          }}
                        />
                        <Counter messageLength={values?.message?.length || 0} />
                      </>
                    )}
                  </Box>
                  <Collapse in={hasFormOptions}>
                    <NoSsr>
                      {['file'].includes(secretType) && (
                        <>
                          <BaseTextField
                            name="message"
                            multiline
                            minRows={3}
                            maxRows={3}
                            label={getFormFieldConfigBySecretType(secretType).label}
                            placeholder={getFormFieldConfigBySecretType(secretType).placeholder}
                            InputLabelProps={{
                              shrink: undefined,
                            }}
                          />
                        </>
                      )}
                      <Box py={1}>
                        <BasePasswordField className={clsx(classes.root)} name="password" />
                      </Box>
                      <Box pl={1} pt={3} pb={6}>
                        <BaseRadioGroupField
                          options={readReceiptsOptions(t)}
                          name="readReceiptMethod"
                          label={t('common:FormField.readReceiptMethod.label', 'Read receipts')}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setReadReceiptMethod(e.target.value as ReadReceiptMethod)
                          }}
                        />
                        {values?.readReceiptMethod === 'email' &&
                          (['free', 'premium'].includes(customer?.role || '') ? (
                            <Box pt={2}>
                              <BaseTextField
                                name="receiptEmail"
                                label={t('common:FormField.receiptEmail.label', 'Email')}
                                required
                                placeholder={emailPlaceholder}
                              />
                            </Box>
                          ) : (
                            <Box pt={1}>
                              <UpgradeNotice requiredRole="free" openLinksInNewTab={isStandalone} />
                            </Box>
                          ))}

                        {values?.readReceiptMethod === 'sms' &&
                          (customer?.role === 'premium' ? (
                            <Box pt={2}>
                              <BasePhoneField
                                name="receiptPhoneNumber"
                                required
                                label={t('common:FormField.receiptPhoneNumber.label', 'Phone')}
                              />
                            </Box>
                          ) : (
                            <Box pt={1}>
                              <UpgradeNotice
                                requiredRole="premium"
                                openLinksInNewTab={isStandalone}
                              />
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
                    </NoSsr>
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
                        {hasFormOptions
                          ? t('common:button.lessOptions', 'Less options')
                          : t('common:button.moreOptions', 'More options')}
                      </BaseButton>

                      {secretType === 'neogram' && (
                        <Box ml="auto">
                          <BaseButton
                            variant="text"
                            onClick={() => {
                              setNeogramPreview(true)
                              plausible(values?.message ? 'Preview' : 'Demo', {
                                props: { secretType },
                              })
                            }}
                          >
                            {values?.message
                              ? t('common:button.preview', 'Preview')
                              : t('common:button.demo', 'Demo')}
                          </BaseButton>
                        </Box>
                      )}
                    </Box>
                    <Box key="formSubmit" ml={{ xs: 0, sm: 1 }} display="flex" alignItems="center">
                      <BaseButton
                        fullWidth={true}
                        onClick={() => {
                          setFieldValue('secretType', secretType)
                        }}
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                        disabled={!isValid || (!file && secretType === 'file')}
                      >
                        {t('common:button.createSecretLink', 'Create secret link')}
                      </BaseButton>
                    </Box>
                  </Box>
                </Form>
                {neogramPreview && (
                  <Neogram
                    message={values.message || demoNeogramMessage(t)}
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
