/** @type {import('next').Config} */
const nextConfig = {
  // Configuração otimizada para AWS Amplify (menos memória)
  experimental: {
    // Desabilitar recursos experimentais para economizar memória
  },
  
  // Server external packages (mínimo)
  serverExternalPackages: ['aws-amplify'],
  
  // Image configuration otimizada
  images: {
    unoptimized: true,
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Build optimization para AWS Amplify
  trailingSlash: false,
  poweredByHeader: false,
  
  // Build configuration - IGNORE ALL ERRORS FOR DEPLOY
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // AWS Amplify specific configuration
  output: 'standalone',
  
  // Compression otimizada
  compress: true,
  generateEtags: false,
  
  // Webpack optimization para AWS Amplify (menos memória)
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
      };
    }
    
    // Alias simples
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@/components': './components',
      '@/lib': './lib',
      '@/contexts': './contexts',
      '@/hooks': './hooks',
      '@/utils': './utils',
      '@/types': './types',
      '@/styles': './styles',
      '@/public': './public'
    };
    
    // Otimizações para menos memória
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects simples
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Rewrites simples
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
