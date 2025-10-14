// @ts-check
const { chromium } = require('playwright');
const assert = require('assert');

/**
 * Testes end-to-end do AgroSync
 */
(async () => {
  console.log('🧪 Iniciando testes end-to-end');
  console.log('----------------------------');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Verificando acesso à página inicial');
    await page.goto('https://agroisync.com');
    await page.waitForSelector('text=AgroSync');
    console.log('✅ Página inicial carregada');

    console.log('\n2. Testando registro de usuário');
    await page.click('text=Registrar');
    await page.waitForSelector('form');
    
    await page.fill('input[name=name]', 'Teste E2E');
    await page.fill('input[name=email]', `teste${Date.now()}@teste.com`);
    await page.fill('input[name=password]', 'Teste@123');
    
    // Aguardar Turnstile
    await page.waitForSelector('iframe[src*="challenges.cloudflare.com"]');
    await page.waitForTimeout(3000);
    
    await page.click('button[type=submit]');
    await page.waitForSelector('text=Dashboard');
    console.log('✅ Registro realizado');

    console.log('\n3. Testando logout');
    await page.click('text=Sair');
    await page.waitForSelector('text=Login');
    console.log('✅ Logout realizado');

    console.log('\n4. Testando login');
    await page.fill('input[name=email]', 'teste@teste.com');
    await page.fill('input[name=password]', 'Teste@123');
    
    // Aguardar Turnstile
    await page.waitForSelector('iframe[src*="challenges.cloudflare.com"]');
    await page.waitForTimeout(3000);
    
    await page.click('button[type=submit]');
    await page.waitForSelector('text=Dashboard');
    console.log('✅ Login realizado');

    console.log('\n5. Testando recuperação de senha');
    await page.click('text=Sair');
    await page.waitForSelector('text=Login');
    await page.click('text=Esqueceu sua senha?');
    
    await page.fill('input[name=email]', 'teste@teste.com');
    
    // Aguardar Turnstile
    await page.waitForSelector('iframe[src*="challenges.cloudflare.com"]');
    await page.waitForTimeout(3000);
    
    await page.click('button[type=submit]');
    await page.waitForSelector('text=E-mail enviado');
    console.log('✅ Recuperação de senha solicitada');

    console.log('\n6. Testando loja');
    await page.click('text=Loja');
    await page.waitForSelector('text=Produtos');
    console.log('✅ Loja carregada');

    console.log('\n7. Testando mensagens');
    await page.click('text=Mensagens');
    await page.waitForSelector('text=Chat');
    console.log('✅ Chat carregado');

    console.log('\n✅ Todos os testes passaram!');
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error);
    throw error;
  } finally {
    await browser.close();
  }
})();