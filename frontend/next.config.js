/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  output: 'export',
  distDir: 'out',
  
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
  }
};

module.exports = nextConfig;
