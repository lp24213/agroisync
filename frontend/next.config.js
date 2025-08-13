/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
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
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true,
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react']
  }
};

module.exports = nextConfig;
