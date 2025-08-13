/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração principal para AWS Amplify com SSR
  trailingSlash: true,
  poweredByHeader: false,
  
  // Configuração de imagens otimizada para SSR
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      '127.0.0.1',
      'agroisync.com',
      'www.agroisync.com',
      'api.agroisync.com',
      'app.agroisync.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configuração de build - IGNORAR ERROS PARA DEPLOY
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuração de segurança avançada
  async headers() {
    const securityHeaders = [
      {
        key: 'Access-Control-Allow-Origin',
        value: 'https://agroisync.com, https://www.agroisync.com, https://api.agroisync.com',
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'Content-Type, Authorization, X-Requested-With, X-API-Key, X-Client-Version, Origin, Accept',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'geolocation=(), microphone=(), camera=()',
      },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https: wss:; frame-ancestors 'self'",
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  
  // Configuração de webpack otimizada para SSR
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Configuração de alias para imports
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
    
    return config;
  },
  
  // Configuração de redirecionamentos para SSR
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Configuração de rewrites para SSR (sem regra SPA)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Configuração de compressão e performance
  compress: true,
  generateEtags: false,
  swcMinify: true,
  
  // Configuração experimental para SSR
  experimental: {
    optimizeCss: true,
    serverComponentsExternalPackages: ['@aws-amplify/ui-react'],
  },
};

module.exports = nextConfig;
