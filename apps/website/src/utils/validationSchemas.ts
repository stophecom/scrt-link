import * as Yup from 'yup'
import { setLocale, object, string, defaultLocale } from 'yup'
import validator from 'validator'
import { TFunction } from 'next-i18next'
import { de, fr } from 'yup-locales'

import { Role, ReadReceiptMethod } from '@/api/models/Customer'
import { SecretType } from '@/api/models/SecretUrl'
import { getLimits } from '@/utils'
import { SupportedLanguage } from '@/constants'

export const setYupLocale = (locale?: SupportedLanguage) => {
  switch (locale) {
    case 'de': {
      setLocale(de)
      break
    }
    case 'fr': {
      setLocale(fr)
      break
    }
    default: {
      setLocale(defaultLocale)
    }
  }
}

const secretTypes = ['text', 'url', 'neogram', 'file']
const readReceiptMethods = ['none', 'email', 'ntfy']

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const typeValidation = {
  secretType: Yup.mixed().oneOf(secretTypes),
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

const receiptNtfyValidation = (t: TFunction) => ({
  receiptNtfy: Yup.string().label(t('common:validation.ntfy', 'Ntfy')).required().max(200).trim(),
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

export const getValidationSchemaByType = (
  t: TFunction,
  secretType: SecretType,
  readReceiptMethod: ReadReceiptMethod,
  role: Role = 'visitor',
) => {
  const maxMessageLength = getLimits(role).maxMessageLength
  const isEmailReceiptAllowed = ['free', 'premium'].includes(role)
  const isNtfyReceiptAllowed = ['free', 'premium'].includes(role)

  const messageValidation = (maxLength: number) => ({
    message: Yup.string()
      .label(t('common:validation.message', 'Message'))
      .required()
      .min(1)
      .max(maxLength)
      .trim(),
  })

  const schemataBySecretTypeMap = {
    file: {
      message: Yup.string()
        .label(t('common:validation.message', 'Message'))
        .min(1)
        .max(maxMessageLength)
        .trim(),
    },
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
    ntfy: receiptNtfyValidation(t),
    email: receiptEmailValidation(t),
  }

  return Yup.object().shape({
    ...schemataBySecretTypeMap[secretType],
    ...schemataByReadReceiptMap[readReceiptMethod],
    ...typeValidation,
    password: Yup.string().label(t('common:validation.password', 'Password')).min(5).max(50).trim(),
    readReceiptMethod: Yup.mixed()
      .oneOf(
        [
          'none',
          ...(isEmailReceiptAllowed ? ['email'] : []),
          ...(isNtfyReceiptAllowed ? ['ntfy'] : []),
        ],
        t('common:validation.notAllowed', 'Not allowed.'),
      )
      .required()
      .label(t('common:validation.readReceipts', 'Read receipts')),
  })
}

export const apiValidationSchemaByType = Yup.object().shape({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    password: Yup.string()
      .label(t('common:validation.password', 'Password'))
      .required()
      .min(5)
      .max(50)
      .trim(),
  })

export const getCustomerValidationSchema = (t: TFunction, readReceiptMethod: ReadReceiptMethod) =>
  object().shape({
    name: Yup.string().label(t('common:validation.name', 'Name')).max(200).trim(),
    ...neogramDestructionMessageValidation(t),
    ...neogramDestructionTimeoutValidation(t),
    readReceiptMethod: Yup.mixed()
      .oneOf(readReceiptMethods)
      .label(t('common:validation.readReceipts', 'Read receipts')),
    isEmojiShortLinkEnabled: Yup.boolean().label(
      t('common:validation.emojiLink', 'Emoji short link'),
    ),
    ...(readReceiptMethod === 'email' ? receiptEmailValidation(t) : {}),
    ...(readReceiptMethod === 'ntfy' ? receiptNtfyValidation(t) : {}),
  })

export const customerNameSchema = object({
  name: string().max(200).trim(),
})

export const deleteCustomerValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    isSure: Yup.boolean()
      .required()
      .oneOf([true], t('common:validation.confirmationRequired', 'Field must be checked')),
  })

export const getSignInValidationSchema = (t: TFunction, isSignUp?: boolean) =>
  Yup.object().shape({
    email: Yup.string().label(t('common:validation.email', 'Email')).required().email().trim(),
    ...(isSignUp
      ? {
          isConsentToTermsGiven: Yup.boolean()
            .required()
            .oneOf([true], t('common:validation.consentRequired', 'Your consent is required.')),
        }
      : {}),
  })
