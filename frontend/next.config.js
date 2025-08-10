/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['agrotmsol.com.br', 'localhost', 'd2d5j98tau5snm.amplifyapp.com'],
    unoptimized: true,
  },
  trailingSlash: false,
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://d2d5j98tau5snm.amplifyapp.com' : '',
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APPSYNC_API_URL: process.env.NEXT_PUBLIC_APPSYNC_API_URL,
    NEXT_PUBLIC_APPSYNC_API_KEY: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
  },
  // Build configuration - IGNORE ALL ERRORS FOR DEPLOY
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // AWS Amplify specific configuration
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
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
