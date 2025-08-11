#!/usr/bin/env node

/**
 * Teste de Build Standalone para AWS Amplify
 * Este script verifica se o build standalone está funcionando corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Testando Build Standalone para AWS Amplify...\n');

// Verificar se estamos na pasta correta
const currentDir = process.cwd();
console.log(`📁 Diretório atual: ${currentDir}`);

// Verificar estrutura de pastas
const frontendPath = path.join(currentDir, 'frontend');
const standalonePath = path.join(frontendPath, '.next', 'standalone');
const finalPath = path.join(standalonePath, 'frontend');

console.log(`📁 Caminho frontend: ${frontendPath}`);
console.log(`📁 Caminho standalone: ${standalonePath}`);
console.log(`📁 Caminho final: ${finalPath}\n`);

// Verificar se as pastas existem
const checks = [
  { name: 'Pasta frontend', path: frontendPath, exists: fs.existsSync(frontendPath) },
  { name: 'Pasta .next', path: path.join(frontendPath, '.next'), exists: fs.existsSync(path.join(frontendPath, '.next')) },
  { name: 'Pasta standalone', path: standalonePath, exists: fs.existsSync(standalonePath) },
  { name: 'Pasta final', path: finalPath, exists: fs.existsSync(finalPath) }
];

console.log('🔍 Verificando estrutura de pastas:');
checks.forEach(check => {
  const status = check.exists ? '✅' : '❌';
  console.log(`  ${status} ${check.name}: ${check.path}`);
});

// Verificar arquivos essenciais
if (fs.existsSync(finalPath)) {
  console.log('\n📋 Verificando arquivos essenciais:');
  
  const essentialFiles = [
    'server.js',
    'package.json',
    '.next',
    'app'
  ];
  
  essentialFiles.forEach(file => {
    const filePath = path.join(finalPath, file);
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${file}: ${exists ? 'Encontrado' : 'NÃO ENCONTRADO'}`);
  });
  
  // Listar conteúdo da pasta final
  console.log('\n📁 Conteúdo da pasta final:');
  try {
    const files = fs.readdirSync(finalPath);
    files.forEach(file => {
      const filePath = path.join(finalPath, file);
      const stats = fs.statSync(filePath);
      const type = stats.isDirectory() ? '📁' : '📄';
      console.log(`  ${type} ${file}`);
    });
  } catch (error) {
    console.log(`  ❌ Erro ao ler pasta: ${error.message}`);
  }
}

console.log('\n🎯 Verificação concluída!');
console.log('📋 Para AWS Amplify, o baseDirectory deve ser: frontend/.next/standalone/frontend');
