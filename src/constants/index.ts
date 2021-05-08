import { sanitizeUrl } from '@/utils/index'

export const appTitle = 'scrt.link'
export const urlAliasLength = 12
export const encryptionKeyLength = 14

export const twitterLink = 'https://twitter.com/ScrtLink'
export const twitterHandle = '@ScrtLink'
export const emailEmoji = 'x@🤫.st'
export const email = 'shhh@scrt.link'
export const emailSantihans = 'info@santihans.com'
export const gitlab = 'https://gitlab.com/kingchiller'
export const baseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)
export const pusherCluster = 'eu'
export const emojiShortUrl = 'https://🤫.st'
export const shortUrl = 'https://scrt.li'

// Limits
export const getMaxMessageLength = (hasAccount: boolean) => (hasAccount ? 10000 : 280)
