export type Maybe<T> = T | undefined | null

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      DB: string
    }
  }
}

export type SecretType = 'message' | 'url'

export interface Password {
  password?: string
}

export interface MessageInput extends Password {
  message: string
}

export interface FormInput extends MessageInput {
  secretType: SecretType
  customAlias?: string
}

export {}
