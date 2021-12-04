import { NextApiRequest } from 'next'
import { pick } from 'accept-language-parser'
import { supportedLanguages, SupportedLanguage } from '@/constants'

export const getLocaleFromRequest = (req: NextApiRequest): SupportedLanguage => {
  const languageBasedOnHeader = pick(
    supportedLanguages as any as string[],
    req?.headers['accept-language'] || '',
    {
      loose: true,
    },
  )

  return (req?.cookies?.NEXT_LOCALE || languageBasedOnHeader || 'en') as SupportedLanguage
}
