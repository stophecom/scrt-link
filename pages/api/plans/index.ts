import { NextApiRequest, NextApiResponse } from 'next'

import stripe from '@/api/utils/stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data } = await stripe.products.list()

      const getPlans = async () =>
        Promise.all(
          data.map(async (item) => {
            const { data } = await stripe.prices.list({
              product: item.id,
              active: true,
            })

            const priceByInterval = (interval: string) =>
              data.find(({ recurring }) => recurring?.interval === interval)

            return {
              name: item.name,
              prices: { monthly: priceByInterval('month'), yearly: priceByInterval('year') },
            }
          }),
        )

      res.status(200).json(await getPlans())
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}
