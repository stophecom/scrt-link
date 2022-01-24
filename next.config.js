const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const { withPlausibleProxy } = require('next-plausible')

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs')

const { i18n } = require('./next-i18next.config')

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
  experimental: {
    outputStandalone: true,
  },
  i18n,
  images: {
    domains: ['api.producthunt.com'],
  },
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
}

const moduleExports = withPlugins(plugins, config)

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports =
  process.env.NEXT_PUBLIC_ENV === 'development'
    ? moduleExports
    : withSentryConfig(moduleExports, SentryWebpackPluginOptions)
