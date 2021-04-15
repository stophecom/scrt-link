import mongoose from 'mongoose'

export interface StatsFields {
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
    totalSecretsCount: { type: Number, required: true, default: 0 },
    secretsCount: {
      message: Number,
      url: Number,
      neogram: Number,
    },
    totalSecretsViewCount: Number,
    secretsViewCount: {
      message: Number,
      url: Number,
      neogram: Number,
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
