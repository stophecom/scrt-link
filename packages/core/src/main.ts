import { reject, is, isNil } from 'ramda'
import { baseUrl as defaultBaseUrl } from './constants'
import { encryptMessage, decryptMessage, generateAlias, generateEncryptionKey, api } from './utils'
import { CreateSecretOptions, SecretUrlFields } from './types'

export type CreateSecret = (
  message: string,
  options?: CreateSecretOptions,
  baseUrl?: string,
) => Promise<{
  alias: string
  encryptionKey: string
  secretLink: string
}>

export const createSecret: CreateSecret = async (
  message,
  options = {},
  baseUrl = defaultBaseUrl,
) => {
  const {
    alias = generateAlias(),
    encryptionKey = generateEncryptionKey(),
    password,
    secretType = 'text',
    neogramDestructionMessage = 'This message will self-destruct in…',
    neogramDestructionTimeout = 3,
    receiptApi,
    receiptEmail,
    receiptPhoneNumber,
  } = options

  if (password && is(String, password)) {
    message = encryptMessage(message, password)
  }

  // Default encryption
  message = encryptMessage(message, encryptionKey)

  const data = {
    alias,
    message,
    secretType,
    isEncryptedWithUserPassword: !!password,
    ...(secretType === 'neogram'
      ? {
          neogramDestructionMessage,
          neogramDestructionTimeout,
        }
      : {}),
    receiptApi,
    receiptEmail,
    receiptPhoneNumber,
  }

  return api(`${baseUrl}/api/secrets`, { method: 'POST' }, reject(isNil, data)).then(() => ({
    alias,
    encryptionKey,
    secretLink: `${baseUrl}/l#${alias}/${encryptionKey}`,
  }))
}

export type RetrieveSecret = (
  alias: string,
  decryptionKey: string,
  baseUrl?: string,
) => Promise<Partial<SecretUrlFields>>

export const retrieveSecret: RetrieveSecret = async (
  alias,
  decryptionKey,
  baseUrl = defaultBaseUrl,
) => {
  const secretRaw = await api<Partial<SecretUrlFields>>(`${baseUrl}/api/secrets/${alias}`, {
    method: 'DELETE',
  })

  if (!secretRaw.message) {
    throw new Error(`Couldn't retrieve secret message.`)
  }

  const result = decryptMessage(secretRaw.message, decryptionKey)
  if (!result) {
    throw new Error('Decryption failed.')
  }

  return { ...secretRaw, message: result }
}

const ScrtLink = {
  createSecret,
  retrieveSecret,
  encryptMessage,
  decryptMessage,
  generateAlias,
  generateEncryptionKey,
}

export { encryptMessage, decryptMessage, generateAlias, generateEncryptionKey }

export default ScrtLink
