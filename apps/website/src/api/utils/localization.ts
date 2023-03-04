import i18next from 'i18next'
import path from 'path'

i18next.init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: path.resolve('./public/locales/en/common.json'),
    },
  },
})

// Need to add translation resources before we can use this.
export const fixedT = (locale = 'en') => i18next.getFixedT(locale)

export const t = i18next.getFixedT('en')
