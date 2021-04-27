import mongoose from 'mongoose'

export interface UserSettingsFields {
  userId: string
  receiptEmail: string
  receiptPhoneNumber: string
  neogramDestructionMessage: string
  neogramDestructionTimeout: number
  name: string
  isReadReceiptsViaEmailEnabled: boolean
  isReadReceiptsViaPhoneEnabled: boolean
  isSenderNameVisible: boolean
  secretsCount: number
}

type UserSettingsDocument = mongoose.Document & UserSettingsFields

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: false, trim: true },
    receiptEmail: { type: String, required: false, trim: true },
    receiptPhoneNumber: { type: String, required: false, trim: true },
    isReadReceiptsViaEmailEnabled: { type: Boolean, required: false },
    isReadReceiptsViaPhoneEnabled: { type: Boolean, required: false },
    isSenderNameVisible: { type: Boolean, required: false },
    neogramDestructionMessage: { type: String, required: false, trim: true },
    neogramDestructionTimeout: { type: Number, required: false },
  },
  { timestamps: true },
)

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const UserSettings =
  (mongoose.models.UserSettings as mongoose.Model<UserSettingsDocument>) ||
  mongoose.model<UserSettingsDocument>('UserSettings', UserSettingsSchema)

export default UserSettings
