import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { getBaseURL } from '@/utils'
import { defaultLanguage } from '@/constants'

export const getAbsoluteLocalizedUrl = (pathname: string, locale = 'en') =>
  `${getBaseURL()}${locale === defaultLanguage ? '' : `/${locale}`}${pathname}`

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 2,
) =>
  new Intl.NumberFormat('us-EN', {
    style: 'currency',
    currency,
    signDisplay: 'never',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits,
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

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
