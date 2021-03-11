import { FormInput, Password, SecretType } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxCustomAliasLength, maxMessageLength } from '@/constants'

const messageValidation = {
  message: Yup.string().label('Message').required().min(1).max(maxMessageLength).trim(),
}

const passwordValidation = {
  password: Yup.string().required().label('Password').min(5).max(50).trim(),
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

export const getValidationSchemaByType = (type: SecretType, hasPassword = false) =>
  Yup.object().shape<FormInput>({
    ...schemataMap[type],
    ...(hasPassword ? passwordValidation : {}),
  })

export const passwordValidationSchema = Yup.object().shape<Password>(passwordValidation)
