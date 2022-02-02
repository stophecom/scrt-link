import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import s3 from '@/api/utils/s3'
import { limits } from '@/constants'

const handler: NextApiHandler = async (req, res) => {
  const models = req.models
  const session = await getSession({ req })

  if (!models) {
    throw createError(500, 'Could not find db connection')
  }

  let maxFileSize = limits.visitor.maxFileSize // @todo

  if (session) {
    // @todo set maxFileSize based on customer role
  }

  switch (req.method) {
    case 'GET':
      {
        try {
          const post = await s3.createPresignedPost({
            Bucket: process.env.FLOW_S3_BUCKET,
            Fields: {
              key: req.query.file,
            },
            Expires: 60, // seconds
            Conditions: [
              ['content-length-range', 0, maxFileSize],
              { 'Content-Type': 'application/octet-stream' },
            ],
          })

          res.status(200).json(post)
        } catch (error) {
          console.log(error)
        }
      }
      break

    case 'DELETE': {
      {
        try {
          // @todo
          // Gone in 60s
          var params = { Bucket: process.env.FLOW_S3_BUCKET, Key: req.query.file, Expires: 60 }
          var url = s3.getSignedUrl('getObject', params)

          res.status(200).json({ url })
        } catch (error) {
          console.log(error)
        }
      }
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
