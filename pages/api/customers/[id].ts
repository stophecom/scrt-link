import { NextApiHandler } from 'next'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  const customerId: string = req.query.id as string

  switch (req.method) {
    case 'GET': {
      try {
        const customer = await stripe.customers.retrieve(customerId)

        res.status(200).json(customer)
      } catch (err) {
        throw createError(500, err.message)
      }
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
