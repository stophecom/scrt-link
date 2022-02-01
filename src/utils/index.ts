import { Role } from '@/api/models/Customer'
import { limits, baseUrl } from '@/constants'

export const sanitizeUrl = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

// Vercel preview links don't include host.
export const getBaseURL = () => sanitizeUrl(baseUrl)

export const shortenString = (str: string, length: number) => {
  const threshold = length + 3
  return str.length > threshold ? `${str.substring(0, length)}…` : str
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

export const formatBytes = (bytes: number, decimals?: number) => {
  if (bytes == 0) return '0 Bytes'
  let k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
