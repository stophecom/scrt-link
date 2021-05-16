import mongoose from 'mongoose'

export type ReadReceipts = 'none' | 'sms' | 'email'
export interface CustomerFields {
  userId: string
  stripe: {
    customerId: string
  }
  receiptEmail: string
  receiptPhoneNumber: string
  neogramDestructionMessage: string
  neogramDestructionTimeout: number
  isEmojiShortLinkEnabled: boolean
  name: string
  readReceipts: ReadReceipts
}

type CustomerDocument = mongoose.Document & CustomerFields

const CustomerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    stripe: {
      customerId: String,
    },
    name: { type: String, required: false, trim: true },
    receiptEmail: { type: String, required: false, trim: true },
    receiptPhoneNumber: { type: String, required: false, trim: true },
    readReceipts: { type: String, required: false },
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
