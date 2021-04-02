import { NextApiRequest, NextApiResponse } from 'next'

type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  result: (result: NextApiResponse) => void,
) => void

const initMiddleware = (middleware: Middleware) => {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export default initMiddleware
