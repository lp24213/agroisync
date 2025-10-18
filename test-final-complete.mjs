import { chromium } from 'playwright';

const allPages = [
  // Páginas principais
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
  { name: 'Dashboard', url: 'https://agroisync.com/user-dashboard' },
  { name: 'Marketplace', url: 'https://agroisync.com/marketplace' },
  { name: 'AgroConecta', url: 'https://agroisync.com/agroconecta' },
  // Páginas de cadastro
  { name: 'Cadastro Geral', url: 'https://agroisync.com/signup/general' },
  { name: 'Cadastro Produto', url: 'https://agroisync.com/signup/product' },
  { name: 'Cadastro Frete', url: 'https://agroisync.com/signup/freight' },
  { name: 'Cadastro Loja', url: 'https://agroisync.com/signup/store' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ page: 'current', error: msg.text() });
    }
  });

  page.on('pageerror', error => {
    errors.push({ page: 'current', error: error.message });
  });

  console.log('🔍 TESTE FINAL COMPLETO - TODAS AS PÁGINAS\n');
  console.log('==========================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const pageInfo of allPages) {
    try {
      const errorsBeforeNav = errors.length;
      await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const errorsAfterNav = errors.length;
      const pageErrors = errorsAfterNav - errorsBeforeNav;
      
      if (pageErrors > 0) {
        console.log(`❌ ${pageInfo.name}: ${pageErrors} erro(s)`);
        errorCount++;
      } else {
        console.log(`✅ ${pageInfo.name}: OK`);
        successCount++;
      }
    } catch (error) {
      console.log(`❌ ${pageInfo.name}: ERRO AO NAVEGAR`);
      errorCount++;
    }
  }

  console.log('\n📊 RESULTADO FINAL:');
  console.log('===================');
  console.log(`✅ ${successCount} páginas SEM ERROS`);
  console.log(`❌ ${errorCount} páginas COM ERROS`);
  console.log(`📄 Total: ${allPages.length} páginas testadas`);
  
  if (successCount === allPages.length) {
    console.log('\n🎉🎉🎉 PERFEITO! TODAS AS PÁGINAS 100% FUNCIONANDO! 🎉🎉🎉');
  } else {
    console.log(`\n⚠️  ${errorCount} página(s) ainda precisa(m) de correção.`);
  }

  await browser.close();
})();

