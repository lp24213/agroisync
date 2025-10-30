/**
 * Script para verificar se o build está pronto para Capacitor
 * Executar: node scripts/verify-capacitor-build.js
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const REQUIRED_FILES = [
  'index.html',
  'static',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

console.log('🔍 Verificando build para Capacitor...\n');

// Verificar se build existe
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ ERRO: Diretório build/ não encontrado!');
  console.log('💡 Execute primeiro: npm run build\n');
  process.exit(1);
}

console.log('✅ Diretório build/ existe\n');

// Verificar arquivos necessários
let allOk = true;
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(BUILD_DIR, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`✅ ${file}/ (diretório)`);
    } else {
      const size = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${file} (${size} KB)`);
    }
  } else {
    console.error(`❌ ${file} NÃO encontrado!`);
    allOk = false;
  }
});

// Verificar index.html tem base href
const indexPath = path.join(BUILD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('<base href=')) {
    console.log('\n✅ index.html tem base href configurado');
  } else {
    console.log('\n⚠️  index.html não tem base href (pode funcionar mesmo assim)');
  }
  
  // Verificar se tem referência ao manifest
  if (indexContent.includes('manifest.json')) {
    console.log('✅ index.html referencia manifest.json');
  } else {
    console.error('❌ index.html não referencia manifest.json!');
    allOk = false;
  }
}

// Verificar variáveis de ambiente no build
console.log('\n📋 Verificando variáveis de ambiente...');
const staticDir = path.join(BUILD_DIR, 'static/js');
if (fs.existsSync(staticDir)) {
  const jsFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.js'));
  if (jsFiles.length > 0) {
    const firstJs = fs.readFileSync(path.join(staticDir, jsFiles[0]), 'utf8');
    if (firstJs.includes('agroisync.com/api')) {
      console.log('✅ API URL configurada corretamente (agroisync.com/api)');
    } else {
      console.warn('⚠️  API URL pode não estar configurada');
    }
  }
}

console.log('\n' + '='.repeat(50));
if (allOk) {
  console.log('✅ BUILD VERIFICADO - PRONTO PARA CAPACITOR!');
  console.log('\nPróximos passos:');
  console.log('  1. npm run cap:sync');
  console.log('  2. npm run cap:open:android (ou cap:open:ios)');
} else {
  console.error('❌ BUILD INCOMPLETO - Execute npm run build primeiro');
  process.exit(1);
}
console.log('='.repeat(50) + '\n');
