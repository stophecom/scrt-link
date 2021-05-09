import { NextApiHandler, NextApiRequest } from 'next'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { userSettingsValidationSchema } from '@/utils/validationSchemas'
import { encodeStringsForDB, decodeStringsFromDB } from '@/utils/db'

import { getSession } from 'next-auth/client'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await userSettingsValidationSchema.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  return encodeStringsForDB(req.body)
}

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  const session = await getSession({ req })

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }
  if (!session) {
    throw createError(405, 'Not allowed')
  }

  switch (req.method) {
    case 'GET': {
      const userSettings = await models.UserSettings.findOne({
        userId: session.userId || '',
      })

      const stats = await models.Stats.findOne({
        userId: session.userId || '',
      }).lean()

      res.json({
        userSettings: decodeStringsFromDB(userSettings?.toJSON()),
        stats,
        session,
      })
      break
    }
    case 'POST':
      const data = await extractPostInput(req)

      const userId = session.userId || ''
      const userSettings = await models.UserSettings.findOneAndUpdate({ userId }, data, {
        upsert: true,
        new: true,
      })

      res.json({ data: userSettings.toJSON(), message: 'Your settings have been saved!' })
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
