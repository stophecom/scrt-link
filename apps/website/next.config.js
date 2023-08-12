const { i18n } = require('./next-i18next.config')

const config = {
  i18n,
  output: 'standalone',
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
  async headers() {
    return [
      {
        source: '/l',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline'; font-src 'https://fonts.gstatic.com/*",
          },
        ],
      },
    ]
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

module.exports = config
