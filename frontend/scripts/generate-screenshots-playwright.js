/**
 * Script para gerar screenshots automáticos usando Playwright
 * Executar: npx playwright test scripts/screenshots.spec.js --project=chromium-mobile
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '../public');

// Garantir que o diretório existe
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('Screenshots para Lojas', () => {
  test.beforeEach(async ({ page }) => {
    // Aguardar página carregar completamente
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Aguardar animações
  });

  test('Screenshot - Home/Mobile', async ({ page }) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-1.png'),
      fullPage: true
    });
  });

  test('Screenshot - Marketplace/Mobile', async ({ page }) => {
    await page.goto('/produtos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-2.png'),
      fullPage: true
    });
  });

  test('Screenshot - AgroConecta/Mobile', async ({ page }) => {
    await page.goto('/agroconecta');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-3.png'),
      fullPage: true
    });
  });

  test('Screenshot - Clima e Insumos/Mobile', async ({ page }) => {
    await page.goto('/clima-insumos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Página de clima pode demorar mais
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-4.png'),
      fullPage: true
    });
  });

  test('Screenshot - Dashboard (se logado)/Mobile', async ({ page }) => {
    // Tentar acessar dashboard (pode redirecionar para login)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-5.png'),
      fullPage: true
    });
  });

  test('Screenshot - Planos/Mobile', async ({ page }) => {
    await page.goto('/planos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screenshot-mobile-6.png'),
      fullPage: true
    });
  });

  // Screenshots Desktop
  test('Screenshot - Home/Desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 1280) {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'screenshot-desktop-1.png'),
        fullPage: false // Apenas viewport no desktop
      });
    }
  });

  test('Screenshot - Marketplace/Desktop', async ({ page, viewport }) => {
    if (viewport && viewport.width >= 1280) {
      await page.goto('/produtos');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'screenshot-desktop-2.png'),
        fullPage: false
      });
    }
  });
});
