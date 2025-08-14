// Otimizações de build para AWS Amplify
const path = require('path');

module.exports = {
  // Configurações de otimização
  optimization: {
    // Otimizações de CSS
    css: {
      minify: true,
      extract: true,
      modules: false,
    },
    
    // Otimizações de JavaScript
    js: {
      minify: true,
      sourceMap: false,
      treeShaking: true,
    },
    
    // Otimizações de webpack
    webpack: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      },
    },
  },
  
  // Configurações de resolução
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/contexts': path.resolve(__dirname, './contexts'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/types': path.resolve(__dirname, './types'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/public': path.resolve(__dirname, './public'),
    },
    fallback: {
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
    },
  },
  
  // Configurações de ambiente
  environment: {
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_OPTIONS: '--max-old-space-size=4096 --openssl-legacy-provider',
  },
};
