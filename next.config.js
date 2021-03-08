module.exports = {
  async headers() {
    return [
      {
        source: '/:alias',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'DNT',
            value: '1',
          },
        ],
      },
    ]
  },
}
