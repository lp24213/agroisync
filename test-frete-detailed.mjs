import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiCalls = [];
  
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    
    if (url.includes('/api/')) {
      apiCalls.push({ url, status, method: response.request().method() });
      console.log(`🌐 API: ${response.request().method()} ${status} - ${url}`);
      
      if (status >= 400) {
        console.log(`❌ ERRO ${status}: ${url}`);
      }
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });

  try {
    console.log('🔍 Navegando para /frete...\n');
    await page.goto('https://agroisync.com/frete', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log('\n✅ Página carregada!\n');
    console.log('📊 RESUMO DAS CHAMADAS DE API:');
    console.log('================================');
    
    apiCalls.forEach(call => {
      const emoji = call.status >= 400 ? '❌' : '✅';
      console.log(`${emoji} ${call.method} ${call.status} - ${call.url}`);
    });
    
    await page.waitForTimeout(3000);
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }

  await browser.close();
})();

