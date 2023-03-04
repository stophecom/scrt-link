import { NextApiHandler, NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import { pick } from 'ramda'

import { t } from '@/api/utils/localization'
import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { getCustomerValidationSchema } from '@/utils/validationSchemas'
import { encodeStringsForDB, decodeStringsFromDB } from '@/utils/db'
import { customerWriteData, customerReadData } from '@/api/models/Customer'
import { nextAuthAdapter } from '@/api/utils/nextAuth'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    const editableData = pick(customerWriteData, req.body)

    await getCustomerValidationSchema(t, 'none').validate(editableData)
  } catch (err) {
    throw createError(422, err instanceof Error ? err.message : 'Unexpected error')
  }

  return encodeStringsForDB(req.body)
}

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
    case 'GET': {
      const customer = await models.Customer.findOne({
        userId: session?.user?.id || '',
      }).lean()

      res.json({
        ...decodeStringsFromDB(pick(customerReadData, customer)),
      })
      break
    }
    case 'POST': {
      const data = await extractPostInput(req)

      const userId = session?.user?.id || ''
      const customer = await models.Customer.findOneAndUpdate({ userId }, data, {
        upsert: true,
        new: true,
      })

      res.json({ data: customer.toJSON(), message: 'Your settings have been saved!' })
      break
    }
    case 'DELETE': {
      try {
        const userId = session?.user?.id || ''
        await models.Customer.findOneAndDelete({ userId })

        // @ts-ignore
        await nextAuthAdapter.deleteUser(userId)

        res.json({ message: 'Account has been deleted successfully.' })
      } catch (err) {
        throw createError(
          405,
          err instanceof Error ? err.message : 'Unable to delete user account.',
        )
      }

      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
