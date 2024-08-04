import { i18n, supportedLanguagesMap } from 'next-i18next.config'

export const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development'
export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
export const isPreview = process.env.NEXT_PUBLIC_ENV === 'preview'

// See next-i18next.config
export { supportedLanguagesMap }
export const defaultLanguage = i18n.defaultLocale
export const supportedLanguages = Object.keys(supportedLanguagesMap)
export type SupportedLanguage = keyof typeof supportedLanguagesMap

export const appTitle = 'scrt.link'

export const twitterLink = 'https://x.com/ScrtLink'
export const twitterHandle = '@ScrtLink'
export const email = 'shhh@scrt.link'
export const emailSupport = 'support@scrt.link'
export const emailSantihans = 'info@santihans.com'
export const repositoryUrl = 'https://github.com/stophecom/scrt-link'
export const baseUrl = isProduction
  ? 'https://scrt.link'
  : process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'
export const emojiShortUrl = 'https://🤫.st'
export const shortUrl = 'https://scrt.li' // Currently not used

export const blogUrl = 'https://blog.stophe.com'
export const uptimerobotUrl = 'https://stats.uptimerobot.com/v5yqDuEr5z'
export const placeholderName = 'XY'

export const freePlanName = 'Confidential'
export const premiumPlanName = 'Secret'
export const enterprisePlanName = 'Top Secret'

// Form defaults
export const emailPlaceholder = 'example@gmail.com'
export const ntfyPlaceholder = 'scrt_test_xyz123'
export const neogramDestructionTimeoutDefault = 3

// Mailjet templates
export const mailjetTemplates = {
  signInRequest: {
    en: { templateId: 2715593, subject: 'Sign in request' },
    de: { templateId: 3400460, subject: 'Konto-Anmeldung' },
    fr: { templateId: 3970462, subject: 'Connexion au compte' },
    sr: { templateId: 2715593, subject: 'Sign in request' }, // Todo
    pl: { templateId: 2715593, subject: 'Sign in request' }, // Todo
    it: { templateId: 2715593, subject: 'Sign in request' }, // Todo
  },
  readReceipt: {
    en: { templateId: 2818166, subject: 'Secret has been viewed 🔥' },
    de: { templateId: 3400579, subject: 'Geheimnis zerstört 🔥' },
    fr: { templateId: 3970465, subject: 'Secret détruit 🔥' },
    sr: { templateId: 2818166, subject: 'Secret has been viewed 🔥' }, // Todo
    pl: { templateId: 2818166, subject: 'Secret has been viewed 🔥' }, // Todo
    it: { templateId: 2818166, subject: 'Secret has been viewed 🔥' }, // Todo
  },
}
// Ntfy templates
export const ntfyTemplates = {
  readReceipt: {
    en: {
      subject: 'Secret has been viewed',
      receipt: 'The following secret has been viewed and destroyed:',
    },
    de: {
      subject: 'Geheimnis zerstört',
      receipt: 'Das folgende Geheimnis wurde gelesen und zerstört:',
    },
    fr: {
      subject: 'Secret détruit',
      receipt: 'Le secret suivant a été lu et détruit:',
    },
    sr: {
      // TODO
      subject: 'Secret has been viewed',
      receipt: 'The following secret has been viewed and destroyed:',
    },
  },
}

export const MB = 10 ** 6 // 1000000 Bytes = 1 MB.

// Limits per user role
export const limits = {
  visitor: {
    maxMessageLength: 140,
    maxFileSize: 1 * MB,
  },
  free: {
    maxMessageLength: 280,
    maxFileSize: 10 * MB,
  },
  premium: {
    maxMessageLength: 100000,
    maxFileSize: 1000 * MB,
  },
}
