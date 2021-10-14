import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { getSession } from 'next-auth/client'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'
import { trialPeriod } from '@/constants'

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
    case 'POST': {
      const { priceId } = req.body

      try {
        const customer = await models.Customer.findOne({
          userId: session.userId || '',
        }).lean()

        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          mode: 'subscription',
          payment_method_types: ['card'],
          customer: customer?.stripe.customerId,
          line_items: [
            {
              price: priceId,
              // For metered billing, do not pass quantity
              quantity: 1,
            },
          ],
          subscription_data: {
            trial_period_days: trialPeriod,
          },
          // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
          // the actual Session ID is returned in the query parameter when your customer
          // is redirected to the success page.
          success_url: `${req.headers.origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/pricing/canceled`,
        }

        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
          params,
        )

        res.status(200).json(checkoutSession)
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
