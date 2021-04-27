import { BetaInvite } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxMessageLength } from '@/constants'

import { UserSettingsFields } from '@/api/models/UserSettings'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const secretTypes = ['message' as SecretType, 'url' as SecretType, 'neogram' as SecretType]

const messageValidation = {
  message: Yup.string().label('Message').required().min(1).max(maxMessageLength).trim(),
}

const passwordValidation = {
  password: Yup.string().label('Password').required().min(5).max(50).trim(),
}

const typeValidation = {
  secretType: Yup.mixed<SecretType>().oneOf(secretTypes),
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
  neogram: messageValidation,
}

type SecretFormInput = Pick<SecretUrlFields, 'secretType' | 'message'> & { password?: string }
export const getValidationSchemaByType = (secretType: SecretType, hasPassword = false) =>
  Yup.object().shape<SecretFormInput>({
    ...schemataMap[secretType],
    ...(hasPassword ? passwordValidation : {}),
    ...typeValidation,
  })

export const apiValidationSchemaByType = Yup.object().shape<SecretFormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = Yup.object().shape<{ password: string }>(passwordValidation)

export const betaInviteValidationSchema = Yup.object().shape<BetaInvite>({
  name: Yup.string().label('Name').max(200).trim(),
  email: Yup.string().label('Email').required().email().trim(),
})

export const userSettingsValidationSchema = Yup.object().shape<Partial<UserSettingsFields>>({
  name: Yup.string().label('Name').max(200).trim(),
  neogramDestructionMessage: Yup.string().label('Destruction message').max(200).trim(),
  neogramDestructionTimeout: Yup.number().label('Destruction timeout').max(30),
  isReadReceiptsViaEmailEnabled: Yup.boolean().label('Read receipts via email'),
  isReadReceiptsViaPhoneEnabled: Yup.boolean().label('Is sender name visible'),
  isSenderNameVisible: Yup.boolean().label('Read receipts via phone'),
  receiptEmail: Yup.string().label('Email').email().max(200).trim(),
  receiptPhoneNumber: Yup.string()
    .label('Phone')
    .matches(phoneRegExp, 'Phone number is not valid')
    .max(30)
    .trim(),
})

export const signInValidationSchema = Yup.object().shape<BetaInvite>({
  email: Yup.string().label('Email').required().email().trim(),
})
