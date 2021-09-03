/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const { withPlausibleProxy } = require('next-plausible')

const plugins = [
  [
    withPWA,
    {
      pwa: {
        disable: process.env.NODE_ENV === 'development',
        dest: 'public',
        clientsClaim: false,
        register: false, // Disable for now
      },
    },
  ],
  withPlausibleProxy,
]

const config = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    return config
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ]
  },
}
module.exports = withPlugins(plugins, config)
