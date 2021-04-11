import mongoose from 'mongoose'

import { BaseDocumentData } from './types'

interface UserSettingsFields {
  userId: string
  neogramDestructionMessage: string
  name: string
}

export type UserSettingsData = BaseDocumentData & UserSettingsFields

type UserSettingsDocument = mongoose.Document & UserSettingsFields

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: false, trim: true },
    neogramDestructionMessage: { type: String, required: false, trim: true },
  },
  { timestamps: true },
)

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const UserSettings =
  (mongoose.models.UserSettings as mongoose.Model<UserSettingsDocument>) ||
  mongoose.model<UserSettingsDocument>('UserSettings', UserSettingsSchema)

export default UserSettings
