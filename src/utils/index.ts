import { parse } from 'uri-js'
import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'
import { AES, enc } from 'crypto-js'
import { sha256 } from 'js-sha256'

import { Role } from '@/api/models/Customer'
import { limits } from '@/constants'

// https://stackoverflow.com/a/19709846
export const sanitizeUrl = (url: string) => {
  if (url.startsWith('//')) {
    return url
  }

  const uri = parse(url)
  return uri.scheme ? url : `https://${url}`
}

export const shortenString = (str: string, length: number) => {
  const threshold = length + 3
  return str.length > threshold ? `${str.substring(0, length)}…` : str
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

export const getLimits = (role: Role = 'free') => limits[role]

export const abbrNum = (number: number, decPlaces: number) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces)

  // Enumerate number abbreviations
  const abbrev = ['k', 'm', 'b', 't']
  let abbrNum = ''

  // Go through the array backwards, so we do the largest first
  for (let i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    const size = Math.pow(10, (i + 1) * 3)

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces

      // Handle special case where we round up to the next abbreviation
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1
        i++
      }

      // Add the letter for the abbreviation
      abbrNum = `${number}${abbrev[i]}`

      // We are done... stop
      break
    }
  }

  return abbrNum
}
