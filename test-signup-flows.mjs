import { chromium } from 'playwright';

const signupPages = [
  { name: 'Cadastro Geral', url: 'https://agroisync.com/signup/general' },
  { name: 'Cadastro Produto', url: 'https://agroisync.com/signup/product' },
  { name: 'Cadastro Frete', url: 'https://agroisync.com/signup/freight' },
  { name: 'Cadastro Loja', url: 'https://agroisync.com/signup/store' }
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`❌ ${response.status()} - ${response.url()}`);
    }
  });

  console.log('🔍 TESTANDO TODAS AS PÁGINAS DE CADASTRO...\n');

  for (const signup of signupPages) {
    try {
      console.log(`📝 ${signup.name}: ${signup.url}`);
      
      await page.goto(signup.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      
      // Verificar se a página carregou
      const title = await page.title();
      console.log(`   📄 Título: ${title}`);
      
      // Verificar se tem formulário
      const hasForm = await page.locator('form').count() > 0;
      console.log(`   ${hasForm ? '✅' : '❌'} Formulário encontrado: ${hasForm}`);
      
      // Verificar se tem campos de email/senha
      const hasEmailField = await page.locator('input[type="email"], input[name="email"]').count() > 0;
      const hasPasswordField = await page.locator('input[type="password"]').count() > 0;
      
      console.log(`   ${hasEmailField ? '⚠️' : '✅'} Campo de email: ${hasEmailField}`);
      console.log(`   ${hasPasswordField ? '⚠️' : '✅'} Campo de senha: ${hasPasswordField}`);
      
      // Verificar texto sobre planos
      const pageContent = await page.content();
      const hasPlanMention = pageContent.includes('plano') || pageContent.includes('Plano');
      console.log(`   ${hasPlanMention ? '✅' : '❌'} Menção a planos: ${hasPlanMention}`);
      
      results.push({
        name: signup.name,
        loaded: true,
        hasForm,
        hasEmailField,
        hasPasswordField,
        hasPlanMention
      });
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ ERRO: ${error.message}\n`);
      results.push({
        name: signup.name,
        loaded: false,
        error: error.message
      });
    }
  }

  console.log('\n📊 RESUMO DOS TESTES DE CADASTRO:');
  console.log('==================================\n');
  
  results.forEach(result => {
    console.log(`📝 ${result.name}:`);
    if (result.loaded) {
      console.log(`   ${result.hasForm ? '✅' : '❌'} Formulário funcionando`);
      console.log(`   ${result.hasEmailField ? '⚠️  TEM' : '✅ NÃO TEM'} campo de email (deveria ser depois do cadastro!)`);
      console.log(`   ${result.hasPasswordField ? '⚠️  TEM' : '✅ NÃO TEM'} campo de senha (deveria ser depois do cadastro!)`);
      console.log(`   ${result.hasPlanMention ? '✅' : '❌'} Conectado com planos`);
    } else {
      console.log(`   ❌ PÁGINA NÃO CARREGOU: ${result.error}`);
    }
    console.log('');
  });

  await browser.close();
})();

