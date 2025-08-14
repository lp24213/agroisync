/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração crítica para AWS Amplify - ZERO ERROS
  output: 'standalone',
  trailingSlash: true,
  
  // Configurações de imagem para AWS Amplify
  images: {
    unoptimized: true,
    domains: ['agroisync.com', 'api.agroisync.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Configurações de ambiente críticas
  env: {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  
  // Configurações de webpack otimizadas
  webpack: (config, { dev, isServer }) => {
    // Excluir contratos do build
    config.module.rules.push({
      test: /\.(sol|ts)$/,
      include: /contracts/,
      use: 'ignore-loader'
    });
    
    // Excluir hardhat.config.ts
    config.module.rules.push({
      test: /hardhat\.config\.ts$/,
      use: 'ignore-loader'
    });
    
    // Otimizações para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    // Resolver para Three.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
    };
    
    return config;
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirecionamentos
  async redirects() {
    return [
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
