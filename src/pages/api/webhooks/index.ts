import { buffer } from 'micro'

import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import NextCors from 'nextjs-cors'

import withDb from '@/api/middlewares/withDb'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: NextApiHandler = async (req, res) => {
  // Run the middleware
  await NextCors(req, res, {
    methods: ['HEAD', 'POST'],
    origin: '*',
  })

  const models = req.models

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error'
      // On error, log and return the error message.
      console.warn(`❌ Error message: ${errorMessage}`)
      throw createError(400, `Webhook Error: ${errorMessage}`)
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // If payment successful the status changes to active:
        // https://stripe.com/docs/api/subscriptions/object#subscription_object-status
        if (['trialing', 'active'].includes(subscription.status)) {
          // We use the role that is stored as metadata on the stripe plan
          await models.Customer.findOneAndUpdate(
            {
              'stripe.customerId': subscription.customer,
            },
            { role: 'premium' },
          )
          console.log('✅ Subscription active:', event.type)
        } else {
          // E.g. if canceled, unpaid, etc.
          await models.Customer.findOneAndUpdate(
            {
              'stripe.customerId': subscription.customer,
            },
            { role: 'free' },
          )
        }

        break
      }

      default: {
        console.warn(`Unhandled event type: ${event.type}`)
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } else {
    throw createError(405, 'Method Not Allowed')
  }
}

export default withDb(handler)
