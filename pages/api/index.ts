import { NextApiHandler, NextApiRequest } from 'next'
import { nanoid } from 'nanoid'
import * as Yup from 'yup'
import Cors from 'cors'
import { AES, enc } from 'crypto-js'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { urlAliasLength } from '@/constants'
import { apiValidationSchemaByType } from '@/utils/validationSchemas'
import initMiddleware from '@/api/utils/middleware'

const getInputValidationSchema = Yup.object().shape({
  alias: Yup.string().label('Alias').required().trim(),
})

const extractGetInput = async (req: NextApiRequest) => {
  try {
    await getInputValidationSchema.validate(req.query)
  } catch (err) {
    throw createError(422, err.message)
  }
  const { alias } = req.query
  if (typeof alias !== 'string') {
    throw createError(422, 'Invalid URL')
  }
  return alias
}

const extractPostInput = async (req: NextApiRequest) => {
  const { secretType, isEncryptedWithUserPassword } = req.body

  try {
    await apiValidationSchemaByType.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  let { message } = req.body

  message = message.trim()
  message = encodeURIComponent(message)
  return { secretType, message, isEncryptedWithUserPassword }
}

const handler: NextApiHandler = async (req, res) => {
  const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST'],
      origin: `foo.bar`,
    }),
  )

  await cors(req, res)

  const models = req.models
  if (!models) {
    throw createError(500, 'Could not find db connection')
  }
  switch (req.method) {
    case 'GET':
      const alias = await extractGetInput(req)
      const secretUrl = await models.SecretUrl.findOneAndDelete({ alias })
      if (!secretUrl) {
        throw createError(
          404,
          `URL not found - This usually means the secret link has already been visited and therefor no longer exists.`,
        )
      }

      // Decrypt
      const decryptAES = (string: string) => {
        const bytes = AES.decrypt(string, `${process.env.AES_KEY_512}`)
        return bytes.toString(enc.Utf8)
      }

      res.json({
        secretType: secretUrl.secretType,
        message: decryptAES(secretUrl.message),
        isEncryptedWithUserPassword: secretUrl.isEncryptedWithUserPassword,
      })
      break
    case 'POST':
      const { secretType, message, isEncryptedWithUserPassword } = await extractPostInput(req)

      // Encrypt sensitive information
      const encryptAES = (string: string) =>
        AES.encrypt(string, `${process.env.AES_KEY_512}`).toString()

      const shortened = new models.SecretUrl({
        secretType,
        message: encryptAES(message),
        alias: nanoid(urlAliasLength),
        isEncryptedWithUserPassword,
      })
      await shortened.save()
      res.json(shortened)
      break
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
