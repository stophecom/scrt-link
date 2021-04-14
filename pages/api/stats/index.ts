import { NextApiHandler } from 'next'
import { pick } from 'ramda'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  switch (req.method) {
    case 'GET':
      const stats = await models.Stats.findOne()

      if (!stats) {
        throw createError(500, 'Internal server error! Could not find statistics data.')
      }

      const response = pick(['totalSecretsCount', 'secretsCount'])(stats)

      res.json(response)
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
