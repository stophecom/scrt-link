import { AES, enc, SHA256 } from 'crypto-js'
import { nanoid } from 'nanoid'

import { urlAliasLength, encryptionKeyLength } from './constants'

export async function api<T>(
  url: RequestInfo,
  options?: RequestInit,
  data?: Record<string, unknown> | null,
): Promise<T> {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
    ...(data ? { body: JSON.stringify(data) } : {}), // body data type must match "Content-Type" header
  })

  if (!response.ok) {
    const errorResponse = await response.json()
    throw errorResponse
  }

  return response.json() as Promise<T>
}

const createHash = (key: string): string => enc.Base64.stringify(SHA256(key))

type EncryptMessage = (message: string, encryptionKey: string) => string
export const encryptMessage: EncryptMessage = (message, encryptionKey) => {
  const hash = createHash(encryptionKey)
  return AES.encrypt(message, hash).toString()
}

type DecryptMessage = (message: string, decryptionKey: string) => string
export const decryptMessage: DecryptMessage = (message, decryptionKey) => {
  const hash = createHash(decryptionKey)
  const bytes = AES.decrypt(message, hash)
  return bytes.toString(enc.Utf8)
}

export const generateNanoId = (length: number): string => nanoid(length)
export const generateAlias = (): string => generateNanoId(urlAliasLength)
export const generateEncryptionKey = (): string => generateNanoId(encryptionKeyLength)
