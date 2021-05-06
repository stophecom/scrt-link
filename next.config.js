/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    clientsClaim: false,
    register: false, // Disable for now
  },
  async headers() {
    return [
      {
        source: '/l/:alias',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'DNT',
            value: '1',
          },
        ],
      },
    ]
  },
})
