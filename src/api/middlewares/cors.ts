import Cors from 'cors'

import initMiddleware from '@/api/utils/middleware'
import { sanitizeUrl } from '@/utils/index'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: `${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}`,
  }),
)
export default cors
