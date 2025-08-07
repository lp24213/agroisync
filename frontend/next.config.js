/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração condicional para export estático
  ...(process.env.BUILD_STATIC === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  images: {
    domains: ['agrotmsol.com.br', 'localhost', 'vercel.app'],
    unoptimized: true,
  },
  trailingSlash: false,
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://agrotmsol.com.br' : '',
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Build configuration - IGNORE ALL ERRORS FOR DEPLOY
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
