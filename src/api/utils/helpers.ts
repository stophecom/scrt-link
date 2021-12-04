import { NextApiRequest } from 'next'
import { pick } from 'accept-language-parser'

import { supportedLanguages } from '@/constants'

export const getLocaleFromRequest = (req: NextApiRequest): string => {
  const languageBasedOnHeader = pick(supportedLanguages, req?.headers['accept-language'] || '', {
    loose: true,
  })

  return req?.cookies?.NEXT_LOCALE || languageBasedOnHeader || 'en'
}
