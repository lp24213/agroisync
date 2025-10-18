import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const apiCalls = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ ${msg.text().substring(0, 100)}`);
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
    console.log('🔍 TESTE COMPLETO REAL DE CADASTRO\n');
    console.log('===================================\n');
    
    const testEmail = `cadastro_teste_${Date.now()}@agroisync.com`;
    const testPassword = 'SenhaSegura123!';
    const cpf = '05287513100';
    const cep = '78560000';
    
    // ETAPA 1: REGISTER (Email e Senha)
    console.log('1️⃣ ETAPA 1: Criando conta (Email + Senha)...\n');
    await page.goto('https://agroisync.com/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Preencher email
    await page.fill('input[type="email"]', testEmail);
    console.log(`   ✅ Email preenchido: ${testEmail}`);
    
    // Preencher senha
    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length > 0) {
      await passwordFields[0].fill(testPassword);
      console.log(`   ✅ Senha preenchida`);
    }
    if (passwordFields.length > 1) {
      await passwordFields[1].fill(testPassword);
      console.log(`   ✅ Confirmação de senha preenchida`);
    }
    
    console.log('\n   ⏳ Aguardando Turnstile verificar (10 segundos)...\n');
    await page.waitForTimeout(10000);
    
    // Verificar se botão está habilitado
    const submitButton = await page.locator('button[type="submit"]').first();
    const isDisabled = await submitButton.getAttribute('disabled');
    
    if (isDisabled === null) {
      console.log('   ✅ Botão habilitado! Clicando...\n');
      await submitButton.click();
    } else {
      console.log('   ❌ Botão ainda DESABILITADO (Turnstile não verificou)\n');
      console.log('   ℹ️ PULANDO teste automático - necessário verificação manual do Turnstile\n');
      return;
    }
    
    // Aguardar redirecionamento
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log(`   📍 URL atual: ${currentUrl}\n`);
    
    // ETAPA 2: ESCOLHER TIPO (Produtor, Frete ou Loja)
    console.log('2️⃣ ETAPA 2: Verificando redirecionamento para tipo de usuário...\n');
    
    if (currentUrl.includes('signup')) {
      console.log('   ✅ Redirecionado para completar cadastro!');
      console.log(`   📍 Tipo: ${currentUrl.split('/').pop()}\n`);
      
      // ETAPA 3: PREENCHER DADOS COMPLETOS
      console.log('3️⃣ ETAPA 3: Preenchendo dados completos (CPF, CEP, etc)...\n');
      
      // Verificar campos disponíveis
      const inputs = await page.locator('input').all();
      console.log(`   📝 Total de campos: ${inputs.length}`);
      
      // Tentar preencher CPF
      const cpfField = await page.locator('input[name="cpf"], input[placeholder*="CPF"]').count();
      if (cpfField > 0) {
        await page.fill('input[name="cpf"], input[placeholder*="CPF"]', cpf);
        console.log(`   ✅ CPF preenchido: ${cpf}`);
      }
      
      // Tentar preencher CEP
      const cepField = await page.locator('input[name="cep"], input[placeholder*="CEP"]').count();
      if (cepField > 0) {
        await page.fill('input[name="cep"], input[placeholder*="CEP"]', cep);
        console.log(`   ✅ CEP preenchido: ${cep}`);
      }
      
      // Tentar preencher Nome
      const nameField = await page.locator('input[name="name"], input[placeholder*="Nome"]').count();
      if (nameField > 0) {
        await page.fill('input[name="name"], input[placeholder*="Nome"]', 'Luis Paulo Oliveira');
        console.log(`   ✅ Nome preenchido`);
      }
      
      // Tentar preencher Telefone
      const phoneField = await page.locator('input[name="phone"], input[placeholder*="Telefone"]').count();
      if (phoneField > 0) {
        await page.fill('input[name="phone"], input[placeholder*="Telefone"]', '66992362830');
        console.log(`   ✅ Telefone preenchido`);
      }
      
      console.log('\n   ⏳ Aguardando 3 segundos para verificar campos...\n');
      await page.waitForTimeout(3000);
      
      // Verificar se tem botão de finalizar
      const submitButton = await page.locator('button[type="submit"], button:has-text("Finalizar"), button:has-text("Concluir"), button:has-text("Salvar")').count();
      console.log(`   ${submitButton > 0 ? '✅' : '❌'} Botão de finalizar encontrado: ${submitButton}\n`);
      
    } else if (currentUrl.includes('dashboard')) {
      console.log('   ✅ Redirecionado DIRETO para o dashboard!\n');
    } else if (currentUrl.includes('plans')) {
      console.log('   ⚠️ Redirecionado para PLANOS (precisa escolher plano)\n');
    } else {
      console.log(`   ⚠️ Redirecionado para: ${currentUrl}\n`);
    }
    
    console.log('\n📊 ANÁLISE FINAL:');
    console.log('=================');
    console.log(`Total de erros: ${errors.length}`);
    console.log(`Total de APIs chamadas: ${apiCalls.length}`);
    
    if (apiCalls.length > 0) {
      console.log('\n🌐 Chamadas de API:');
      apiCalls.forEach(call => {
        const emoji = call.status >= 400 ? '❌' : '✅';
        console.log(`${emoji} ${call.method} ${call.status} - ${call.url.replace('https://agroisync.com', '')}`);
      });
    }
    
    console.log('\n⏳ Mantendo navegador aberto por 10 segundos...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }

  await browser.close();
})();

