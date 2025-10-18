import { chromium } from 'playwright';

const publicPages = [
  { name: 'Home', url: 'https://agroisync.com/' },
  { name: 'Login', url: 'https://agroisync.com/login' },
  { name: 'Register', url: 'https://agroisync.com/register' },
  { name: 'Produtos', url: 'https://agroisync.com/produtos' },
  { name: 'Fretes', url: 'https://agroisync.com/frete' },
  { name: 'Loja', url: 'https://agroisync.com/loja' },
  { name: 'Planos', url: 'https://agroisync.com/planos' },
  { name: 'Sobre', url: 'https://agroisync.com/sobre' },
  { name: 'Parcerias', url: 'https://agroisync.com/partnerships' },
  { name: 'Tecnologia', url: 'https://agroisync.com/tecnologia' },
  { name: 'Marketplace', url: 'https://agroisync.com/marketplace' },
  { name: 'AgroConecta', url: 'https://agroisync.com/agroconecta' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const apiErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ page: 'current', error: msg.text() });
    }
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('/api/')) {
      apiErrors.push({ url: response.url(), status: response.status() });
    }
  });

  console.log('🔍 TESTE COMPLETO - SEM LOGIN (Visitante)\n');
  console.log('=========================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const pageInfo of publicPages) {
    try {
      const errorsBeforeNav = errors.length;
      const apiErrorsBefore = apiErrors.length;
      
      await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const errorsAfterNav = errors.length;
      const apiErrorsAfter = apiErrors.length;
      const pageErrors = errorsAfterNav - errorsBeforeNav;
      const pageApiErrors = apiErrorsAfter - apiErrorsBefore;
      
      if (pageErrors > 0 || pageApiErrors > 0) {
        console.log(`❌ ${pageInfo.name}: ${pageErrors} erro(s) console, ${pageApiErrors} erro(s) API`);
        errorCount++;
      } else {
        console.log(`✅ ${pageInfo.name}: OK`);
        successCount++;
      }
    } catch (error) {
      console.log(`❌ ${pageInfo.name}: TIMEOUT/ERRO`);
      errorCount++;
    }
  }

  console.log('\n📊 RESULTADO - VISITANTE SEM LOGIN:');
  console.log('====================================');
  console.log(`✅ ${successCount} páginas OK`);
  console.log(`❌ ${errorCount} páginas COM ERRO`);
  console.log(`📄 Total: ${publicPages.length} páginas testadas`);
  
  if (apiErrors.length > 0) {
    console.log(`\n⚠️  Erros de API encontrados (esperados para visitante):`);
    apiErrors.forEach(err => {
      console.log(`   ${err.status} - ${err.url.replace('https://agroisync.com', '')}`);
    });
  }
  
  if (successCount === publicPages.length) {
    console.log('\n🎉 PERFEITO! Todas as páginas públicas funcionando para visitantes!\n');
  }

  await browser.close();
})();

