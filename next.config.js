module.exports = {
  async headers() {
    return [
      {
        source: '/:alias',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};
