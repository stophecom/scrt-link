import Cors from 'cors'

import initMiddleware from '@/api/utils/middleware'
import { baseUrl } from '@/constants'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: baseUrl,
  }),
)
export default cors
