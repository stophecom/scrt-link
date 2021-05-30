import * as Yup from 'yup'
import validator from 'validator'

import { CustomerFields, ReadReceipts } from '@/api/models/Customer'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const secretTypes = ['text' as SecretType, 'url' as SecretType, 'neogram' as SecretType]
const readReceipts = ['none' as ReadReceipts, 'sms' as ReadReceipts, 'email' as ReadReceipts]

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
  neogramDestructionTimeout: Yup.number().label('Destruction timeout').max(30),
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

type SecretFormInput = Pick<SecretUrlFields, 'secretType' | 'message'> & { password?: string }
export const getValidationSchemaByType = (
  secretType: SecretType,
  hasPassword = false,
  maxMessageLength = 280,
) => {
  const schemataMap = {
    url: urlValidation,
    text: messageValidation(maxMessageLength),
    neogram: {
      ...messageValidation(maxMessageLength),
      ...neogramDestructionMessageValidation,
      ...neogramDestructionTimeoutValidation,
    },
  }

  return Yup.object().shape<SecretFormInput>({
    ...schemataMap[secretType],
    ...(hasPassword
      ? {
          password: Yup.string().label('Password').min(5).max(50).trim(),
        }
      : {}),
    ...typeValidation,
  })
}

export const apiValidationSchemaByType = Yup.object().shape<SecretFormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = Yup.object().shape<{ password: string }>({
  password: Yup.string().label('Password').required().min(5).max(50).trim(),
})

export const customerValidationSchema = Yup.object().shape<Partial<CustomerFields>>({
  name: Yup.string().label('Name').max(200).trim(),
  ...neogramDestructionMessageValidation,
  ...neogramDestructionTimeoutValidation,
  readReceipts: Yup.mixed<ReadReceipts>().oneOf(readReceipts).label('Read receipts'),
  isEmojiShortLinkEnabled: Yup.boolean().label('Emoji short link'),
  receiptEmail: Yup.string().label('Email').email().max(200).trim(),
  receiptPhoneNumber: Yup.string()
    .label('Phone')
    .matches(phoneRegExp, 'Phone number is not valid')
    .trim(),
})

export const deleteCustomerValidationSchema = Yup.object().shape({
  isSure: Yup.boolean().label('Are you sure').required().oneOf([true], 'Field must be checked'),
})

export const signInValidationSchema = Yup.object().shape<{ email: string }>({
  email: Yup.string().label('Email').required().email().trim(),
})
