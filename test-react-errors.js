const puppeteer = require('puppeteer');

async function findReactErrors() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  let reactErrors = [];
  
  // Capturar erros detalhados
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error') || text.includes('❌')) {
      console.log(`🔴 ${text}`);
      reactErrors.push(text);
    }
  });

  page.on('pageerror', error => {
    console.log(`🔴 ERRO DE PÁGINA: ${error.message}`);
    console.log(`📍 Stack: ${error.stack}`);
    reactErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  console.log('🔍 Acessando agroisync.com...\n');
  
  await page.goto('https://agroisync.com', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });

  await page.waitForTimeout(5000);

  // Verificar se há erros de React no console
  const consoleErrors = await page.evaluate(() => {
    // Pegar mensagens de erro do console
    const errors = window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ || [];
    return errors;
  });

  console.log('\n📊 ERROS ENCONTRADOS:\n');
  console.log(JSON.stringify(reactErrors, null, 2));

  await browser.close();
}

findReactErrors().catch(console.error);

