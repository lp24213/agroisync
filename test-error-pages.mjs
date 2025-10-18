import { chromium } from 'playwright';

const errorPages = [
  { name: 'Tecnologia', url: 'https://agroisync.com/tecnologia' },
  { name: 'Marketplace', url: 'https://agroisync.com/marketplace' },
  { name: 'Cadastro Produto', url: 'https://agroisync.com/signup/product' }
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔍 INVESTIGANDO PÁGINAS COM ERROS\n');
  console.log('=================================\n');

  for (const pageInfo of errorPages) {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    try {
      console.log(`📄 ${pageInfo.name}: ${pageInfo.url}\n`);
      
      await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(3000);
      
      if (errors.length > 0) {
        console.log(`❌ ${errors.length} ERRO(S) ENCONTRADO(S):`);
        errors.forEach((err, idx) => {
          console.log(`   ${idx + 1}. ${err.substring(0, 200)}`);
        });
      } else {
        console.log('✅ Nenhum erro encontrado');
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
      
      // Limpar listeners
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
    } catch (error) {
      console.log(`❌ ERRO AO NAVEGAR: ${error.message}\n`);
    }
  }

  await browser.close();
})();

