import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/index.js',
    viewportWidth: 375,
    viewportHeight: 812,
    blockHosts: ['*plausible.io'],
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    video: false,
  },
})
