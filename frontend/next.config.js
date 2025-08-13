/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.agroisync.com',
    NEXT_PUBLIC_APP_URL: 'https://agroisync.com'
  },
  
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      '127.0.0.1',
      'agroisync.com',
      'www.agroisync.com',
      'api.agroisync.com'
    ]
  },
  
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          }
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/agrotmsol',
        destination: 'https://agroisync.com',
        permanent: true,
      },
      {
        source: '/agrotm',
        destination: 'https://agroisync.com',
        permanent: true,
      },
      {
        source: '/old',
        destination: 'https://agroisync.com',
        permanent: true,
      }
    ];
  }
};

module.exports = nextConfig;
