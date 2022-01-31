import AWS from 'aws-sdk'

const endpoint = new AWS.Endpoint(process.env.FLOW_S3_ENDPOINT)

const s3 = new AWS.S3({
  endpoint: endpoint,
  accessKeyId: process.env.FLOW_S3_ACCESS_KEY,
  secretAccessKey: process.env.FLOW_S3_SECRET_KEY,
})

export default s3
