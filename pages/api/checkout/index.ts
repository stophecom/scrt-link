import { NextApiHandler } from 'next'
import Stripe from 'stripe'
import { getSession } from 'next-auth/react'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'
import { getLocaleFromRequest } from '@/api/utils/helpers'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  const session = await getSession({ req })
  const locale = getLocaleFromRequest(req)

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
          userId: session?.user?.id || '',
        }).lean()

        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          locale: 'auto', // Set it to auto since we have languages that are not supported by Stripe
          mode: 'subscription',
          allow_promotion_codes: true,
          customer: customer?.stripe?.customerId,
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
          success_url: getAbsoluteLocalizedUrl('/pricing?session_id={CHECKOUT_SESSION_ID}', locale),
          cancel_url: getAbsoluteLocalizedUrl('/pricing/canceled', locale),
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
