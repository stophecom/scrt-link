import clientPromise from '@/api/utils/mongodb'

import { MongooseAdapter } from './next-auth-mongoose-adapter'
export const nextAuthAdapter = MongooseAdapter(clientPromise)
