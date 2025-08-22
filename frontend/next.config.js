/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  
  // Configurações de imagem otimizadas
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.binance.com',
      },
      {
        protocol: 'https',
        hostname: 'api.agrolink.com.br',
      },
      {
        protocol: 'https',
        hostname: 'www.b3.com.br',
      },
      {
        protocol: 'https',
        hostname: 'fao.org',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: '*.amplifyapp.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Configurações experimentais modernas
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'agroisync.com', '*.amplifyapp.com'],
    },
  },

  // Configurações de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
    NEXT_PUBLIC_APP_NAME: 'AGROISYNC',
    NEXT_PUBLIC_APP_VERSION: '2.3.1',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agroisync.com',
    NEXT_PUBLIC_BINANCE_API_URL: 'https://api.binance.com',
    NEXT_PUBLIC_AGROLINK_API_URL: 'https://api.agrolink.com.br',
    NEXT_PUBLIC_B3_API_URL: 'https://www.b3.com.br',
    NEXT_PUBLIC_FAO_API_URL: 'https://fao.org',
    NEXT_PUBLIC_OPENWEATHER_API_URL: 'https://api.openweathermap.org',
  },

  // Configurações de webpack otimizadas
  webpack: (config, { isServer, dev }) => {
    // Fallbacks para client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        buffer: false,
        process: false,
      }
    }

    // Otimizações para produção
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
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
        },
      }
    }

    // Ignore warnings específicos
    config.ignoreWarnings = [
      /critical dependency/i,
      /Module not found/i,
    ]

    return config
  },

  // Configurações de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configurações de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configurações de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },

  // Configurações de redirecionamento
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Configurações de rewrites para APIs
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },

  // Configurações de cache
  generateEtags: true,
  
  // Configurações de compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },

  // Configurações específicas para AWS Amplify
  distDir: '.next',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig
