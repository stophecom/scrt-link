import { NextApiHandler, NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'
import { pick } from 'ramda'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { getCustomerValidationSchema } from '@/utils/validationSchemas'
import { encodeStringsForDB, decodeStringsFromDB } from '@/utils/db'
import { customerData } from '@/api/models/Customer'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    const editableData = pick(customerData, req.body)

    await getCustomerValidationSchema('none').validate(editableData)
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

      const editableData = pick(customerData, customer?.toJSON())

      res.json({
        ...decodeStringsFromDB(editableData),
      })
      break
    }
    case 'POST': {
      const data = await extractPostInput(req)

      const userId = session.userId || ''
      const customer = await models.Customer.findOneAndUpdate({ userId }, data, {
        upsert: true,
        new: true,
      })

      res.json({ data: customer.toJSON(), message: 'Your settings have been saved!' })
      break
    }
    case 'DELETE': {
      const userId = session.userId || ''
      await models.Customer.findOneAndDelete({ userId })

      res.json({ message: 'Account has been deleted successfully.' })
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
