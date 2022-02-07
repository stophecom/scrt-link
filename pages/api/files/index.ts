import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

// Specifies a path within your Space and the file to download.
export const bucketParams = {
  Bucket: 'example-space-name',
  Key: 'file.ext',
}

import withDb from '@/api/middlewares/withDb'
import handleErrors from '@/api/middlewares/handleErrors'
import createError from '@/api/utils/createError'
import { getS3Client } from '@/api/utils/s3'
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
        const Key: string = req.query.file as string
        const Bucket: string = (req.query.bucket as string) || 'development'

        try {
          const post = await createPresignedPost(getS3Client(), {
            Bucket,
            Fields: {
              acl: 'bucket-owner-full-control',
              key: Key,
            },
            Key,
            Expires: 60, // seconds
            Conditions: [
              ['content-length-range', 0, maxFileSize],
              { 'Content-Type': 'application/octet-stream' },
            ],
          })

          res.status(200).json(post)
        } catch (error) {
          console.error(error)
        }
      }
      break

    case 'DELETE': {
      {
        try {
          const s3Client = getS3Client()
          const bucketParams = {
            Bucket: req.query.bucket as string,
            Key: req.query.file as string,
            ACL: 'public-read',
          }

          const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), {
            expiresIn: 60,
          })

          if (!url) {
            throw createError(405, `Couldn't get signed url. File no longer exist.`)
          }

          res.status(200).json({ url })

          // After the file has been retrieved we delete.
          const deletionTimeout = 10 * 60 * 1000 // 10 Minutes
          setTimeout(
            async () =>
              await s3Client.send(new DeleteObjectCommand(bucketParams)).then(console.log),
            deletionTimeout,
          )
        } catch (error) {
          console.error(error)
        }
      }
      break
    }
    default:
      throw createError(405, 'Method Not Allowed')
  }
}

export default handleErrors(withDb(handler))
