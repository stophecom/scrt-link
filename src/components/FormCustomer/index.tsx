import React, { useState } from 'react'
import { InferType } from 'yup'
import { FormikState } from 'formik'

import { Box, Typography, FormLabel, Paper, InputAdornment } from '@mui/material'
import { useTranslation, TFunction, Trans } from 'next-i18next'

import { ManageAccounts } from '@mui/icons-material'

import BaseRadioGroupField from '@/components/BaseRadioGroupField'
import BaseTextField, { BaseTextFieldProps } from '@/components/BaseTextField'
import BasePhoneField from '@/components/BasePhoneField'
import BaseSwitchField from '@/components/BaseSwitchField'
import FormFactory from '@/components/FormFactory'

import UpgradeNotice from '@/components/UpgradeNotice'
import { getCustomerValidationSchema, customerNameSchema } from '@/utils/validationSchemas'

import { emailPlaceholder, neogramDestructionTimeoutDefault } from '@/constants'
import { ReadReceiptMethod } from '@/api/models/Customer'
import { useCustomer } from '@/utils/api'
import { MarkdownRaw } from '@/components/Markdown'

export const DestructionMessage = () => {
  const { t } = useTranslation()
  const { customer } = useCustomer()

  return (
    <BaseTextField
      name="neogramDestructionMessage"
      label={t('common:FormField.neogramDestructionMessage.label', 'Destruction message')}
      placeholder={t(
        'common:FormField.neogramDestructionMessage.placeholder',
        'This message will self-destruct in…',
      )}
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
> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <Box width="60%" minWidth={280}>
      <BaseTextField
        name="neogramDestructionTimeout"
        label={t('common:FormField.neogramDestructionTimeout.label', 'Destruction countdown')}
        type="number"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {t('common:FormField.neogramDestructionTimeout.endAdornment', 'seconds')}
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </Box>
  )
}

export const readReceiptsOptions = (t: TFunction) => [
  { value: 'none', label: t('common:FormField.readReceiptsOptions.none', 'None') },
  {
    value: 'email',
    label: t('common:FormField.readReceiptsOptions.email', 'Via Email'),
  },
  {
    value: 'sms',
    label: t('common:FormField.readReceiptsOptions.sms', 'Via SMS'),
  },
]

const PrivacyNotice = () => (
  <Trans i18nKey="common:components.FormCustomer.privacyNotice">
    This information is <strong>private</strong> and will never be shown to anybody. We only use it
    to send you read receipts.
  </Trans>
)

export const FormCustomer = () => {
  const { t } = useTranslation()
  const { customer, mutate: triggerFetchCustomer } = useCustomer()

  const [readReceiptMethod, setReadReceiptMethod] = useState<ReadReceiptMethod>('none')

  const validationSchema = getCustomerValidationSchema(t, readReceiptMethod).required()
  type Values = InferType<typeof validationSchema>

  return (
    <Paper square sx={{ marginBottom: '2em' }}>
      <FormFactory
        name="defaults"
        endpoint="/me"
        initialValues={{
          readReceiptMethod: 'none',
          ...customer,
          neogramDestructionMessage:
            customer?.neogramDestructionMessage ||
            t(
              'common:FormField.neogramDestructionMessage.placeholder',
              'This message will self-destruct in…',
            ),
          neogramDestructionTimeout:
            customer?.neogramDestructionTimeout || neogramDestructionTimeoutDefault,
        }}
        validationSchema={validationSchema}
        onSuccess={triggerFetchCustomer}
      >
        {({ values }: Partial<FormikState<Values>>) => {
          return (
            <>
              <Box mb={10}>
                <Box mb={8}>
                  <Typography variant="h2" display={'flex'} alignItems="center">
                    {t('common:components.FormCustomer.defaults', 'Defaults')}
                  </Typography>
                  {t(
                    'common:views.Account.settingsDisclaimer',
                    'The following are default settings. You can overwrite each setting for every secret you create.',
                  )}
                </Box>

                <BaseRadioGroupField
                  options={readReceiptsOptions(t)}
                  name="readReceiptMethod"
                  label={t('common:FormField.readReceiptMethod.label', 'Read receipts')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setReadReceiptMethod(e.target.value as ReadReceiptMethod)
                  }}
                />
                {values?.readReceiptMethod !== 'none' && (
                  <Box pt={2}>
                    {values?.readReceiptMethod === 'email' && (
                      <BaseTextField
                        name="receiptEmail"
                        label={t('common:FormField.receiptEmail.label', 'Email')}
                        required
                        placeholder={emailPlaceholder}
                        helperText={<PrivacyNotice />}
                      />
                    )}
                    {values?.readReceiptMethod === 'sms' && (
                      <>
                        <BasePhoneField
                          name="receiptPhoneNumber"
                          label={t('common:FormField.receiptPhoneNumber.label', 'Phone')}
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
                  <FormLabel component="legend">
                    {t('common:components.FormCustomer.emojiLink.title', 'Emoji link')} 🤫
                  </FormLabel>
                </Box>
                <Typography variant="body2">
                  <MarkdownRaw
                    source={t('common:components.FormCustomer.emojiLink.description', {
                      defaultValue: `Add some fun with a special emoji link. Example: {{exampleLink}}  
**Be aware.** Emoji links are supported in: {{supportedList}}. Currently not supported in: {{unsupportedList}}.`,
                      exampleLink: '**https://🤫.st/nxKFy…**',
                      supportedList: '*Whatsapp, Telegram, Threema, Twitter, Matrix, Wire*',
                      unsupportedList: '*Signal, Slack, Snapchat*',
                    })}
                  />
                </Typography>
                <BaseSwitchField
                  label={t<string>(
                    'common:FormField.isEmojiShortLinkEnabled.label',
                    'Use emoji link',
                  )}
                  name="isEmojiShortLinkEnabled"
                />
              </Box>

              <Box>
                <Typography variant="h3">Neogram</Typography>
                <Box mb={3}>
                  <DestructionMessage />
                </Box>
                <Box mb={1}>
                  <DestructionTimeout />
                </Box>
              </Box>
            </>
          )
        }}
      </FormFactory>
    </Paper>
  )
}

export const FormCustomerName = () => {
  const { customer, mutate: triggerFetchCustomer } = useCustomer()
  const { t } = useTranslation()

  return (
    <Paper square sx={{ marginBottom: '2em' }}>
      <FormFactory
        name="customer-name"
        endpoint="/me"
        initialValues={{ name: customer?.name }}
        validationSchema={customerNameSchema}
        onSuccess={triggerFetchCustomer}
      >
        <Box mb={8}>
          <Typography variant="h2" display={'flex'} alignItems="center">
            <ManageAccounts sx={{ fontSize: '1em', marginRight: '.2em' }} />
            {t('common:components.FormCustomer.account', 'Account')}
          </Typography>

          <Trans i18nKey="common:FormField.name.helperText">
            This information is <strong>private</strong> and will never be shown to anybody. We only
            use it give you a personalized experience.
          </Trans>
        </Box>
        <Box>
          <BaseTextField name="name" label="Name" placeholder="Jane Doe" />
        </Box>
      </FormFactory>
    </Paper>
  )
}
export default FormCustomer
