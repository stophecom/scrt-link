export const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development'
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
export const isPreview = process.env.NEXT_PUBLIC_ENV === 'preview'
export const appTitle = 'scrt.link'
export const trialPeriod = 5
export const twilioSenderPhoneNumber = '+17744694525'

export const twitterLink = 'https://twitter.com/ScrtLink'
export const twitterHandle = '@ScrtLink'
export const emailEmoji = 'x@🤫.st'
export const email = 'shhh@scrt.link'
export const emailSupport = 'support@scrt.link'
export const emailSantihans = 'info@santihans.com'
export const gitlab = 'https://gitlab.com/kingchiller'
export const baseUrl = process?.env?.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
export const emojiShortUrl = 'https://🤫.st'
export const shortUrl = 'https://scrt.li'

// Form defaults
export const emailPlaceholder = 'example@gmail.com'
export const neogramDestructionMessageDefault = 'This message will self-destruct in…'
export const neogramDestructionTimeoutDefault = 3

export const chromeExtensionLink =
  'https://chrome.google.com/webstore/detail/scrtlink-share-a-secret/gkpenncdoafjgnphhnmoiocbfbojggip'
export const firefoxExtensionLink = 'https://addons.mozilla.org/en-US/firefox/addon/scrt-link'
export const microsoftEdgeExtensionLink =
  'https://microsoftedge.microsoft.com/addons/detail/scrtlink-share-a-secre/ijchnpicofdgjjnedmdnhodglbnfmgih'

// Limits per user role
export const limits = {
  visitor: {
    maxMessageLength: 280,
  },
  free: {
    maxMessageLength: 1000,
  },
  premium: {
    maxMessageLength: 100000,
  },
}
