import { NextApiHandler } from 'next'
import { pick } from 'ramda'

import withDb from '@/api/middlewares/withDb'
import withServerSentEvents from '@/api/middlewares/withServerSentEvents'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  const getStats = async () => {
    const stats = await models.Stats.findOne()

    if (!stats) {
      throw createError(500, 'Internal server error! Could not find statistics data.')
    }

    const response = pick(['totalSecretsCount', 'secretsCount'])(stats)
    return response
  }

  switch (req.method) {
    case 'GET':
      res.sendEventStreamData(await getStats())

      const interval = setInterval(async () => {
        res.sendEventStreamData(await getStats())
      }, 3000)

      res.on('close', () => {
        clearInterval(interval)
        res.end()
      })

      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(withServerSentEvents(handler)))
