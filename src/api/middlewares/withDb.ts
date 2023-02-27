import '@/types'
import mongoose from 'mongoose'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Maybe } from '@/types'

import models from '../models'
declare module 'http' {
  interface IncomingMessage {
    models: Maybe<typeof models>
  }
}

const readyStates = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
}

if (!process.env.DB) {
  throw new Error('Please add your Mongo URI to .env')
}

let pendingPromise: Maybe<Promise<typeof mongoose>> = null

// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const withDb = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const next = () => {
    req.models = models
    return fn(req, res)
  }

  const { readyState } = mongoose.connection

  // If already connected don't create new connection
  if (readyState === readyStates.connected) {
    return next()
  }

  // @todo Use pem certificate here
  pendingPromise = mongoose.connect(process.env.DB, {
    ssl: true,
    retryWrites: true,
    tlsCAFile: `${process.cwd()}/ca-certificate.pem`,
  })

  try {
    await pendingPromise
  } catch (error) {
    console.error(error)
  } finally {
    pendingPromise = null
  }

  // We need to return "next" from "withDb". Otherwise, if it wraps an async function,
  // the wrapper function of "withDb" (like "handleErrors" etc)
  // can't wait and catch errors inside it the function wrapped by "withDb".
  // It just waits for "withDb" to complete and continues.
  // As an alternative, we can "await" this "next" too of course.
  // Main point is, waiting it to be completed.
  return next()
}

export default withDb
