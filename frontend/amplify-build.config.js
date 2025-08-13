/**
 * AWS Amplify Build Configuration
 * Otimizações específicas para deploy no AWS Amplify
 * FORÇA USO DO NODE.JS 20.15.1 PARA COMPATIBILIDADE TOTAL
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
  
  // Configurações de Node.js - FORÇA VERSÃO CORRETA
  nodeConfig: {
    version: '20.15.1',
    npmVersion: '10.8.2',
    enforceVersion: true,
    checkBeforeBuild: true,
  },
  
  // Configurações de compatibilidade
  compatibility: {
    firebase: '>=12.0.0',
    node: '>=20.0.0',
    npm: '>=10.8.2',
  },
};

module.exports = amplifyConfig;
