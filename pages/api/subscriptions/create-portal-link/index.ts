import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'

import { getLocaleFromRequest } from '@/api/utils/helpers'
import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'
import { getBaseURL } from '@/utils'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  const locale = getLocaleFromRequest(req)

  const session = await getSession({ req })

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }
  if (!session) {
    throw createError(405, 'Not allowed. You need to be signed in!')
  }

  switch (req.method) {
    case 'POST': {
      try {
        const customer = await models.Customer.findOne({
          userId: session.userId || '',
        }).lean()

        if (!customer?.stripe?.customerId) {
          throw createError(500, 'No Stripe customer attached to this user.')
        }

        const { url } = await stripe.billingPortal.sessions.create({
          customer: customer.stripe.customerId,
          return_url: `${getBaseURL()}/account`,
          locale: locale,
        })

        res.status(200).json({ url })
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
