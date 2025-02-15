import { NextPage } from 'next'
import { ComponentType } from 'react'
import type { DefaultUser } from 'next-auth'
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: any
    }
    interface ProcessEnv {
      NEXT_PUBLIC_ENV: string
      DB: string
      AES_KEY_512: string
      MJ_APIKEY_PUBLIC: string
      MJ_APIKEY_PRIVATE: string
      JWT_SECRET: string
      NEXT_AUTH_SECRET: string
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
      STRIPE_SECRET_KEY: string
      STRIPE_WEBHOOK_SECRET: string
      SLACK_APP_API_URL: string
      SLACK_APP_API_KEY: string
      FLOW_S3_ENDPOINT: string
      NEXT_PUBLIC_FLOW_S3_BUCKET: string
      FLOW_S3_ACCESS_KEY: string
      FLOW_S3_SECRET_KEY: string
      TOLGEE_API_KEY: string
    }
  }
}

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string
    }
  }
}

export type CustomPage<P = Record<string, unknown>> = NextPage<P> & {
  layout?: ComponentType
}

export type Maybe<T> = T | undefined | null

export interface SignIn {
  name?: string
  email: string
}

// Api Responses
export type SecretPost = Maybe<{
  alias: string
  message: string
}>

export {}
