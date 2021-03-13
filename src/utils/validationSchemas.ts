import { FormInput, Password, SecretType } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxCustomAliasLength, maxMessageLength } from '@/constants'

const secretTypes = ['message' as SecretType, 'url' as SecretType]

const messageValidation = {
  message: Yup.string().label('Message').required().min(1).max(maxMessageLength).trim(),
}

const passwordValidation = {
  password: Yup.string().required().label('Password').min(1).max(50).trim(),
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
  customAlias: Yup.string().label('Custom Alias').max(maxCustomAliasLength).trim(),
}

const schemataMap = {
  url: urlValidation,
  message: messageValidation,
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
