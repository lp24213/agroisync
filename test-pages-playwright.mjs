import { chromium } from 'playwright';

const pages = [
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
  { name: 'AgroConecta', url: 'https://agroisync.com/agroconecta' }
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

  console.log('🔍 NAVEGANDO POR TODAS AS PÁGINAS...\n');

  for (const pageInfo of pages) {
    try {
      console.log(`📄 ${pageInfo.name}: ${pageInfo.url}`);
      
      const errorsBeforeNav = errors.length;
      await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const errorsAfterNav = errors.length;
      const pageErrors = errorsAfterNav - errorsBeforeNav;
      
      if (pageErrors > 0) {
        console.log(`   ❌ ${pageErrors} erros encontrados`);
      } else {
        console.log(`   ✅ Sem erros`);
      }
    } catch (error) {
      console.log(`   ❌ ERRO AO NAVEGAR: ${error.message}`);
      errors.push({ page: pageInfo.name, error: error.message });
    }
  }

  console.log('\n📊 RESUMO:');
  console.log(`Total de erros: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERROS ENCONTRADOS:');
    errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err.error}`);
    });
  } else {
    console.log('✅ NENHUM ERRO ENCONTRADO!');
  }

  await browser.close();
})();

