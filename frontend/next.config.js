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
    ignoreBuildErrors: false
  },
  
  // Configurações de ESLint
  eslint: {
    ignoreDuringBuilds: false
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
