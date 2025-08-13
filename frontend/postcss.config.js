module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
      }],
    } : false,
  },
};
