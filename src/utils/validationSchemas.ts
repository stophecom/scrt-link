import { FormInput, Password, SecretType, BetaInvite } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxMessageLength } from '@/constants'

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

export const getValidationSchemaByType = (secretType: SecretType, hasPassword = false) =>
  Yup.object().shape<FormInput>({
    ...schemataMap[secretType],
    ...(hasPassword ? passwordValidation : {}),
    ...typeValidation,
  })

export const apiValidationSchemaByType = Yup.object().shape<FormInput>({
  message: Yup.string().label('Message').required().trim(),
  ...typeValidation,
})

export const passwordValidationSchema = Yup.object().shape<Password>(passwordValidation)

export const betaInviteValidationSchema = Yup.object().shape<BetaInvite>({
  name: Yup.string().label('Name').max(200).trim(),
  email: Yup.string().label('Email').required().email().trim(),
})
