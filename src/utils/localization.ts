import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import path from 'path'
import Backend from 'i18next-fs-backend'

import { supportedLanguages } from '@/constants'

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('us-EN', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
  }).format(amount)

export const formatNumber = (amount: number) => new Intl.NumberFormat('us-EN').format(amount)

export const dateFromTimestamp = (timestamp?: number | null) => {
  if (typeof timestamp !== 'number') {
    return
  }
  const milliseconds = timestamp * 1000
  const dateObject = new Date(milliseconds)

  return new Intl.DateTimeFormat('en-US').format(dateObject)
}

export const getI18nConfig = () => ({
  i18n: {
    defaultLocale: 'en',
    locales: [...supportedLanguages],
  },
  ns: ['common'],
  supportedLngs: supportedLanguages,
  nonExplicitSupportedLngs: true,
  initImmediate: false,
  use: [Backend],

  backend: {
    loadPath: path.resolve('./public/locales/{{lng}}/{{ns}}.json'),
    // path to post missing resources
    addPath: path.resolve('./public/locales/{{lng}}/{{ns}}.json'),
  },
  returnObjects: true,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  debug: false, //process.env.NODE_ENV === 'development',

  // Save missing keys
  // fallbackLng: false as any as string, //'en',
  // saveMissing: true,
  // saveMissingTo: 'all' as 'all',
  // lng: locale,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  localePath: path.resolve('./public/locales'),
})

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], getI18nConfig())),
    },
  }
}
