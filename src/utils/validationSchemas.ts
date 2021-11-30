import * as Yup from 'yup'
import validator from 'validator'

import { Role, CustomerFields, readReceiptOptions, ReadReceiptMethod } from '@/api/models/Customer'
import { SecretUrlFields, secretTypes, SecretType } from '@/api/models/SecretUrl'
import { getLimits } from '@/utils'
import { TFunction } from 'next-i18next'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const messageValidation = (maxLength: number) => ({
  message: Yup.string().label('Message').required().min(1).max(maxLength).trim(),
})
const typeValidation = {
  secretType: Yup.mixed().oneOf(secretTypes),
}
const neogramDestructionMessageValidation = {
  neogramDestructionMessage: Yup.string().label('Destruction message').max(200).trim(),
}
const neogramDestructionTimeoutValidation = {
  neogramDestructionTimeout: Yup.number().label('Destruction timeout').required().min(1).max(200),
}
const receiptEmailValidation = {
  receiptEmail: Yup.string().label('Email').email().required().max(200).trim(),
}
const receiptPhoneNumberValidation = {
  receiptPhoneNumber: Yup.string()
    .label('Phone')
    .matches(phoneRegExp, 'Phone number is not valid')
    .required()
    .trim(),
}

const urlValidation = {
  message: Yup.string()
    .label('URL')
    .required()
    .test(
      'is-url',
      ({ label }) => `${label} does not have a valid URL format`,
      (value) => (value ? validator.isURL(value) : true),
    )
    .trim(),
}

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

  const schemataBySecretTypeMap = {
    url: urlValidation,
    text: messageValidation(maxMessageLength),
    neogram: {
      ...messageValidation(maxMessageLength),
      ...neogramDestructionMessageValidation,
      ...neogramDestructionTimeoutValidation,
    },
  }

  const schemataByReadReceiptMap = {
    none: {},
    sms: receiptPhoneNumberValidation,
    email: receiptEmailValidation,
  }

  return Yup.object().shape({
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

export const apiValidationSchemaByType = Yup.object().shape({
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

// This is essentially the same as below, without translations
export const getCustomerValidationSchemaServer = (readReceiptMethod: ReadReceiptMethod) =>
  Yup.object().shape<Partial<CustomerFields>>({
    name: Yup.string().label('Name').max(200).trim(),
    ...neogramDestructionMessageValidation,
    ...neogramDestructionTimeoutValidation,
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(readReceiptOptions)
      .label('Read receipts'),
    isEmojiShortLinkEnabled: Yup.boolean().label('Emoji short link'),
    ...(readReceiptMethod === 'email' ? receiptEmailValidation : {}),
    ...(readReceiptMethod === 'sms' ? receiptPhoneNumberValidation : {}),
  })

export const getCustomerValidationSchema = (t: TFunction, readReceiptMethod: ReadReceiptMethod) =>
  Yup.object().shape<Partial<CustomerFields>>({
    name: Yup.string().label(t('common:validation.name', 'Name')).max(200).trim(),
    ...neogramDestructionMessageValidation,
    ...neogramDestructionTimeoutValidation,
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(readReceiptOptions)
      .label(t('common:validation.readReceipts', 'Read receipts')),
    isEmojiShortLinkEnabled: Yup.boolean().label(
      t('common:validation.emojiLink', 'Emoji short link'),
    ),
    ...(readReceiptMethod === 'email' ? receiptEmailValidation : {}),
    ...(readReceiptMethod === 'sms' ? receiptPhoneNumberValidation : {}),
  })

export const deleteCustomerValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    isSure: Yup.boolean()
      .label('Are you sure')
      .required()
      .oneOf([true], t('common:validation.confirmationRequired', 'Field must be checked')),
  })

export const getSignInValidationSchema = (isSignUp?: boolean) =>
  Yup.object().shape<{ email: string }>({
    email: Yup.string().label('Email').required().email().trim(),
    ...(isSignUp
      ? {
          isConsentToTermsGiven: Yup.boolean()
            .label('Are you sure')
            .required()
            .oneOf([true], 'Your consent is required.'),
        }
      : {}),
  })

export const shareSecretViaEmailSchema = Yup.object().shape({
  message: Yup.string().label('Message').max(280).trim(),
  recipientName: Yup.string().label('Name').max(280).trim(),
  secretUrl: Yup.string().label('Secret URL').required().trim(),
  recipientEmail: Yup.string().label('Email').required().email().trim(),
})
