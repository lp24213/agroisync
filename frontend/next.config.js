/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true, // Ignorar erros de TypeScript durante o build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar erros de ESLint durante o build
  },
  // Configurações para exportação estática (Amplify)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configurações para evitar problemas de build
  experimental: {
    esmExternals: false,
  },
  // Configurações simplificadas para evitar conflitos
  distDir: '.next',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }
    return config;
  },
}

module.exports = nextConfig
