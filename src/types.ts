export type Maybe<T> = T | undefined | null

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_SHORT_URL: string
      NEXT_PUBLIC_ENV: string
      DB: string
      AES_KEY_512: string
    }
  }
}

export type SecretType = 'message' | 'url' | 'neogram'

export interface Password {
  password?: string
}

export interface MessageInput extends Password {
  message: string
}

export interface FormInput extends MessageInput {
  secretType: SecretType
}

export {}
