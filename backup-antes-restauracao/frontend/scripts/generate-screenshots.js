/**
 * Script para gerar screenshots automáticos do app
 * Requer: npm install -D @playwright/test playwright
 * Executar: node scripts/generate-screenshots.js
 */

const fs = require('fs');
const path = require('path');

// Lista de telas para capturar
const screens = [
  { name: 'home', url: '/', description: 'Página inicial' },
  { name: 'marketplace', url: '/produtos', description: 'Marketplace de produtos' },
  { name: 'frete', url: '/agroconecta', description: 'AgroConecta - Fretes' },
  { name: 'clima', url: '/clima-insumos', description: 'Clima e Insumos' },
  { name: 'chat', url: '/', description: 'Chat IA (precisa abrir modal)' }
];

// Resoluções para diferentes dispositivos
const resolutions = {
  // Android
  'android-phone': { width: 1080, height: 1920, name: 'Android Phone' },
  'android-tablet': { width: 1536, height: 2048, name: 'Android Tablet' },
  // iOS
  'iphone-14-pro-max': { width: 1290, height: 2796, name: 'iPhone 14 Pro Max' },
  'iphone-11-pro': { width: 1242, height: 2688, name: 'iPhone 11 Pro' },
  'iphone-se': { width: 750, height: 1334, name: 'iPhone SE' },
  'ipad-pro-12.9': { width: 2048, height: 2732, name: 'iPad Pro 12.9"' }
};

console.log('📸 Gerador de Screenshots do AgroSync\n');
console.log('⚠️  Este script requer Playwright instalado.');
console.log('📦 Instale com: npm install -D @playwright/test playwright\n');

console.log('📋 Screenshots a gerar:');
screens.forEach(screen => {
  console.log(`   - ${screen.name}: ${screen.description}`);
});

console.log('\n📱 Resoluções:');
Object.entries(resolutions).forEach(([key, res]) => {
  console.log(`   - ${res.name}: ${res.width}x${res.height}`);
});

console.log('\n📝 Para gerar screenshots automaticamente:');
console.log('   1. Certifique-se de que o app está rodando (npm start)');
console.log('   2. Instale Playwright: npm install -D @playwright/test playwright');
console.log('   3. Execute: npx playwright test --grep screenshots');
console.log('\n💡 Alternativa manual:');
console.log('   - Abra o app no navegador/devtools');
console.log('   - Use modo dispositivo móvel');
console.log('   - Tire screenshots das telas principais');
console.log('   - Salve em frontend/public/ com nomes:');
console.log('     • screenshot-mobile-1.png até screenshot-mobile-8.png');
console.log('     • screenshot-desktop-1.png até screenshot-desktop-4.png');

// Criar estrutura de diretórios se não existir
const screenshotDir = path.join(__dirname, '../public');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

console.log('\n✅ Diretório de screenshots pronto:', screenshotDir);
