const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'pt', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

// Atenção: Para produção, remova EITHER 'pages/index.tsx' OU 'app/page.tsx'.
// O Next.js não permite ambas as rotas raiz. Escolha apenas uma abordagem (App Router ou Pages Router).
module.exports = withPWA(nextConfig);
