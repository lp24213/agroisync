const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.pixabay.com", "images.unsplash.com"]
  },
  i18n: {
    locales: ['en', 'pt', 'zh'],
    defaultLocale: 'en',
    localeDetection: true
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

module.exports = withPWA(nextConfig);
