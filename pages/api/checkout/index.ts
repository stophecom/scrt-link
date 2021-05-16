import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { getSession } from 'next-auth/client'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    throw createError(405, 'Not allowed')
  }

  if (req.method === 'POST') {
    const { priceId } = req.body

    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: session.stripeCustomerId,

        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: `${req.headers.origin}/plans?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/plans/cancelled`,
      }

      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)

      res.status(200).json(checkoutSession)
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
