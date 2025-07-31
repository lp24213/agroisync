/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'standalone',
  trailingSlash: true,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable SSR for problematic pages
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
