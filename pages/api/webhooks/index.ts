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
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`)
      throw createError(400, `Webhook Error: ${err.message}`)
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id)

    switch (event.type) {
      case 'checkout.session.completed': {
        const paymentStatus = event.data.object as Stripe.Checkout.Session

        await models.Customer.findOneAndUpdate(
          {
            'stripe.customerId': paymentStatus.customer,
          },
          { 'stripe.subscription': paymentStatus.subscription },
        )

        console.log(`💰 Session completed status: ${JSON.stringify(paymentStatus, null, 2)}`)
        break
      }

      // Cast event data to Stripe object.
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`)
        break
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge

        console.log(`💵 Charge id: ${charge.id}`)

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
