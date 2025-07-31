/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost', 'agrotmsol.com.br', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'agrotmsol.com.br',
      },
      {
        protocol: 'https',
        hostname: 'www.agrotmsol.com.br',
      },
    ],
  },
  env: {
    CUSTOM_KEY: 'my-value',
    NEXT_PUBLIC_APP_NAME: 'AGROTM.SOL',
    NEXT_PUBLIC_APP_URL: 'https://agrotmsol.com.br',
    NEXT_PUBLIC_API_URL: 'https://api.agrotmsol.com.br',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://agrotmsol.com.br https://www.agrotmsol.com.br; font-src 'self' https:; connect-src 'self' https: https://agrotmsol.com.br https://api.agrotmsol.com.br; frame-ancestors 'none';" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
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
    return config;
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;
