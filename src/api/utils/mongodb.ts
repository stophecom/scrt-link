import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'

const originalCertificate = path.join(process.cwd(), '/tmp/ca-certificate.pem')
const certificate = path.join(__dirname, '/ca-certificate.pem')

fs.copyFile(originalCertificate, certificate, (err) => {
  if (err) {
    console.log('Error copying certificate:', err)
  } else {
    console.log('Successfully copied certificate ')
  }
})

const uri = process.env.DB
const options = {
  ssl: true,
  retryWrites: true,
  tlsCAFile: certificate,
}

let clientPromise: Promise<typeof mongoose>

if (!process.env.DB) {
  throw new Error('Please add your Mongo URI to .env')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(uri, options)
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.

  clientPromise = mongoose.connect(uri, options)
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
