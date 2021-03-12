import { NextApiHandler, NextApiRequest } from 'next'
import withDb from '@/api/middlewares/withDb'
import { nanoid } from 'nanoid'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { urlAliasLength } from '@/constants'
import { apiValidationSchemaByType } from '@/utils/validationSchemas'
import * as Yup from 'yup'

import { AES, enc } from 'crypto-js'

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
  const { type, isEncryptedWithUserPassword } = req.body

  try {
    await apiValidationSchemaByType.validate(req.body)
  } catch (err) {
    throw createError(422, err.message)
  }

  let { customAlias, message } = req.body
  customAlias = customAlias.trim()
  customAlias = encodeURIComponent(customAlias)

  message = message.trim()
  message = encodeURIComponent(message)
  return { type, message, customAlias, isEncryptedWithUserPassword }
}

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  if (!models) {
    throw createError(500, 'Could not find db connection')
  }
  switch (req.method) {
    case 'GET':
      const alias = await extractGetInput(req)
      const shortUrl = await models.ShortUrl.findOneAndDelete({ alias })
      if (!shortUrl) {
        throw createError(
          404,
          `URL not found - This usually means your secret link has already been visited.`,
        )
      }

      // Decrypt
      const decryptAES = (string: string) => {
        const bytes = AES.decrypt(string, `${process.env.AES_KEY_256}`)
        return bytes.toString(enc.Utf8)
      }

      res.json({
        type: shortUrl.type,
        message: decryptAES(shortUrl.message),
        isEncryptedWithUserPassword: shortUrl.isEncryptedWithUserPassword,
      })
      break
    case 'POST':
      const { type, message, customAlias, isEncryptedWithUserPassword } = await extractPostInput(
        req,
      )

      // Encrypt sensitive information
      const encryptAES = (string: string) =>
        AES.encrypt(string, `${process.env.AES_KEY_256}`).toString()

      const shortened = new models.ShortUrl({
        type,
        message: encryptAES(message),
        alias: customAlias || nanoid(urlAliasLength),
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
