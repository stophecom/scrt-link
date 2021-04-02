import { parse } from 'uri-js'

export const isServer = () => {
  return typeof window === 'undefined'
}

// https://stackoverflow.com/a/19709846
export const sanitizeUrl = (url: string) => {
  if (url.startsWith('//')) {
    return url
  }

  const uri = parse(url)
  return uri.scheme ? url : `https://${url}`
}
