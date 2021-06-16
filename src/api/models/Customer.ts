import mongoose from 'mongoose'

export const readReceiptOptions = ['none', 'sms', 'email'] as const
export type ReadReceiptMethod = typeof readReceiptOptions[number]

const roles = ['free', 'premium', 'visitor'] as const
export type Role = typeof roles[number]

export interface CustomerFields {
  userId: string
  role: Role
  stripe: {
    customerId: string
  }
  receiptEmail: string
  receiptPhoneNumber: string
  neogramDestructionMessage: string
  neogramDestructionTimeout: number
  isEmojiShortLinkEnabled: boolean
  name: string
  readReceiptMethod: ReadReceiptMethod
}

// User editable data
export const customerData = [
  'receiptEmail',
  'receiptPhoneNumber',
  'neogramDestructionMessage',
  'neogramDestructionTimeout',
  'isEmojiShortLinkEnabled',
  'name',
  'readReceiptMethod',
]

type CustomerDocument = mongoose.Document & CustomerFields

const CustomerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    role: { type: String, enum: roles },
    stripe: {
      customerId: String,
    },
    name: { type: String, required: false, trim: true },
    receiptEmail: { type: String, required: false, trim: true },
    receiptPhoneNumber: { type: String, required: false, trim: true },
    readReceiptMethod: { type: String, enum: readReceiptOptions, required: false },
    isEmojiShortLinkEnabled: { type: Boolean, required: false },
    neogramDestructionMessage: { type: String, required: false, trim: true },
    neogramDestructionTimeout: { type: Number, required: false },
  },
  { timestamps: true },
)

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const Customer =
  (mongoose.models.Customer as mongoose.Model<CustomerDocument>) ||
  mongoose.model<CustomerDocument>('Customer', CustomerSchema)

export default Customer
