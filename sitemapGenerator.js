// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '/.env.production' })
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sitemap = require('nextjs-sitemap-generator')

sitemap({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  pagesDirectory: __dirname + `/pages`,
  targetDirectory: `public/`,
  ignoredExtensions: ['png', 'jpg'],
  ignoredPaths: ['l', 'api', '404', '500'],
})
console.log(`✅ sitemap.xml generated!`)
