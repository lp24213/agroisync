const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testando build do frontend...');

try {
  // Verificar se estamos no diretório correto
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json não encontrado. Execute este script do diretório frontend/');
    process.exit(1);
  }

  console.log('📦 Verificando dependências...');
  
  // Verificar se node_modules existe
  if (!fs.existsSync('node_modules')) {
    console.log('📥 Instalando dependências...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  }

  console.log('🔨 Iniciando build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build concluído com sucesso!');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
