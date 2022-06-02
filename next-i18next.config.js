const path = require('path')

// Global languages configuration
const defaultLanguage = 'en'
const supportedLanguagesMap = {
  en: 'English',
  de: 'Deutsch',
  it: 'Italian',
  fr: 'Français',
  pl: 'Polski',
}
const supportedLanguages = Object.keys(supportedLanguagesMap)

module.exports = {
  supportedLanguagesMap,
  i18n: {
    defaultLocale: defaultLanguage,
    locales: supportedLanguages,
  },
  localePath: path.resolve('./public/locales'),
}
