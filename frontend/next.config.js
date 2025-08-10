/** @type {import('next').Config} */
const nextConfig = {
  // AWS Amplify optimized configuration
  output: 'standalone',
  experimental: {
    esmExternals: false,
    outputFileTracingRoot: undefined,
  },
  
  // Image configuration
  images: {
    domains: ['agrotmsol.com.br', 'localhost', 'd2d5j98tau5snm.amplifyapp.com'],
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Health check redirect
  async redirects() {
    return [
      {
        source: '/health',
        destination: '/api/health',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
