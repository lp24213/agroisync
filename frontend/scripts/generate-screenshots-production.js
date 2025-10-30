/**
 * Script para gerar screenshots da versão em PRODUÇÃO
 * Não precisa de servidor local rodando!
 * Executar: node scripts/generate-screenshots-production.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'https://agroisync.com';
const SCREENSHOT_DIR = path.join(__dirname, '../public');

// Garantir que o diretório existe
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function generateScreenshots() {
  console.log('🚀 Iniciando geração de screenshots...');
  console.log(`📍 URL base: ${BASE_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // MOBILE - Pixel 5 (393x851)
    console.log('\n📱 Gerando screenshots MOBILE...');
    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 851 },
      userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
    });
    const mobilePage = await mobileContext.newPage();
    
    const screenshots = [
      { num: 1, name: 'Home', url: '/', wait: 3000 },
      { num: 2, name: 'Marketplace', url: '/produtos', wait: 3000 },
      { num: 3, name: 'AgroConecta', url: '/agroconecta', wait: 3000 },
      { num: 4, name: 'Clima e Insumos', url: '/clima-insumos', wait: 4000 },
      { num: 5, name: 'Planos', url: '/planos', wait: 3000 },
      { num: 6, name: 'Sobre', url: '/sobre', wait: 3000 }
    ];
    
    for (const shot of screenshots) {
      try {
        console.log(`  📸 ${shot.num}/6 - ${shot.name}...`);
        await mobilePage.goto(`${BASE_URL}${shot.url}`, { waitUntil: 'load', timeout: 30000 });
        await mobilePage.waitForTimeout(shot.wait);
        
        // Scroll um pouco para mostrar mais conteúdo
        await mobilePage.evaluate(() => window.scrollTo(0, 400));
        await mobilePage.waitForTimeout(500);
        
        await mobilePage.screenshot({ 
          path: path.join(SCREENSHOT_DIR, `screenshot-mobile-${shot.num}.png`), 
          fullPage: true 
        });
        console.log(`    ✅ screenshot-mobile-${shot.num}.png`);
      } catch (error) {
        console.log(`    ⚠️  Erro em ${shot.name}: ${error.message}`);
        // Continuar mesmo se uma página falhar
      }
    }
    
    await mobileContext.close();
    console.log('✅ Screenshots mobile concluídos!\n');
    
    // DESKTOP (1280x720)
    console.log('🖥️  Gerando screenshots DESKTOP...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    const desktopPage = await desktopContext.newPage();
    
    const desktopShots = [
      { num: 1, name: 'Home', url: '/' },
      { num: 2, name: 'Marketplace', url: '/produtos' }
    ];
    
    for (const shot of desktopShots) {
      try {
        console.log(`  📸 ${shot.num}/2 - ${shot.name}...`);
        await desktopPage.goto(`${BASE_URL}${shot.url}`, { waitUntil: 'load', timeout: 30000 });
        await desktopPage.waitForTimeout(3000);
        await desktopPage.screenshot({ 
          path: path.join(SCREENSHOT_DIR, `screenshot-desktop-${shot.num}.png`), 
          fullPage: false 
        });
        console.log(`    ✅ screenshot-desktop-${shot.num}.png`);
      } catch (error) {
        console.log(`    ⚠️  Erro em ${shot.name}: ${error.message}`);
      }
    }
    
    await desktopContext.close();
    console.log('✅ Screenshots desktop concluídos!\n');
    
    console.log('🎉 TODOS OS SCREENSHOTS GERADOS COM SUCESSO!');
    console.log(`📁 Localização: ${SCREENSHOT_DIR}`);
    console.log('\n📋 Arquivos gerados:');
    console.log('  Mobile: screenshot-mobile-1.png até screenshot-mobile-6.png');
    console.log('  Desktop: screenshot-desktop-1.png, screenshot-desktop-2.png');
    
  } catch (error) {
    console.error('❌ Erro ao gerar screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Executar
generateScreenshots().catch(console.error);
