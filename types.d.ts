import type { DefaultUser } from 'next-auth'

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}

declare module '*.jpg' {
  const content: any
  export default content
}

declare module '*.webp' {
  const content: any
  export default content
}

declare module '*.md'

declare module 'yup/lib/locale'

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
      FLOW_S3_ENDPOINT: string
      NEXT_PUBLIC_FLOW_S3_BUCKET: string
      FLOW_S3_ACCESS_KEY: string
      FLOW_S3_SECRET_KEY: string
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
