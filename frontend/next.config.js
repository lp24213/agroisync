/** @type {import('next').NextConfig} */
// CONFIGURAÇÃO DEFINITIVA PARA AMPLIFY - SEM ESLINT
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
