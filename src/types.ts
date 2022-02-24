import { NextPage } from 'next'
import { ComponentType } from 'react'

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
