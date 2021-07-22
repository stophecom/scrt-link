import { AES, enc } from 'crypto-js'

export const encodeStringsForDB = <T>(obj: T = {} as T): Record<string, T[keyof T]> => {
  const result = {} as Record<string, T[keyof T]>
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = typeof value === 'string' ? encodeURIComponent(value.trim()) : value
  })
  return result
}

export const decodeStringsFromDB = <T>(obj: T = {} as T): Record<string, T[keyof T]> => {
  const result = {} as Record<string, T[keyof T]>
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = typeof value === 'string' ? decodeURIComponent(value) : value
  })
  return result
}

// Encrypt sensitive information
export const encryptAES = (string: string) =>
  AES.encrypt(string, `${process.env.AES_KEY_512}`).toString()

// Decrypt message
export const decryptAES = (string: string) => {
  const bytes = AES.decrypt(string, `${process.env.AES_KEY_512}`)
  return bytes.toString(enc.Utf8)
}
