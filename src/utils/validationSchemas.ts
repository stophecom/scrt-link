import { BetaInvite } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxMessageLength } from '@/constants'

import { UserSettingsFields, ReadReceipts } from '@/api/models/UserSettings'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const secretTypes = ['message' as SecretType, 'url' as SecretType, 'neogram' as SecretType]
const readReceipts = ['none' as ReadReceipts, 'sms' as ReadReceipts, 'email' as ReadReceipts]

const messageValidation = {
  message: Yup.string().label('Message').required().min(1).max(maxMessageLength).trim(),
}
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

const schemataMap = {
  url: urlValidation,
  message: messageValidation,
  neogram: {
    ...messageValidation,
    ...neogramDestructionMessageValidation,
    ...neogramDestructionTimeoutValidation,
  },
}

type SecretFormInput = Pick<SecretUrlFields, 'secretType' | 'message'> & { password?: string }
export const getValidationSchemaByType = (secretType: SecretType, hasPassword = false) =>
  Yup.object().shape<SecretFormInput>({
    ...schemataMap[secretType],
    ...(hasPassword
      ? {
          password: Yup.string().label('Password').min(5).max(50).trim(),
        }
      : {}),
    ...typeValidation,
  })

export const apiValidationSchemaByType = Yup.object().shape<SecretFormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = Yup.object().shape<{ password: string }>({
  password: Yup.string().label('Password').required().min(5).max(50).trim(),
})

export const betaInviteValidationSchema = Yup.object().shape<BetaInvite>({
  name: Yup.string().label('Name').max(200).trim(),
  email: Yup.string().label('Email').required().email().trim(),
})

export const userSettingsValidationSchema = Yup.object().shape<Partial<UserSettingsFields>>({
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

export const signInValidationSchema = Yup.object().shape<BetaInvite>({
  email: Yup.string().label('Email').required().email().trim(),
})
