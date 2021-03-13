import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { maxCustomAliasLength, maxMessageLength } from '@/constants'
import { BaseDocumentData } from './types'
interface ShortUrlFields {
  secretType: string
  alias: string
  message: string
  isEncryptedWithUserPassword: boolean
}

export type ShortUrlData = BaseDocumentData & ShortUrlFields

type ShortUrlDocument = mongoose.Document & ShortUrlFields

const shortUrlSchema = new mongoose.Schema(
  {
    secretType: { type: String, required: true, trim: true },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: maxCustomAliasLength,
    },
    message: { type: String, required: false, default: '', maxlength: 5 * maxMessageLength }, // Set maxlength reasonably big
    isEncryptedWithUserPassword: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
)

// To have a custom error message when unique validation fails.
shortUrlSchema.plugin(uniqueValidator, {
  message: '"{VALUE}" is already in use. Please use another {PATH}.',
})

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const ShortUrl =
  (mongoose.models.ShortUrl as mongoose.Model<ShortUrlDocument>) ||
  mongoose.model<ShortUrlDocument>('ShortUrl', shortUrlSchema)

export default ShortUrl
