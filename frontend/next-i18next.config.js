module.exports = {
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'es', 'zh'],
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
} 