#!/usr/bin/env node

/**
 * Script para verificar a versão do Node.js
 * Garante compatibilidade com Firebase e outras dependências
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Versão mínima requerida
const REQUIRED_NODE_VERSION = '20.15.1';
const REQUIRED_NPM_VERSION = '10.8.2';

function getCurrentVersion() {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    return { nodeVersion, npmVersion };
  } catch (error) {
    console.error('❌ Erro ao verificar versões:', error.message);
    process.exit(1);
  }
}

function parseVersion(versionString) {
  // Remove o 'v' do início se existir
  const cleanVersion = versionString.replace(/^v/, '');
  return cleanVersion.split('.').map(Number);
}

function compareVersions(current, required) {
  const currentParts = parseVersion(current);
  const requiredParts = parseVersion(required);
  
  for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const requiredPart = requiredParts[i] || 0;
    
    if (currentPart > requiredPart) return 1;
    if (currentPart < requiredPart) return -1;
  }
  
  return 0;
}

function checkVersions() {
  console.log('🔍 Verificando versões do Node.js e npm...\n');
  
  const { nodeVersion, npmVersion } = getCurrentVersion();
  
  console.log(`📋 Versões atuais:`);
  console.log(`   Node.js: ${nodeVersion}`);
  console.log(`   npm: ${npmVersion}\n`);
  
  console.log(`📋 Versões requeridas:`);
  console.log(`   Node.js: ${REQUIRED_NODE_VERSION} ou superior`);
  console.log(`   npm: ${REQUIRED_NPM_VERSION} ou superior\n`);
  
  // Verificar Node.js
  const nodeComparison = compareVersions(nodeVersion, REQUIRED_NODE_VERSION);
  if (nodeComparison < 0) {
    console.error(`❌ Node.js ${nodeVersion} é muito antigo!`);
    console.error(`   Requerido: ${REQUIRED_NODE_VERSION} ou superior`);
    console.error(`   Recomendado: Use nvm para instalar a versão correta`);
    console.error(`   Comando: nvm install ${REQUIRED_NODE_VERSION} && nvm use ${REQUIRED_NODE_VERSION}`);
    process.exit(1);
  }
  
  // Verificar npm
  const npmComparison = compareVersions(npmVersion, REQUIRED_NPM_VERSION);
  if (npmComparison < 0) {
    console.warn(`⚠️  npm ${npmVersion} é mais antigo que o recomendado`);
    console.warn(`   Recomendado: ${REQUIRED_NPM_VERSION} ou superior`);
    console.warn(`   Comando: npm install -g npm@latest`);
  }
  
  console.log('✅ Versões compatíveis! Pode prosseguir com o build.\n');
  
  // Verificar se existe .nvmrc
  const nvmrcPath = path.join(process.cwd(), '.nvmrc');
  if (fs.existsSync(nvmrcPath)) {
    const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
    console.log(`📁 .nvmrc encontrado: ${nvmrcContent}`);
    
    if (nvmrcContent !== REQUIRED_NODE_VERSION && !nvmrcContent.startsWith('20')) {
      console.warn(`⚠️  .nvmrc (${nvmrcContent}) pode não ser ideal para este projeto`);
    }
  }
}

// Executar verificação
if (require.main === module) {
  checkVersions();
}

module.exports = { checkVersions, REQUIRED_NODE_VERSION, REQUIRED_NPM_VERSION };
