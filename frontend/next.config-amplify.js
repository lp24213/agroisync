/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: false,
  swcMinify: true,
  
  // Ignorar erros durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuração para exportação estática (Amplify)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Configurações de build
  distDir: '.next',
  
  // Configurações para evitar problemas
  experimental: {
    esmExternals: false,
    appDir: false,
  },
  
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
    
    // Configurações adicionais para evitar problemas
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    }
    
    return config
  },
}

module.exports = nextConfig
