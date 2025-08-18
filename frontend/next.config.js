/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  output: 'standalone',
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Desabilitar export estático para resolver problemas de SSR
  distDir: '.next',
  webpack: (config, { isServer }) => {
    // Configuração profissional do webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { file: /node_modules/ },
    ];
    
    return config;
  },
}

module.exports = nextConfig
