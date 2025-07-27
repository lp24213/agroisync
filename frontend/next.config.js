/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'http://:host*' }],
        destination: 'https://:host:/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'pt', 'zh'],
    defaultLocale: 'en',
    localeDetection: false, // Corrigido para booleano conforme Next.js >=12.1.0
  },
};

module.exports = nextConfig;
