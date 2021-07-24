import { NextApiHandler, NextApiRequest } from 'next'
import NextCors from 'nextjs-cors'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { apiValidationSchemaByType } from '@/utils/validationSchemas'
import { encryptAES } from '@/utils/db'

const extractPostInput = async (req: NextApiRequest) => {
  try {
    await apiValidationSchemaByType.validate(req.body) // Improve
  } catch (err) {
    throw createError(422, err.message)
  }

  return req.body
}

const handler: NextApiHandler = async (req, res) => {
  // Run the middleware
  await NextCors(req, res, {
    methods: ['HEAD', 'POST', 'OPTIONS'],
    origin: '*',
  })

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const models = req.models
  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  switch (req.method) {
    case 'POST': {
      const {
        secretType,
        message,
        isEncryptedWithUserPassword,
        alias,
        receiptEmail,
        receiptPhoneNumber,
        neogramDestructionMessage,
        neogramDestructionTimeout,
      } = await extractPostInput(req)

      // Update global stats
      await models.Stats.findOneAndUpdate(
        { master: true },
        {
          $inc: {
            totalSecretsCount: 1,
            'secretsCount.text': Number(secretType === 'text'),
            'secretsCount.url': Number(secretType === 'url'),
            'secretsCount.neogram': Number(secretType === 'neogram'),
          },
        },
        { new: true, upsert: true },
      )

      const shortened = new models.SecretUrl({
        secretType,
        message: encryptAES(message),
        alias,
        isEncryptedWithUserPassword,
        ...(secretType === 'neogram'
          ? {
              neogramDestructionMessage: encryptAES(neogramDestructionMessage),
              neogramDestructionTimeout,
            }
          : {}),
        ...(receiptEmail ? { receiptEmail: encryptAES(receiptEmail) } : {}),
        ...(receiptPhoneNumber ? { receiptPhoneNumber: encryptAES(receiptPhoneNumber) } : {}),
      })

      await shortened.save()

      res.status(200).json({ alias, message: 'Secret saved!' })
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
