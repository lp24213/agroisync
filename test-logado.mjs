import { chromium } from 'playwright';

const authenticatedPages = [
  { name: 'Dashboard', url: 'https://agroisync.com/user-dashboard' },
  { name: 'Crypto Dashboard', url: 'https://agroisync.com/crypto-dashboard' },
  { name: 'Mensagens', url: 'https://agroisync.com/messaging' },
  { name: 'Cadastro Produto', url: 'https://agroisync.com/signup/product' },
  { name: 'Cadastro Frete', url: 'https://agroisync.com/signup/freight' },
  { name: 'Cadastro Loja', url: 'https://agroisync.com/signup/store' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const apiCalls = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      apiCalls.push({ 
        url: url.replace('https://agroisync.com', ''), 
        status: response.status(),
        method: response.request().method()
      });
    }
  });

  console.log('🔍 TESTE COMPLETO - USUÁRIO LOGADO\n');
  console.log('==================================\n');

  // Fazer login primeiro
  console.log('1️⃣ Fazendo login...\n');
  
  try {
    await page.goto('https://agroisync.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Preencher credenciais
    await page.fill('input[type="email"]', 'luispaulo-de-oliveira@hotmail.com');
    await page.fill('input[type="password"]', 'Th@Ys1522');
    
    console.log('   📧 Email: luispaulo-de-oliveira@hotmail.com');
    console.log('   🔒 Senha: ********\n');
    
    // Aguardar Turnstile
    console.log('   ⏳ Aguardando Turnstile (10 segundos)...\n');
    await page.waitForTimeout(10000);
    
    const submitButton = await page.locator('button[type="submit"]').first();
    const isDisabled = await submitButton.getAttribute('disabled');
    
    if (isDisabled === null) {
      console.log('   ✅ Botão habilitado! Fazendo login...\n');
      await submitButton.click();
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log(`   📍 URL após login: ${currentUrl}\n`);
      
      if (currentUrl.includes('dashboard') || currentUrl.includes('plans')) {
        console.log('   ✅ Login bem-sucedido!\n');
      } else {
        console.log('   ⚠️ Redirecionado para: ' + currentUrl + '\n');
      }
    } else {
      console.log('   ⚠️ Turnstile não verificou - pulando teste de login\n');
      await browser.close();
      return;
    }
    
  } catch (error) {
    console.log(`   ❌ Erro no login: ${error.message}\n`);
    await browser.close();
    return;
  }

  // Testar páginas autenticadas
  console.log('2️⃣ Testando páginas autenticadas...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const pageInfo of authenticatedPages) {
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
      console.log(`❌ ${pageInfo.name}: TIMEOUT`);
      errorCount++;
    }
  }

  console.log('\n📊 RESULTADO - USUÁRIO LOGADO:');
  console.log('===============================');
  console.log(`✅ ${successCount} páginas OK`);
  console.log(`❌ ${errorCount} páginas COM ERRO`);
  console.log(`📄 Total: ${authenticatedPages.length} páginas testadas`);
  
  console.log('\n🌐 APIs chamadas:');
  const successfulApis = apiCalls.filter(a => a.status < 400).length;
  const failedApis = apiCalls.filter(a => a.status >= 400).length;
  console.log(`✅ ${successfulApis} sucesso`);
  console.log(`❌ ${failedApis} erro\n`);
  
  if (failedApis > 0) {
    console.log('❌ APIs com erro:');
    apiCalls.filter(a => a.status >= 400).slice(0, 10).forEach(api => {
      console.log(`   ${api.method} ${api.status} - ${api.url}`);
    });
  }

  await browser.close();
})();

