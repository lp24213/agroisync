/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para AWS Amplify + SSR
  output: 'standalone',
  
  // Otimizações para produção
  swcMinify: true,
  compress: true,
  
  // Configurações de imagem
  images: {
    unoptimized: false, // Habilitar otimização para SSR
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'ipfs.io',
      'gateway.pinata.cloud'
    ],
    formats: ['image/webp', 'image/avif']
  },
  
  // Configurações de segurança
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ],
  
  // Configurações de build
  experimental: {
    // Otimizações para Web3
    esmExternals: 'loose',
    serverComponentsExternalPackages: [
      '@solana/web3.js',
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-react',
      '@firebase/app',
      '@firebase/auth',
      '@firebase/firestore'
    ]
  },
  
  // Configurações de webpack para Web3
  webpack: (config, { isServer }) => {
    // Resolver para módulos Web3
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify')
    };
    
    // Otimizações para produção
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          web3: {
            test: /[\\/]node_modules[\\/](@solana|@firebase)[\\/]/,
            name: 'web3',
            chunks: 'all',
            priority: 10
          }
        }
      };
    }
    
    return config;
  },
  
  // Configurações de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  },
  
  // Configurações de trailing slash
  trailingSlash: false,
  
  // Configurações de base path (se necessário)
  basePath: '',
  
  // Configurações de asset prefix (se necessário)
  assetPrefix: '',
  
  // Configurações de compressão
  compress: true,
  
  // Configurações de powered by
  poweredByHeader: false,
  
  // Configurações de compressão gzip
  compress: true,
  
  // Configurações de otimização
  optimizeFonts: true,
  
  // Configurações de cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2
  }
};

module.exports = nextConfig;
