// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '/.env.production' })
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://scrt.link',
  generateRobotsTxt: false, // (optional)
  exclude: ['/l/*', '/api/*', '/404', '/500', '/account', '/widget'],
}
