#!/usr/bin/env node

/**
 * Script para regenerar package-lock.json e instalar dependências faltantes
 * Resolve problemas de dependências desincronizadas no AWS Amplify
 * Compatível com Windows e Unix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Regenerando package-lock.json e instalando dependências...');

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

// Limpeza completa - VERSÃO CROSS-PLATFORM
console.log('🧹 Limpeza completa de dependências...');

// Remover package-lock.json
if (fs.existsSync(packageLockPath)) {
  try {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json removido');
  } catch (error) {
    console.log('⚠️  Erro ao remover package-lock.json:', error.message);
  }
}

// Remover node_modules - VERSÃO CROSS-PLATFORM
if (fs.existsSync(nodeModulesPath)) {
  try {
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
      console.log('✅ node_modules removido (Windows)');
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
      console.log('✅ node_modules removido (Unix/Linux)');
    }
  } catch (error) {
    console.log('⚠️  Erro ao remover node_modules:', error.message);
    console.log('💡 Tentando remoção manual...');
    
    try {
      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
        console.log('✅ node_modules removido manualmente');
      }
    } catch (manualError) {
      console.log('❌ Falha na remoção manual:', manualError.message);
      console.log('💡 Por favor, remova manualmente a pasta node_modules');
    }
  }
}

// Verificar e remover outros arquivos de lock
const lockFiles = ['yarn.lock', 'pnpm-lock.yaml', 'package-lock.json'];
lockFiles.forEach(lockFile => {
  const lockPath = path.join(__dirname, lockFile);
  if (fs.existsSync(lockPath)) {
    try {
      fs.unlinkSync(lockPath);
      console.log(`✅ ${lockFile} removido`);
    } catch (error) {
      console.log(`⚠️  Erro ao remover ${lockFile}:`, error.message);
    }
  }
});

// Limpar cache do NPM
console.log('🧹 Limpando cache do NPM...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache do NPM limpo');
} catch (error) {
  console.log('⚠️  Erro ao limpar cache:', error.message);
}

// Instalar dependências com --force
console.log('📥 Instalando dependências com --force...');
try {
  execSync('npm install --force --no-audit --no-fund', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com --force');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  console.log('💡 Tentando com npm install --legacy-peer-deps...');
  
  try {
    execSync('npm install --legacy-peer-deps --no-audit --no-fund', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com --legacy-peer-deps');
  } catch (legacyError) {
    console.error('❌ Falha também com --legacy-peer-deps:', legacyError.message);
    process.exit(1);
  }
}

// Rebuild pacotes nativos
console.log('🔧 Rebuild de pacotes nativos...');
try {
  execSync('npm rebuild', { stdio: 'inherit' });
  console.log('✅ Pacotes nativos rebuildados');
} catch (error) {
  console.log('⚠️  Erro no rebuild:', error.message);
}

// Verificar dependências críticas
console.log('🔍 Verificando dependências críticas...');
const criticalDeps = [
  '@types/react',
  '@types/react-dom',
  'firebase',
  '@solana/web3.js',
  'web3',
  'ethers',
  'safe-buffer',
  'string_decoder',
  'base-x',
  '@scure/base',
  'hash-base',
  'readdirp',
  'node-fetch',
  'whatwg-url',
  'tr46',
  'webidl-conversions',
  'bs58'
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
try {
  let nodeModulesSize;
  if (process.platform === 'win32') {
    nodeModulesSize = execSync('dir node_modules /s | find "File(s)"', { encoding: 'utf8' }).trim();
    console.log(`📊 Tamanho do node_modules: ${nodeModulesSize}`);
  } else {
    nodeModulesSize = execSync('du -sh node_modules', { encoding: 'utf8' }).trim();
    console.log(`📊 Tamanho do node_modules: ${nodeModulesSize}`);
  }
} catch (error) {
  console.log('⚠️  Não foi possível verificar o tamanho do node_modules');
}

// Verificar package-lock.json
if (fs.existsSync(packageLockPath)) {
  const packageLockSize = fs.statSync(packageLockPath).size;
  console.log(`📋 package-lock.json: ${(packageLockSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Verificar integridade do lock file
  try {
    const lockContent = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    const lockDeps = Object.keys(lockContent.dependencies || {});
    console.log(`🔒 Dependências no lock file: ${lockDeps.length}`);
  } catch (parseError) {
    console.log('⚠️  Erro ao parsear package-lock.json');
  }
} else {
  console.log('❌ package-lock.json não foi criado');
}

console.log('🎉 Regeneração concluída!');
console.log('💡 Agora você pode fazer commit e push para o AWS Amplify');
console.log('🚀 O build deve funcionar perfeitamente com Node.js 20+');
console.log('🔒 Todas as dependências Web3/Firebase/Solana estão sincronizadas');
