const path = require('path')

// Global languages configuration
// Make sure to update setYupLocale for localized form validation
const defaultLanguage = 'en'
const supportedLanguagesMap = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  sr: 'Serbian',
  // it: 'Italian',
  // pl: 'Polski',
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
