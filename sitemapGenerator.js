// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '/.env.production' })
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sitemap = require('nextjs-sitemap-generator')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

const BUILD_ID = fs.readFileSync('.next/BUILD_ID').toString()

sitemap({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  pagesDirectory: __dirname + '/.next/server/static/' + BUILD_ID + '/pages',
  targetDirectory: `out/`,
  ignoredExtensions: ['png', 'jpg'],
  ignoredPaths: ['l', 'api'],
})
console.log(`✅ sitemap.xml generated!`)
