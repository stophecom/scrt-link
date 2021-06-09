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

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    return config
  },
})
