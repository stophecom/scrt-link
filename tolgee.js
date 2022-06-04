// import axios from 'axios'

const http = require('https') // or 'https' for https:// URLs
const fs = require('fs')
const extract = require('extract-zip')
const path = require('path')

const projectId = '670'
const apiKey = 'e0h9lu6t876p29glmcmej81jbr'
const apiEndpoint = `https://app.tolgee.io/api/repository/${projectId}/export/jsonZip?ak=${apiKey}`

const temporaryDirectory = __dirname + '/tmp'
const temporaryZipFile = temporaryDirectory + '/file.zip'

const localesFolder = __dirname + '/public/locales'

// fs.mkdir(temporaryDirectory)

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

    await mapPaths()
    console.log('Extraction complete')
    // await mapPaths()
  } catch (err) {
    console.warn(err)
    // handle any errors
  }
}

const file = fs.createWriteStream(temporaryZipFile)
const request = http.get(apiEndpoint, function (response) {
  response.pipe(file)

  // after download completed close filestream
  file.on('finish', () => {
    file.close()
    extractZip()
    console.log('Download Completed')
  })
})

// console.log(data)
