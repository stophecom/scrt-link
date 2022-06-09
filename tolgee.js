const http = require('https') // or 'https'
const fs = require('fs')
const extract = require('extract-zip')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '/.env.production') })

const projectId = '670'
const apiKey = process.env.TOLGEE_API_KEY
const apiEndpoint = `https://app.tolgee.io/api/repository/${projectId}/export/jsonZip?ak=${apiKey}`

const temporaryDirectory = path.join(__dirname, '/tmp')
const temporaryZipFile = path.join(temporaryDirectory, '/file.zip')

// Where we store the translation files
const localesFolder = path.join(__dirname, '/public/locales')

// Make sure /tmp folder exists, otherwise create it
if (!fs.existsSync(temporaryDirectory)) {
  fs.mkdirSync(temporaryDirectory, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Directory created successfully!')
  })
}

// Move/map to existing locales folders
// Make an async function that gets executed immediately
async function mapPaths() {
  // Our starting point
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(temporaryDirectory)

    // Loop them all with the new for...of
    for (const file of files) {
      // Get the full paths
      const fromPath = path.join(temporaryDirectory, file)
      const toPath = path.join(localesFolder, path.parse(file).name, 'common.json')

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fromPath)

      if (stat.isFile()) console.log("'%s' is a file.", fromPath)
      else if (stat.isDirectory()) console.log("'%s' is a directory.", fromPath)

      // Now move async
      if (path.parse(file).ext === '.json') {
        await fs.promises.rename(fromPath, toPath)
      }

      // Log because we're crazy
      console.log("Moved '%s'->'%s'", fromPath, toPath)
    } // End for...of
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e)
  }
}

async function extractZip() {
  try {
    await extract(temporaryZipFile, { dir: temporaryDirectory })
    console.log('Extraction complete')

    await mapPaths()
  } catch (err) {
    console.warn(err)
  }
}

const file = fs.createWriteStream(temporaryZipFile)
const request = http.get(apiEndpoint, function (response) {
  response.pipe(file)

  // after download completed close filestream
  file.on('finish', () => {
    file.close()
    console.log('Download complete')
    extractZip()
  })
})
