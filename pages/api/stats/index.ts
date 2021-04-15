import { NextApiHandler } from 'next'
import { pick } from 'ramda'
import Pusher from 'pusher'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { pusherCluster } from '@/constants'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: pusherCluster,
  useTLS: true,
})

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

    return pick(['totalSecretsCount', 'secretsCount', 'totalSecretsViewCount'])(stats)
  }

  switch (req.method) {
    case 'POST':
      models.Stats.watch().on('change', async (data) => {
        const updatedStats = await getStats()
        pusher.trigger('stats', 'stats-update', updatedStats)
      })

      res.json(await getStats())

      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
