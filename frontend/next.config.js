/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de build otimizadas
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'three'],
  },
  
  // Configurações de performance
  swcMinify: true,
  compress: true,
  
  // Configurações de imagem
  images: {
    domains: ['agroisync.com', 'api.agroisync.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Configurações de webpack
  webpack: (config, { dev, isServer }) => {
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
