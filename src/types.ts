export type Maybe<T> = T | undefined | null

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_SHORT_URL: string
      NEXT_PUBLIC_ENV: string
      DB: string
      AES_KEY_512: string
      MJ_APIKEY_PUBLIC: string
      MJ_APIKEY_PRIVATE: string
      NEXTAUTH_URL: string
      JWT_SECRET: string
      NEXT_AUTH_SECRET: string
      NEXT_PUBLIC_PUSHER_APP_KEY: string
      NEXT_PUBLIC_PUSHER_CLUSTER: string
      PUSHER_SECRET: string
      PUSHER_APP_ID: string
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

export interface BetaInvite {
  name?: string
  email: string
}

export interface SignIn {
  email: string
}

export interface UserSettings {
  name?: string
  neogramDestructionMessage?: string
  isReadReceiptsEnabled?: boolean
}

export {}
