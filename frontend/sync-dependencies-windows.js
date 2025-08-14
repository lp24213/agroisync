#!/usr/bin/env node

/**
 * Script para sincronizar package-lock.json com package.json - VERSÃO WINDOWS
 * Resolve problemas de dependências desincronizadas no AWS Amplify
 * Compatível com Windows PowerShell e Command Prompt
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Sincronizando dependências no Windows...');

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

// Limpar arquivos de lock e node_modules - VERSÃO WINDOWS
console.log('🧹 Limpando arquivos de lock e node_modules...');

// Remover package-lock.json
if (fs.existsSync(packageLockPath)) {
  try {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json removido');
  } catch (error) {
    console.log('⚠️  Erro ao remover package-lock.json:', error.message);
  }
}

// Remover node_modules - VERSÃO WINDOWS
if (fs.existsSync(nodeModulesPath)) {
  try {
    // Usar comando Windows para remover diretório
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
    
    // Tentativa manual de remoção
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

// Verificar se yarn.lock existe
const yarnLockPath = path.join(__dirname, 'yarn.lock');
if (fs.existsSync(yarnLockPath)) {
  try {
    fs.unlinkSync(yarnLockPath);
    console.log('📦 Yarn detectado - removendo yarn.lock...');
  } catch (error) {
    console.log('⚠️  Erro ao remover yarn.lock:', error.message);
  }
}

// Instalar dependências
console.log('📥 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  console.log('💡 Tentando com npm install --force...');
  
  try {
    execSync('npm install --force', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com --force');
  } catch (forceError) {
    console.error('❌ Falha também com --force:', forceError.message);
    process.exit(1);
  }
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

// Verificar tamanho do node_modules - VERSÃO WINDOWS
try {
  let nodeModulesSize;
  if (process.platform === 'win32') {
    // Comando Windows para tamanho de diretório
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
} else {
  console.log('❌ package-lock.json não foi criado');
}

console.log('🎉 Sincronização concluída!');
console.log('💡 Agora você pode fazer commit e push para o AWS Amplify');
console.log('🚀 O build deve funcionar perfeitamente com Node.js 20+');
console.log('🪟 Script otimizado para Windows PowerShell/Command Prompt');
