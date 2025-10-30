/**
 * Script Playwright para gerar screenshots automáticos
 * Executar: npm run screenshots:mobile ou npm run screenshots:all
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../public');

// Garantir que o diretório existe
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('Screenshots para Publicação nas Lojas', () => {
  
  test('1. Home - Mobile', async ({ page }) => {
    console.log('📸 Capturando Home (Mobile)...');
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Aguardar carregamento completo
    
    // Scroll para capturar mais conteúdo
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-1.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-1.png gerado');
  });

  test('2. Marketplace - Mobile', async ({ page }) => {
    console.log('📸 Capturando Marketplace (Mobile)...');
    await page.goto('/produtos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-2.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-2.png gerado');
  });

  test('3. AgroConecta (Fretes) - Mobile', async ({ page }) => {
    console.log('📸 Capturando AgroConecta (Mobile)...');
    await page.goto('/agroconecta', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-3.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-3.png gerado');
  });

  test('4. Clima e Insumos - Mobile', async ({ page }) => {
    console.log('📸 Capturando Clima e Insumos (Mobile)...');
    await page.goto('/clima-insumos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000); // Clima pode demorar mais
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-4.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-4.png gerado');
  });

  test('5. Planos - Mobile', async ({ page }) => {
    console.log('📸 Capturando Planos (Mobile)...');
    await page.goto('/planos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-5.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-5.png gerado');
  });

  test('6. Dashboard/Login - Mobile', async ({ page }) => {
    console.log('📸 Capturando Dashboard/Login (Mobile)...');
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Se redirecionar para login, captura a tela de login
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-6.png'),
      fullPage: true
    });
    console.log('✅ screenshot-mobile-6.png gerado');
  });

  // Screenshots Desktop (apenas se viewport for >= 1280)
  test('7. Home - Desktop', async ({ page, viewport }) => {
    if (!viewport || viewport.width < 1280) {
      test.skip();
      return;
    }
    
    console.log('📸 Capturando Home (Desktop)...');
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-desktop-1.png'),
      fullPage: false // Apenas viewport
    });
    console.log('✅ screenshot-desktop-1.png gerado');
  });

  test('8. Marketplace - Desktop', async ({ page, viewport }) => {
    if (!viewport || viewport.width < 1280) {
      test.skip();
      return;
    }
    
    console.log('📸 Capturando Marketplace (Desktop)...');
    await page.goto('/produtos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-desktop-2.png'),
      fullPage: false
    });
    console.log('✅ screenshot-desktop-2.png gerado');
  });
});
