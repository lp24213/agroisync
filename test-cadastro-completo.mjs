import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
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
      if (status >= 200 && status < 300) {
        console.log(`✅ ${response.request().method()} ${status} - ${url.replace('https://agroisync.com', '')}`);
      } else if (status >= 400) {
        console.log(`❌ ${response.request().method()} ${status} - ${url.replace('https://agroisync.com', '')}`);
      }
    }
  });

  console.log('🔍 TESTE COMPLETO - CADASTRO E SALVAMENTO NO BANCO\n');
  console.log('==================================================\n');
  
  const testEmail = `teste_completo_${Date.now()}@agroisync.com`;
  const testPassword = 'SenhaSegura123!';
  const cpf = '05287513100';
  const cep = '78560000';

  try {
    // ETAPA 1: REGISTER
    console.log('1️⃣ ETAPA 1: Cadastro de Email e Senha\n');
    console.log('   📧 Email: ' + testEmail);
    console.log('   🔒 Senha: ' + testPassword);
    console.log('   Navegando para /register...\n');
    
    await page.goto('https://agroisync.com/register', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    await page.fill('input[type="email"]', testEmail);
    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length > 0) await passwordFields[0].fill(testPassword);
    if (passwordFields.length > 1) await passwordFields[1].fill(testPassword);
    
    console.log('   ✅ Campos preenchidos');
    console.log('   ⏳ Aguardando Turnstile (10s)...\n');
    await page.waitForTimeout(10000);
    
    const submitButton = await page.locator('button[type="submit"]').first();
    const isDisabled = await submitButton.getAttribute('disabled');
    
    if (isDisabled !== null) {
      console.log('   ⚠️ Turnstile não verificou - pulando teste automático');
      console.log('   ℹ️ Para testar manualmente, use as credenciais acima\n');
      await page.waitForTimeout(5000);
      await browser.close();
      return;
    }
    
    console.log('   🔘 Clicando em cadastrar...\n');
    await submitButton.click();
    await page.waitForTimeout(5000);
    
    const urlAfterRegister = page.url();
    console.log(`   📍 URL após cadastro: ${urlAfterRegister}\n`);
    
    // ETAPA 2: Verificar para onde foi redirecionado
    console.log('2️⃣ ETAPA 2: Verificando redirecionamento\n');
    
    if (urlAfterRegister.includes('signup')) {
      console.log('   ✅ Redirecionado para completar perfil!');
      const tipoUsuario = urlAfterRegister.split('/').pop();
      console.log(`   📋 Tipo: ${tipoUsuario}\n`);
      
      // ETAPA 3: Preencher dados completos
      console.log('3️⃣ ETAPA 3: Preenchendo dados completos\n');
      
      // Verificar e preencher CPF
      const cpfField = await page.locator('input[name="cpf"], input[placeholder*="CPF"]').count();
      if (cpfField > 0) {
        await page.locator('input[name="cpf"], input[placeholder*="CPF"]').first().fill(cpf);
        console.log(`   ✅ CPF: ${cpf}`);
      } else {
        console.log(`   ⚠️ Campo CPF não encontrado`);
      }
      
      // Verificar e preencher CEP
      const cepField = await page.locator('input[name="cep"], input[placeholder*="CEP"]').count();
      if (cepField > 0) {
        await page.locator('input[name="cep"], input[placeholder*="CEP"]').first().fill(cep);
        console.log(`   ✅ CEP: ${cep}`);
        await page.waitForTimeout(2000); // Aguardar busca de endereço
      } else {
        console.log(`   ⚠️ Campo CEP não encontrado`);
      }
      
      // Nome
      const nameField = await page.locator('input[name="name"], input[placeholder*="Nome"]').count();
      if (nameField > 0) {
        await page.locator('input[name="name"], input[placeholder*="Nome"]').first().fill('Luis Paulo Oliveira');
        console.log(`   ✅ Nome: Luis Paulo Oliveira`);
      }
      
      // Telefone
      const phoneField = await page.locator('input[name="phone"], input[placeholder*="Telefone"], input[placeholder*="Celular"]').count();
      if (phoneField > 0) {
        await page.locator('input[name="phone"], input[placeholder*="Telefone"], input[placeholder*="Celular"]').first().fill('66992362830');
        console.log(`   ✅ Telefone: (66) 99236-2830`);
      }
      
      // Se for frete, preencher dados do veículo
      if (tipoUsuario === 'freight') {
        console.log('\n   🚛 Preenchendo dados do veículo...');
        
        const placaField = await page.locator('input[name="licensePlate"]').count();
        if (placaField > 0) {
          await page.fill('input[name="licensePlate"]', 'ABC1D23');
          console.log('   ✅ Placa: ABC1D23');
        }
        
        const modeloField = await page.locator('input[name="vehicleModel"]').count();
        if (modeloField > 0) {
          await page.fill('input[name="vehicleModel"]', 'Scania R440');
          console.log('   ✅ Modelo: Scania R440');
        }
        
        const marcaField = await page.locator('select[name="vehicleBrand"]').count();
        if (marcaField > 0) {
          await page.selectOption('select[name="vehicleBrand"]', 'Scania');
          console.log('   ✅ Marca: Scania');
        }
        
        const anoField = await page.locator('input[name="vehicleYear"]').count();
        if (anoField > 0) {
          await page.fill('input[name="vehicleYear"]', '2020');
          console.log('   ✅ Ano: 2020');
        }
      }
      
      console.log('\n   ⏳ Aguardando 3 segundos...\n');
      await page.waitForTimeout(3000);
      
      // Procurar botão de finalizar
      const finalizeButton = await page.locator('button[type="submit"], button:has-text("Finalizar"), button:has-text("Concluir"), button:has-text("Salvar")').count();
      console.log(`   ${finalizeButton > 0 ? '✅' : '❌'} Botão de finalizar encontrado: ${finalizeButton}\n`);
      
      if (finalizeButton > 0) {
        console.log('   🔘 Tentando finalizar cadastro...\n');
        await page.locator('button[type="submit"], button:has-text("Finalizar"), button:has-text("Concluir"), button:has-text("Salvar")').first().click();
        await page.waitForTimeout(5000);
        
        const finalUrl = page.url();
        console.log(`   📍 URL final: ${finalUrl}\n`);
        
        if (finalUrl.includes('dashboard')) {
          console.log('   ✅ Redirecionado para dashboard - CADASTRO COMPLETO!\n');
        } else {
          console.log(`   ⚠️ Redirecionado para: ${finalUrl}\n`);
        }
      }
      
    } else if (urlAfterRegister.includes('dashboard')) {
      console.log('   ✅ Redirecionado DIRETO para dashboard!\n');
    } else if (urlAfterRegister.includes('plans')) {
      console.log('   📋 Redirecionado para PLANOS - precisa escolher plano\n');
    }
    
    console.log('\n📊 ANÁLISE FINAL:');
    console.log('=================');
    console.log(`Total de erros: ${errors.length}`);
    console.log(`Total de APIs: ${apiCalls.length}`);
    
    const successApis = apiCalls.filter(a => a.status >= 200 && a.status < 300);
    const errorApis = apiCalls.filter(a => a.status >= 400);
    
    console.log(`✅ APIs com sucesso: ${successApis.length}`);
    console.log(`❌ APIs com erro: ${errorApis.length}\n`);
    
    if (errorApis.length > 0) {
      console.log('❌ APIs com erro:');
      errorApis.slice(0, 5).forEach(api => {
        console.log(`   ${api.method} ${api.status} - ${api.url}`);
      });
    }
    
    console.log('\n⏳ Mantendo navegador aberto por 5 segundos...\n');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }

  await browser.close();
})();

