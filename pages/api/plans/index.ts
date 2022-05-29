import { NextApiHandler } from 'next'

import handleErrors from '@/api/middlewares/handleErrors'
import stripe from '@/api/utils/stripe'
import createError from '@/api/utils/createError'

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const { data } = await stripe.products.list({ active: true })
        const currency: string = req.query.currency as string

        const getPlans = async () =>
          Promise.all(
            data.map(async (item) => {
              const { data } = await stripe.prices.list({
                product: item.id,
                active: true,
                currency: currency || 'USD',
              })

              const priceByInterval = (interval: string) =>
                data.find(({ recurring }) => recurring?.interval === interval)

              return {
                name: item.name,
                id: item.id,
                prices: { monthly: priceByInterval('month'), yearly: priceByInterval('year') },
              }
            }),
          )

        res.status(200).json(await getPlans())
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
