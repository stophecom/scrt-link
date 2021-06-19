/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')

module.exports = withPWA({
  webpack5: true,
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
            key: 'DNT',
            value: '1',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/js/index.exclusions.js', // Proxy plausible script
        destination: 'https://plausible.io/js/plausible.exclusions.js',
      },
      {
        source: '/api/event',
        destination: 'https://plausible.io/api/event',
      },
    ]
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    return config
  },
})
