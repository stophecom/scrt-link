import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { CustomError } from '@/api/utils/createError'
import * as Sentry from '@sentry/node'

// https://github.com/zeit/micro#error-handling
const handleErrors = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return await fn(req, res)
  } catch (err) {
    Sentry.captureException(err)

    let statusCode = 500
    let message = 'Oops, something went wrong!'
    let i18nErrorKey

    if (err instanceof CustomError) {
      statusCode = err.statusCode || statusCode
      message = err.message || message
      i18nErrorKey = err.i18nErrorKey
    }

    res.status(statusCode).json({ statusCode, message, i18nErrorKey })
  }
}

export default handleErrors
