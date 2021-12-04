export const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development'
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
export const isPreview = process.env.NEXT_PUBLIC_ENV === 'preview'

export const supportedLanguages = ['en', 'de']
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
export const shortUrl = 'https://scrt.li' // Currently not used

// Form defaults
export const emailPlaceholder = 'example@gmail.com'
export const neogramDestructionTimeoutDefault = 3

export const chromeExtensionLink =
  'https://chrome.google.com/webstore/detail/scrtlink-share-a-secret/gkpenncdoafjgnphhnmoiocbfbojggip'
export const firefoxExtensionLink = 'https://addons.mozilla.org/en-US/firefox/addon/scrt-link'
export const microsoftEdgeExtensionLink =
  'https://microsoftedge.microsoft.com/addons/detail/scrtlink-share-a-secre/ijchnpicofdgjjnedmdnhodglbnfmgih'
export const slackAppInstallLink = 'https://slack.scrt.link/slack/install'

// Mailjet templates
export const mailjetTemplates = {
  signInRequest: {
    en: { templateId: 2715593, subject: 'Sign in request' },
    de: { templateId: 3400460, subject: 'Konto-Anmeldung' },
  },
}

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
