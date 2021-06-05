import * as Yup from 'yup'
import validator from 'validator'

import { Role, CustomerFields, ReadReceiptMethod } from '@/api/models/Customer'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import { getLimits } from '@/utils'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// @todo
const secretTypes = ['text' as SecretType, 'url' as SecretType, 'neogram' as SecretType]
const readReceiptMethods = [
  'none' as ReadReceiptMethod,
  'sms' as ReadReceiptMethod,
  'email' as ReadReceiptMethod,
]

const messageValidation = (maxLength: number) => ({
  message: Yup.string().label('Message').required().min(1).max(maxLength).trim(),
})
const typeValidation = {
  secretType: Yup.mixed<SecretType>().oneOf(secretTypes),
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

  return Yup.object().shape<SecretFormInput>({
    ...schemataBySecretTypeMap[secretType],
    ...schemataByReadReceiptMap[readReceiptMethod],
    ...typeValidation,
    password: Yup.string().label('Password').min(5).max(50).trim(),
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(
        [
          'none',
          ...(isEmailReceiptAllowed ? ['email' as ReadReceiptMethod] : []),
          ...(isSMSReceiptAllowed ? ['sms' as ReadReceiptMethod] : []),
        ],
        !isEmailReceiptAllowed && !isSMSReceiptAllowed
          ? 'You need an account to enable read receipts.'
          : 'Subscribe to premium for the SMS option.',
      )
      .label('Read receipts'),
  })
}

export const apiValidationSchemaByType = Yup.object().shape<SecretFormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = Yup.object().shape<{ password: string }>({
  password: Yup.string().label('Password').required().min(5).max(50).trim(),
})

export const getCustomerValidationSchema = (readReceiptMethod: ReadReceiptMethod) =>
  Yup.object().shape<Partial<CustomerFields>>({
    name: Yup.string().label('Name').max(200).trim(),
    ...neogramDestructionMessageValidation,
    ...neogramDestructionTimeoutValidation,
    readReceiptMethod: Yup.mixed<ReadReceiptMethod>()
      .oneOf(readReceiptMethods)
      .label('Read receipts'),
    isEmojiShortLinkEnabled: Yup.boolean().label('Emoji short link'),
    ...(readReceiptMethod === 'email' ? receiptEmailValidation : {}),
    ...(readReceiptMethod === 'sms' ? receiptPhoneNumberValidation : {}),
  })

export const deleteCustomerValidationSchema = Yup.object().shape({
  isSure: Yup.boolean().label('Are you sure').required().oneOf([true], 'Field must be checked'),
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
