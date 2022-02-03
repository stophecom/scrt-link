import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  // apiVersion: '2006-03-01',
  endpoint: { hostname: process.env.FLOW_S3_ENDPOINT, path: '', protocol: 'https' },
  region: 'zrh1', // This needs to be set, but can be anything really b/c we use custom endpoint. E.g. us-east-1
  credentials: {
    accessKeyId: process.env.FLOW_S3_ACCESS_KEY,
    secretAccessKey: process.env.FLOW_S3_SECRET_KEY,
  },
  // forcePathStyle: true,
})

export { s3Client }
