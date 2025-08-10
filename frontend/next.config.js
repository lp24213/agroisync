/** @type {import('next').Config} */
const nextConfig = {
  // AWS Amplify optimized configuration
  experimental: {
    esmExternals: false,
  },
  
  // Image configuration
  images: {
    unoptimized: true,
  },
  
  trailingSlash: false,
  
  // Build configuration - IGNORE ALL ERRORS FOR DEPLOY
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Security headers
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
};

module.exports = nextConfig;
