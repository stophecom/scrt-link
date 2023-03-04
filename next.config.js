const withPlugins = require('next-compose-plugins')
const { withPlausibleProxy } = require('next-plausible')

const { i18n } = require('./next-i18next.config')

const plugins = [withPlausibleProxy]

const config = {
  i18n,
  output: 'standalone',

  // swcMinify: true, // Wait for nextjs 12
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
    }

    return config
  },
  redirects: async () => {
    return [
      {
        source: '/file',
        destination: '/files',
        permanent: true,
      },
    ]
  },
}

module.exports = withPlugins(plugins, config)
