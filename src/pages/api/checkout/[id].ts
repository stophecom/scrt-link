import { NextApiHandler } from 'next'
import Stripe from 'stripe'

import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const id: string = req.query.id as string
      try {
        if (!id.startsWith('cs_')) {
          throw Error('Incorrect CheckoutSession ID.')
        }
        const checkout_session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
          id,
          {
            expand: ['payment_intent'],
          },
        )

        res.status(200).json(checkout_session)
      } catch (err) {
        throw createError(500, err instanceof Error ? err.message : 'Unexpected error')
      }
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(handler)
