/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de build otimizadas para AWS Amplify
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'three'],
  },
  
  // Configurações de performance
  compress: true,
  
  // Configurações de imagem para AWS Amplify
  images: {
    unoptimized: true,
    domains: ['agroisync.com', 'api.agroisync.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Configurações de webpack
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
  
  // Configurações de headers
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
  
  // Configurações de redirecionamento
  async redirects() {
    return [
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Configurações de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
