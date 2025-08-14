#!/usr/bin/env node

/**
 * Script para sincronizar package-lock.json com package.json
 * Resolve problemas de dependências desincronizadas no AWS Amplify
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Sincronizando dependências...');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageLockPath = path.join(__dirname, 'package-lock.json');
const nodeModulesPath = path.join(__dirname, 'node_modules');

// Verificar se package.json existe
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json não encontrado!');
  process.exit(1);
}

// Ler package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log(`📦 Projeto: ${packageJson.name} v${packageJson.version}`);
console.log(`🔧 Node.js requerido: ${packageJson.engines?.node || 'não especificado'}`);
console.log(`📋 NPM requerido: ${packageJson.engines?.npm || 'não especificado'}`);

// Verificar versão do Node.js
const nodeVersion = process.version;
console.log(`🟢 Node.js atual: ${nodeVersion}`);

// Verificar se Node.js 20+ está sendo usado
const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0]);
if (nodeMajorVersion < 20) {
  console.warn('⚠️  Aviso: Node.js 20+ é recomendado para este projeto');
}

// Limpar arquivos de lock e node_modules
console.log('🧹 Limpando arquivos de lock e node_modules...');

if (fs.existsSync(packageLockPath)) {
  fs.unlinkSync(packageLockPath);
  console.log('✅ package-lock.json removido');
}

if (fs.existsSync(nodeModulesPath)) {
  execSync('rm -rf node_modules', { stdio: 'inherit' });
  console.log('✅ node_modules removido');
}

// Verificar se yarn.lock existe
const yarnLockPath = path.join(__dirname, 'yarn.lock');
if (fs.existsSync(yarnLockPath)) {
  console.log('📦 Yarn detectado - removendo yarn.lock...');
  fs.unlinkSync(yarnLockPath);
}

// Instalar dependências
console.log('📥 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Verificar dependências críticas
console.log('🔍 Verificando dependências críticas...');
const criticalDeps = [
  '@types/react',
  '@types/react-dom',
  '@firebase/app',
  '@solana/web3.js'
];

criticalDeps.forEach(dep => {
  try {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      const depPackage = JSON.parse(fs.readFileSync(path.join(depPath, 'package.json'), 'utf8'));
      console.log(`✅ ${dep}: v${depPackage.version}`);
    } else {
      console.log(`❌ ${dep}: não encontrado`);
    }
  } catch (error) {
    console.log(`⚠️  ${dep}: erro ao verificar`);
  }
});

// Verificar tamanho do node_modules
const nodeModulesSize = execSync('du -sh node_modules', { encoding: 'utf8' }).trim();
console.log(`📊 Tamanho do node_modules: ${nodeModulesSize}`);

// Verificar package-lock.json
if (fs.existsSync(packageLockPath)) {
  const packageLockSize = fs.statSync(packageLockPath).size;
  console.log(`📋 package-lock.json: ${(packageLockSize / 1024 / 1024).toFixed(2)} MB`);
} else {
  console.log('❌ package-lock.json não foi criado');
}

console.log('🎉 Sincronização concluída!');
console.log('💡 Agora você pode fazer commit e push para o AWS Amplify');
console.log('🚀 O build deve funcionar perfeitamente com Node.js 20+');
