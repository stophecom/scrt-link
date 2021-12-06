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

export const t = i18next.getFixedT('en')
