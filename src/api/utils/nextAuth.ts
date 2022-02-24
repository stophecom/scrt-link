import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/api/utils/mongodb'

export const nextAuthAdapter = MongoDBAdapter(clientPromise)
