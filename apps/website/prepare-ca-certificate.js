const fs = require('fs')
const path = require('path')

require('dotenv').config()

// writeFile function with filename, content and callback function

fs.mkdir('tmp', { recursive: true }, (err) => {
  if (err) throw err
  console.log('Certificate folder created.')
})
fs.writeFile('tmp/ca-certificate.pem', process.env.SCALEGRID_CA_CERTIFICATE, function (err) {
  if (err) throw err
  console.log('Certificate file was created successfully.')
})
