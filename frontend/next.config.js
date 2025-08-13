/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build estático para AWS Amplify
  output: 'export',
  distDir: 'out',
  
  // Configurações de roteamento
  trailingSlash: true,
  
  // Otimizações de imagem
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
  
  // Configurações de build
  poweredByHeader: false,
  
  // Configurações de TypeScript
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Configurações de ESLint
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
