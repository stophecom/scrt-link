export type SecretType = 'text' | 'url' | 'neogram' | 'file'

export interface CreateSecretOptions {
  alias?: string
  secretType?: SecretType
  encryptionKey?: string
  neogramDestructionMessage?: string
  neogramDestructionTimeout?: number
  password?: string
  receiptEmail?: string
  receiptPhoneNumber?: string
  receiptApi?: Record<string, unknown>
}

export type SecretUrlFields = Omit<CreateSecretOptions, 'encryptionKey' | 'password'> & {
  message: string
  isEncryptedWithUserPassword: boolean
}
