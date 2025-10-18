import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const apiCalls = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text().substring(0, 150)}`);
      errors.push(msg.text());
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      const status = response.status();
      apiCalls.push({ url, status, method: response.request().method() });
      console.log(`🌐 ${response.request().method()} ${status} - ${url.replace('https://agroisync.com', '')}`);
    }
  });

  try {
    console.log('🔍 TESTE COMPLETO DO FLUXO DE CADASTRO\n');
    console.log('======================================\n');
    
    // 1. IR PARA A PÁGINA DE CADASTRO
    console.log('1️⃣ Navegando para página de Register...\n');
    await page.goto('https://agroisync.com/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // 2. PREENCHER EMAIL E SENHA
    console.log('2️⃣ Preenchendo Email e Senha...\n');
    
    const hasEmailField = await page.locator('input[type="email"]').count() > 0;
    const hasPasswordField = await page.locator('input[type="password"]').count() > 0;
    
    console.log(`   ${hasEmailField ? '✅' : '❌'} Campo de email encontrado`);
    console.log(`   ${hasPasswordField ? '✅' : '❌'} Campo de senha encontrado\n`);
    
    if (hasEmailField && hasPasswordField) {
      const testEmail = `test_${Date.now()}@agroisync.com`;
      const testPassword = 'TestPassword123!';
      
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      
      console.log(`   📧 Email: ${testEmail}`);
      console.log(`   🔒 Senha: ${testPassword}\n`);
      
      // Verificar se tem botão de submit
      const submitButtons = await page.locator('button[type="submit"]').count();
      console.log(`   ${submitButtons > 0 ? '✅' : '❌'} Botão de submit encontrado: ${submitButtons}\n`);
    }
    
    // 3. VERIFICAR SE HÁ ESCOLHA DE TIPO DE USUÁRIO
    console.log('3️⃣ Verificando tipos de usuário disponíveis...\n');
    
    const pageContent = await page.content();
    const hasProductOption = pageContent.includes('Produtor') || pageContent.includes('Produto');
    const hasFreightOption = pageContent.includes('Transportador') || pageContent.includes('Frete');
    const hasStoreOption = pageContent.includes('Loja') || pageContent.includes('Vendedor');
    
    console.log(`   ${hasProductOption ? '✅' : '❌'} Opção de Produtor/Produto`);
    console.log(`   ${hasFreightOption ? '✅' : '❌'} Opção de Transportador/Frete`);
    console.log(`   ${hasStoreOption ? '✅' : '❌'} Opção de Loja/Vendedor\n`);
    
    // 4. TESTAR PÁGINA DE TECNOLOGIA
    console.log('4️⃣ Testando página de Tecnologia (Cripto)...\n');
    await page.goto('https://agroisync.com/tecnologia', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const hasCryptoForm = await page.locator('form').count() > 0;
    const hasWalletInput = await page.locator('input').count() > 0;
    
    console.log(`   ${hasCryptoForm ? '✅' : '❌'} Formulário de cripto encontrado`);
    console.log(`   ${hasWalletInput ? '✅' : '❌'} Campo de carteira encontrado`);
    
    const techContent = await page.content();
    const hasMetaMaskMention = techContent.includes('MetaMask') || techContent.includes('metamask');
    const hasBlockchainMention = techContent.includes('blockchain') || techContent.includes('Blockchain');
    
    console.log(`   ${hasMetaMaskMention ? '✅' : '❌'} Menção a MetaMask`);
    console.log(`   ${hasBlockchainMention ? '✅' : '❌'} Menção a Blockchain\n`);
    
    console.log('\n📊 RESUMO FINAL:');
    console.log('================');
    console.log(`Total de erros capturados: ${errors.length}`);
    console.log(`Total de chamadas API: ${apiCalls.length}`);
    
    const failedCalls = apiCalls.filter(c => c.status >= 400);
    if (failedCalls.length > 0) {
      console.log(`\n❌ ${failedCalls.length} chamadas de API com erro:`);
      failedCalls.forEach(call => {
        console.log(`   ${call.method} ${call.status} - ${call.url}`);
      });
    } else {
      console.log('\n✅ Todas as chamadas de API com sucesso!');
    }
    
    await page.waitForTimeout(3000);
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }

  await browser.close();
})();

