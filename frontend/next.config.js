/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: false,
  
  // Configuração para exportação estática (Amplify)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Ignorar erros durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configurações de build
  distDir: 'out',
  
  // Webpack config para evitar problemas
  webpack: (config) => {
    config.resolve.fallback = {
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
      buffer: false,
      util: false,
    }
    
    return config
  },
}

module.exports = nextConfig
