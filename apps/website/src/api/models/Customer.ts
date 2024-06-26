import mongoose from 'mongoose'

export const readReceiptOptions = ['none', 'email', 'ntfy'] as const
export type ReadReceiptMethod = (typeof readReceiptOptions)[number]

const roles = ['free', 'premium', 'visitor'] as const
export type Role = (typeof roles)[number]

export interface CustomerFields {
  userId: string
  role: Role
  stripe: {
    customerId: string
  }
  receiptEmail: string
  receiptNtfy: string
  neogramDestructionMessage: string
  neogramDestructionTimeout: number
  isEmojiShortLinkEnabled: boolean
  signupUniqueEmailIdentifier: string // Used for initial sign up
  name: string
  readReceiptMethod: ReadReceiptMethod
  didAcceptTerms: boolean
}

// User editable data
export const customerWriteData = [
  'receiptEmail',
  'receiptNtfy',
  'neogramDestructionMessage',
  'neogramDestructionTimeout',
  'isEmojiShortLinkEnabled',
  'name',
  'readReceiptMethod',
]

export const customerReadData = ['userId', 'stripe', 'role', ...customerWriteData]

type CustomerDocument = mongoose.Document & CustomerFields

const CustomerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    role: { type: String, enum: roles },
    stripe: {
      customerId: String,
    },
    name: { type: String, required: false, trim: true },
    signupUniqueEmailIdentifier: { type: String, required: false, trim: true, unique: true },
    receiptEmail: { type: String, required: false, trim: true },
    receiptNtfy: { type: String, required: false, trim: true },
    readReceiptMethod: { type: String, enum: readReceiptOptions, required: false },
    isEmojiShortLinkEnabled: { type: Boolean, required: false },
    neogramDestructionMessage: { type: String, required: false, trim: true },
    neogramDestructionTimeout: { type: Number, required: false },
    didAcceptTerms: { type: Boolean, required: false },
  },
  { timestamps: true },
)

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const Customer =
  (mongoose.models.Customer as mongoose.Model<CustomerDocument>) ||
  mongoose.model<CustomerDocument>('Customer', CustomerSchema)

export default Customer
