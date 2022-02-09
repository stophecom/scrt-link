import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { BaseDocumentData } from './types'

export type SecretType = 'text' | 'url' | 'neogram' | 'file' // Could be imported from scrt-link-core
export interface SecretUrlFields {
  secretType: SecretType
  alias: string
  message?: string
  isEncryptedWithUserPassword: boolean
  neogramDestructionMessage?: string
  neogramDestructionTimeout?: number
  receiptApi?: { slack: string }
  receiptEmail?: string
  receiptPhoneNumber?: string
}

export type SecretUrlData = BaseDocumentData & SecretUrlFields // Not used. @todo clean up types

type SecretUrlDocument = mongoose.Document & SecretUrlFields

const SecretUrlSchema = new mongoose.Schema(
  {
    secretType: { type: String, required: true, trim: true },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    message: { type: String, required: false, default: '' },
    isEncryptedWithUserPassword: { type: Boolean, required: true, default: false },
    neogramDestructionMessage: { type: String, required: false, trim: true },
    neogramDestructionTimeout: { type: Number, required: false },
    receiptApi: {
      slack: String,
    },
    receiptEmail: { type: String, required: false, trim: true },
    receiptPhoneNumber: { type: String, required: false, trim: true },
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
