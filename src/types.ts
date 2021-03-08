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
export interface ShortUrlInput {
  url?: string
  customAlias?: string
  message?: string
}

export {}
