import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { urlAliasLength, maxMessageLength } from '@/constants'
import { BaseDocumentData } from './types'
interface SecretUrlFields {
  secretType: string
  alias: string
  message: string
  isEncryptedWithUserPassword: boolean
}

export type SecretUrlData = BaseDocumentData & SecretUrlFields

type SecretUrlDocument = mongoose.Document & SecretUrlFields

const SecretUrlSchema = new mongoose.Schema(
  {
    secretType: { type: String, required: true, trim: true },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: urlAliasLength,
    },
    message: { type: String, required: false, default: '', maxlength: 5 * maxMessageLength }, // Set maxlength reasonably big
    isEncryptedWithUserPassword: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
)

// To have a custom error message when unique validation fails.
SecretUrlSchema.plugin(uniqueValidator, {
  message: '"{VALUE}" is already in use. Please use another {PATH}.',
})

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const SecretUrl =
  (mongoose.models.SecretUrl as mongoose.Model<SecretUrlDocument>) ||
  mongoose.model<SecretUrlDocument>('SecretUrl', SecretUrlSchema)

export default SecretUrl
