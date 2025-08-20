#!/usr/bin/env node

/**
 * Script de build simples para AWS Amplify
 * Não verifica versões, apenas executa o build
 */

const { execSync } = require('child_process');

console.log('🚀 AGROISYNC - Build simples para AWS Amplify');
console.log('==============================================');

try {
  console.log('📦 Instalando dependências...');
  execSync('npm ci', { stdio: 'inherit' });
  
  console.log('🔨 Fazendo build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
