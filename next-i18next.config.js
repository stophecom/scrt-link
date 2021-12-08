const path = require('path')

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  ...(isProduction ? { localePath: path.resolve('./public/locales') } : {}), // Needs to be set for production
}
