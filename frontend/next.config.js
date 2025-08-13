/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build estático para AWS Amplify - PROFESSIONAL GRADE
  output: 'export',
  distDir: 'out',
  
  // Configurações de roteamento - PROFESSIONAL GRADE
  trailingSlash: true,
  
  // Otimizações de imagem - PROFESSIONAL GRADE
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
  
  // Configurações de build - PROFESSIONAL GRADE
  poweredByHeader: false,
  
  // Configurações de TypeScript - PROFESSIONAL GRADE
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Configurações de ESLint - PROFESSIONAL GRADE
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Configurações de otimização - PROFESSIONAL GRADE
  swcMinify: true,
  compress: true,
  
  // Configurações de performance - PROFESSIONAL GRADE
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react']
  },

  // Headers de segurança - REMOVIDOS PARA STATIC EXPORT
  // Headers serão configurados no AWS Amplify ou CDN
};

module.exports = nextConfig;
