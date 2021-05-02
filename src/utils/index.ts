import { parse } from 'uri-js'
import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'
import { AES, enc } from 'crypto-js'
import { sha256 } from 'js-sha256'

// https://stackoverflow.com/a/19709846
export const sanitizeUrl = (url: string) => {
  if (url.startsWith('//')) {
    return url
  }

  const uri = parse(url)
  return uri.scheme ? url : `https://${url}`
}

export const generateNanoId = (length: number) => {
  const nanoid = customAlphabet(nolookalikes, length)
  return nanoid()
}

export const encryptMessage = (message: string, encryptionKey: string) => {
  const hash = sha256(encryptionKey)
  return AES.encrypt(message, hash).toString()
}

export const decryptMessage = (message: string, decryptionKey: string) => {
  const hash = sha256(decryptionKey)
  const bytes = AES.decrypt(message, hash)
  return bytes.toString(enc.Utf8)
}
