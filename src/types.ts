export type Maybe<T> = T | undefined | null

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_ENV: string
      DB: string
      AES_KEY_512: string
      MJ_APIKEY_PUBLIC: string
      MJ_APIKEY_PRIVATE: string
      MJ_SMS_TOKEN: string
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

export interface BetaInvite {
  name?: string
  email: string
}

export interface SignIn {
  email: string
}

export {}
