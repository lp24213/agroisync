/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  reactStrictMode: false,
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
