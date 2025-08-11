/**
 * AWS Amplify Build Configuration
 * Otimizações específicas para deploy no AWS Amplify
 */

const amplifyConfig = {
  // Configurações de build otimizadas
  buildOptimizations: {
    // Otimizações de bundle
    bundleAnalyzer: false,
    minify: true,
    sourceMaps: false,
    
    // Otimizações de cache
    cacheEnabled: true,
    cachePaths: [
      '.next/cache',
      'node_modules/.cache',
    ],
  },
  
  // Configurações de deploy
  deploySettings: {
    // Verificações pós-build
    postBuildChecks: [
      'server.js exists',
      'package.json exists',
      '.next directory exists',
      'app directory exists',
    ],
    
    // Arquivos essenciais
    essentialFiles: [
      'server.js',
      'package.json',
      '.next',
      'app',
      'public',
    ],
  },
  
  // Configurações de performance
  performance: {
    // Otimizações de carregamento
    lazyLoading: true,
    codeSplitting: true,
    
    // Otimizações de imagem
    imageOptimization: false, // Desabilitado para AWS Amplify
    responsiveImages: false,
  },
};

module.exports = amplifyConfig;
