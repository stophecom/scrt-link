import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

declare module 'http' {
  interface OutgoingMessage {
    sendEventStreamData: <T>(data: T) => void
  }
}

const withServerSentEvents = <T>(fn: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Content-Encoding', 'none')

  res.flushHeaders()

  const sendEventStreamData = (data: T) => {
    const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`
    res.write(sseFormattedResponse)
  }

  // we are attaching sendEventStreamData to res, so we can use it later
  Object.assign(res, {
    sendEventStreamData,
  })

  return fn(req, res)
}

export default withServerSentEvents
