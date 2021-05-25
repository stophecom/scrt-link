import { NextApiHandler, NextApiRequest } from 'next'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { customerValidationSchema } from '@/utils/validationSchemas'
import { encodeStringsForDB, decodeStringsFromDB } from '@/utils/db'

import { getSession } from 'next-auth/client'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await customerValidationSchema.validate(req.body)
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
    throw createError(405, 'Not allowed. You need to be signed in!')
  }

  switch (req.method) {
    case 'GET': {
      const customer = await models.Customer.findOne({
        userId: session.userId || '',
      })

      res.json({
        ...decodeStringsFromDB(customer?.toJSON()),
      })
      break
    }
    case 'POST':
      const data = await extractPostInput(req)

      const userId = session.userId || ''
      const customer = await models.Customer.findOneAndUpdate({ userId }, data, {
        upsert: true,
        new: true,
      })

      res.json({ data: customer.toJSON(), message: 'Your settings have been saved!' })
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
