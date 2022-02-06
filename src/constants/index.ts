export const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development'
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
export const isPreview = process.env.NEXT_PUBLIC_ENV === 'preview'

// See next-i18next.config
export const defaultLanguage = 'en'
export const supportedLanguages = ['en', 'de'] as const
export type SupportedLanguage = typeof supportedLanguages[number]

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
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
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
  readReceipt: {
    en: { templateId: 2818166, subject: 'Secret has been viewed 🔥' },
    de: { templateId: 3400579, subject: 'Geheimnis zerstört 🔥' },
  },
  youGotSecret: {
    en: {
      templateId: 2939535,
      subject: 'You received a secret',
    },
    de: {
      templateId: 3400595,
      subject: 'Du hast ein Geheimnis erhalten',
    },
  },
}
// Twilio SMS templates
export const smsReadReceipt = {
  en: {
    receipt: 'scrt.link: The following secret has been viewed and destroyed🔥:',
    reply: 'Reply with a secret: https://scrt.link',
  },
  de: {
    receipt: 'scrt.link: Das folgende Geheimnis wurde gelesen und zerstört🔥:',
    reply: 'Antworte mit einem Geheimnis: https://scrt.link',
  },
}

const MB = 10 ** 6 // 1000000 Bytes = 1 MB.

// Limits per user role
export const limits = {
  visitor: {
    maxMessageLength: 280,
    maxFileSize: 10 * MB,
  },
  free: {
    maxMessageLength: 1000,
    maxFileSize: 100 * MB,
  },
  premium: {
    maxMessageLength: 100000,
    maxFileSize: 1000 * MB, // 1GB
  },
}
