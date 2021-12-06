import * as Yup from 'yup'
import { setLocale } from 'yup'
import validator from 'validator'
import { TFunction } from 'next-i18next'

import { Role, CustomerFields, ReadReceiptMethod } from '@/api/models/Customer'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import { getLimits } from '@/utils'
import { SupportedLanguage } from '@/constants'
import { de } from 'yup-locales'
import defaultLocale from 'yup/lib/locale'

export const setYupLocale = (locale?: SupportedLanguage) => {
  if (locale === 'de') {
    setLocale(de)
  } else {
    setLocale(defaultLocale)
  }
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// @todo
const secretTypes = ['text' as SecretType, 'url' as SecretType, 'neogram' as SecretType]
const readReceiptMethods = [
  'none' as ReadReceiptMethod,
  'sms' as ReadReceiptMethod,
  'email' as ReadReceiptMethod,
]

const typeValidation = {
  secretType: Yup.mixed<SecretType>().oneOf(secretTypes),
}

const neogramDestructionMessageValidation = (t: TFunction) => ({
  neogramDestructionMessage: Yup.string()
    .label(t('common:validation.destructionMessage', 'Destruction message'))
    .max(200)
    .trim(),
})

const neogramDestructionTimeoutValidation = (t: TFunction) => ({
  neogramDestructionTimeout: Yup.number()
    .label(t('common:validation.destructionTimeout', 'Destruction timeout'))
    .required()
    .min(1)
    .max(200),
})

const receiptEmailValidation = (t: TFunction) => ({
  receiptEmail: Yup.string()
    .label(t('common:validation.email', 'Email'))
    .email()
    .required()
    .max(200)
    .trim(),
})

const receiptPhoneNumberValidation = (t: TFunction) => ({
  receiptPhoneNumber: Yup.string()
    .label(t('common:validation.phone', 'Phone'))
    .matches(phoneRegExp, t('common:validation.phoneNotValid', 'Phone number is not valid'))
    .required()
    .trim(),
})

const urlValidation = (t: TFunction) => ({
  message: Yup.string()
    .label('URL')
    .required()
    .test(
      'is-url',
      ({ label }) =>
        t('common:validation.urlNotValid', {
          defaultValue: `{{label}} does not have a valid URL format`,
          label,
        }),
      (value) => (value ? validator.isURL(value) : true),
    )
    .trim(),
})

type SecretFormInput = Pick<SecretUrlFields, 'secretType' | 'message'> & {
  password?: string
  readReceiptMethod?: ReadReceiptMethod
}
export const getValidationSchemaByType = (
  t: TFunction,
  secretType: SecretType,
  readReceiptMethod: ReadReceiptMethod,
  role: Role = 'visitor',
) => {
  const maxMessageLength = getLimits(role).maxMessageLength
  const isEmailReceiptAllowed = ['free', 'premium'].includes(role)
  const isSMSReceiptAllowed = role === 'premium'

  const messageValidation = (maxLength: number) => ({
    message: Yup.string()
      .label(t('common:validation.message', 'Message'))
      .required()
      .min(1)
      .max(maxLength)
      .trim(),
  })

  const schemataBySecretTypeMap = {
    url: urlValidation(t),
    text: messageValidation(maxMessageLength),
    neogram: {
      ...messageValidation(maxMessageLength),
      ...neogramDestructionMessageValidation(t),
      ...neogramDestructionTimeoutValidation(t),
    },
  }

  const schemataByReadReceiptMap = {
    none: {},
    sms: receiptPhoneNumberValidation(t),
    email: receiptEmailValidation(t),
  }

  return Yup.object().shape<SecretFormInput>({
    ...schemataBySecretTypeMap[secretType],
    ...schemataByReadReceiptMap[readReceiptMethod],
    ...typeValidation,
    password: Yup.string().label(t('common:validation.password', 'Password')).min(5).max(50).trim(),
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(
        [
          'none',
          ...(isEmailReceiptAllowed ? ['email' as ReadReceiptMethod] : []),
          ...(isSMSReceiptAllowed ? ['sms' as ReadReceiptMethod] : []),
        ],
        t('common:validation.notAllowed', 'Not allowed.'),
      )
      .label(t('common:validation.readReceipts', 'Read receipts')),
  })
}

export const apiValidationSchemaByType = Yup.object().shape<SecretFormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = (t: TFunction) =>
  Yup.object().shape<{ password: string }>({
    password: Yup.string()
      .label(t('common:validation.password', 'Password'))
      .required()
      .min(5)
      .max(50)
      .trim(),
  })

export const getCustomerValidationSchema = (t: TFunction, readReceiptMethod: ReadReceiptMethod) =>
  Yup.object().shape<Partial<CustomerFields>>({
    name: Yup.string().label(t('common:validation.name', 'Name')).max(200).trim(),
    ...neogramDestructionMessageValidation(t),
    ...neogramDestructionTimeoutValidation(t),
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(readReceiptMethods)
      .label(t('common:validation.readReceipts', 'Read receipts')),
    isEmojiShortLinkEnabled: Yup.boolean().label(
      t('common:validation.emojiLink', 'Emoji short link'),
    ),
    ...(readReceiptMethod === 'email' ? receiptEmailValidation(t) : {}),
    ...(readReceiptMethod === 'sms' ? receiptPhoneNumberValidation(t) : {}),
  })

export const deleteCustomerValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    isSure: Yup.boolean()
      .required()
      .oneOf([true], t('common:validation.confirmationRequired', 'Field must be checked')),
  })

export const getSignInValidationSchema = (t: TFunction, isSignUp?: boolean) =>
  Yup.object().shape<{ email: string }>({
    email: Yup.string().label(t('common:validation.email', 'Email')).required().email().trim(),
    ...(isSignUp
      ? {
          isConsentToTermsGiven: Yup.boolean()
            .required()
            .oneOf([true], t('common:validation.consentRequired', 'Your consent is required.')),
        }
      : {}),
  })

export const shareSecretViaEmailSchema = (t: TFunction) =>
  Yup.object().shape({
    message: Yup.string().label(t('common:validation.message', 'Message')).max(280).trim(),
    recipientName: Yup.string().label(t('common:validation.name', 'Name')).max(280).trim(),
    secretUrl: Yup.string().label(t('common:validation.secretUrl', 'Secret URL')).required().trim(),
    recipientEmail: Yup.string()
      .label(t('common:validation.email', 'Email'))
      .required()
      .email()
      .trim(),
  })
