// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '/.env.production' })
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sitemap = require('nextjs-sitemap-generator')

sitemap({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  pagesDirectory: __dirname + `/`,
  targetDirectory: `public/`,
  ignoredExtensions: ['png', 'jpg', 'ico', 'json', 'js', 'txt', 'xml'],
  ignoredPaths: ['l', 'api'],
})
console.log(`✅ sitemap.xml generated!`)
