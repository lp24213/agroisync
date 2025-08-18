/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: false,
  swcMinify: true,
  
  // Ignorar erros durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuração para exportação estática (Amplify)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Configurações de build
  distDir: '.next',
  
  // Configurações para evitar problemas
  experimental: {
    esmExternals: false,
    appDir: false,
    serverComponentsExternalPackages: [],
  },
  
  // Configurações de transpilação
  transpilePackages: [],
  
  // Webpack config para evitar problemas
  webpack: (config, { isServer }) => {
    // Configurações para cliente
    if (!isServer) {
      config.resolve.fallback = {
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
        buffer: false,
        util: false,
        querystring: false,
        punycode: false,
        domain: false,
        dns: false,
        dgram: false,
        child_process: false,
        cluster: false,
        module: false,
        vm: false,
        constants: false,
        events: false,
        string_decoder: false,
        timers: false,
        tty: false,
        readline: false,
        repl: false,
        v8: false,
        inspector: false,
        async_hooks: false,
        perf_hooks: false,
        trace_events: false,
        worker_threads: false,
      }
    }
    
    // Configurações adicionais para evitar problemas
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    }
    
    // Configurações para módulos
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })
    
    return config
  },
}

module.exports = nextConfig
