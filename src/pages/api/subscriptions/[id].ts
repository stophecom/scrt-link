import { NextApiHandler } from 'next'
import Stripe from 'stripe'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  const subscriptionId: string = req.query.id as string

  switch (req.method) {
    case 'GET': {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        res.status(200).json(subscription)
      } catch (err) {
        throw createError(500, err instanceof Error ? err.message : 'Unexpected error')
      }
      break
    }
    case 'PUT': {
      const { priceId } = req.body

      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const updatedSubscription: Stripe.Subscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [
              {
                id: subscription.items.data[0].id,
                price: priceId,
              },
            ],
          },
        )

        res.status(200).json(updatedSubscription)
      } catch (err) {
        throw createError(500, err instanceof Error ? err.message : 'Unexpected error')
      }
      break
    }
    case 'DELETE': {
      try {
        const canceledSubscription: Stripe.Subscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: true,
            trial_end: 'now',
            // cancel_at: Math.round(Date.now() / 1000) + 20, // For testing
          },
        )

        res.status(200).json(canceledSubscription)
      } catch (err) {
        throw createError(500, err instanceof Error ? err.message : 'Unexpected error')
      }
      break
    }

    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
