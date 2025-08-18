/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { file: /node_modules/ },
      { module: /\.next/ },
      { file: /\.next/ },
    ];
    return config;
  },
}

module.exports = nextConfig
