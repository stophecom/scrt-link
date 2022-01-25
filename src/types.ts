import { NextPage } from 'next'
import { ComponentType } from 'react'

export type CustomPage<P = Record<string, unknown>> = NextPage<P> & {
  layout?: ComponentType
}

export type Maybe<T> = T | undefined | null

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: any
    }
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_ENV: string
      DB: string
      AES_KEY_512: string
      MJ_APIKEY_PUBLIC: string
      MJ_APIKEY_PRIVATE: string
      MJ_SMS_TOKEN: string
      JWT_SECRET: string
      NEXT_AUTH_SECRET: string
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
      STRIPE_SECRET_KEY: string
      STRIPE_WEBHOOK_SECRET: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      SLACK_APP_API_URL: string
      SLACK_APP_API_KEY: string
    }
  }
}

export interface SignIn {
  email: string
}

// Api Responses
export type SecretPost = Maybe<{
  alias: string
  message: string
}>

export {}
