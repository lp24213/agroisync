import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const consoleMessages = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      errors.push({ error: msg.text() });
    }
  });

  page.on('pageerror', error => {
    errors.push({ error: error.message });
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`❌ ${response.status()} - ${response.url()}`);
    }
  });

  try {
    console.log('🔍 Navegando para /login...');
    await page.goto('https://agroisync.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log('✅ Página carregada!');
    console.log('\n📊 Console Messages:');
    consoleMessages.slice(-10).forEach(msg => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });
    
    console.log('\n❌ Errors:');
    errors.forEach(err => {
      console.log(`  - ${err.error}`);
    });
    
    await page.waitForTimeout(5000);
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }

  await browser.close();
})();

