import { ShortUrlInput, SecretType } from '@/types'
import * as Yup from 'yup'
import validator from 'validator'
import { maxCustomAliasLength, maxMessageLength } from '@/constants'

const messageValidationSchema = {
  message: Yup.string().label('Message').required().min(1).max(maxMessageLength).trim(),
}

const urlValidationSchema = {
  url: Yup.string()
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
  url: urlValidationSchema,
  message: messageValidationSchema,
}

export const getValidationSchemaByType = (type: SecretType, hasPassword = false) =>
  Yup.object().shape<ShortUrlInput>({
    ...schemataMap[type],
    ...(hasPassword
      ? { password: Yup.string().required().label('Password').min(5).max(50).trim() }
      : {}),
  })

// Todo: This is used to validate data from db currently. Maybe refactor this.
export const shortUrlInputValidationSchema = Yup.object().shape<ShortUrlInput>({
  url: Yup.string()
    .label('URL')
    .test(
      'is-url',
      ({ label }) => `${label} does not have a valid URL format`,
      (value) => (value ? validator.isURL(value) : true),
    )
    .trim(),
  message: Yup.string().label('Message').max(maxMessageLength).trim(),
  customAlias: Yup.string().label('Custom Alias').max(maxCustomAliasLength).trim(),
})
