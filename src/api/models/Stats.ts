import mongoose from 'mongoose'

export interface StatsFields {
  userId?: string
  totalSecretsCount: number
  secretsCount: {
    message: number
    url: number
    neogram: number
  }
  totalSecretsViewCount: number
  secretsViewCount: {
    message: number
    url: number
    neogram: number
  }
}

type StatsDocument = mongoose.Document & StatsFields

const StatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: false },
    totalSecretsCount: { type: Number, required: true, default: 0 },
    secretsCount: {
      message: { type: Number, required: false, default: 0 },
      url: { type: Number, required: false, default: 0 },
      neogram: { type: Number, required: false, default: 0 },
    },
    totalSecretsViewCount: { type: Number, required: false, default: 0 },
    secretsViewCount: {
      message: { type: Number, required: false, default: 0 },
      url: { type: Number, required: false, default: 0 },
      neogram: { type: Number, required: false, default: 0 },
    },
  },
  { timestamps: true },
)

// For "Cannot overwrite model once compiled" error:
// https://hoangvvo.com/blog/migrate-from-express-js-to-next-js-api-routes/
const Stats =
  (mongoose.models.Stats as mongoose.Model<StatsDocument>) ||
  mongoose.model<StatsDocument>('Stats', StatsSchema)

export default Stats
