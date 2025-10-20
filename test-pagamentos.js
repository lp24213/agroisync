// TESTE COMPLETO DE PAGAMENTOS - PIX, BOLETO, CARTÃO
const puppeteer = require('puppeteer');

const SITE_URL = 'https://agroisync.com';
const EMAIL = 'luispaulo-de-oliveira@hotmail.com';
const PASSWORD = 'Th@ys1522';

let browser, page, authToken;

async function log(type, msg) {
  const colors = {
    success: '\x1b[32m✅',
    error: '\x1b[31m❌',
    warning: '\x1b[33m⚠️',
    info: '\x1b[36mℹ️'
  };
  console.log(`${colors[type] || colors.info} ${msg}\x1b[0m`);
}

async function login() {
  log('info', '1️⃣ Fazendo login...');
  const response = await fetch(`${SITE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  
  const data = await response.json();
  if (data.success && data.data?.token) {
    authToken = data.data.token;
    log('success', `Login OK`);
    return true;
  }
  log('error', 'Login falhou');
  return false;
}

async function testPlansList() {
  log('info', '\n2️⃣ Testando API de Planos...');
  const response = await fetch(`${SITE_URL}/api/plans`);
  const data = await response.json();
  
  if (data.success && data.data?.plans) {
    log('success', `API Planos OK - ${data.data.plans.length} planos encontrados`);
    return data.data.plans;
  }
  log('error', 'API Planos falhou');
  return [];
}

async function testPIXPayment(planSlug) {
  log('info', '\n3️⃣ Testando Pagamento PIX...');
  
  try {
    const response = await fetch(`${SITE_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planSlug: planSlug,
        billingCycle: 'monthly',
        paymentMethod: 'pix'
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.qrCode) {
      log('success', 'Checkout PIX criado!');
      log('info', `  QR Code: ${data.qrCode.substring(0, 50)}...`);
      log('info', `  Valor: R$ ${data.amount}`);
      log('info', `  Expira em: ${data.expiresAt || '15 minutos'}`);
      return true;
    } else {
      log('warning', `Checkout PIX: ${data.error || 'Sem QR Code'}`);
      return false;
    }
  } catch (error) {
    log('error', `Erro ao criar PIX: ${error.message}`);
    return false;
  }
}

async function testBoletoPayment(planSlug) {
  log('info', '\n4️⃣ Testando Pagamento Boleto...');
  
  try {
    const response = await fetch(`${SITE_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planSlug: planSlug,
        billingCycle: 'monthly',
        paymentMethod: 'boleto'
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.barcode) {
      log('success', 'Checkout Boleto criado!');
      log('info', `  Código de barras: ${data.barcodeNumber || data.barcode}`);
      log('info', `  Valor: R$ ${data.amount}`);
      log('info', `  Vencimento: ${data.dueDate || '3 dias'}`);
      return true;
    } else {
      log('warning', `Checkout Boleto: ${data.error || 'Sem código de barras'}`);
      return false;
    }
  } catch (error) {
    log('error', `Erro ao criar Boleto: ${error.message}`);
    return false;
  }
}

async function testCardPaymentPage() {
  log('info', '\n5️⃣ Testando Página de Cartão...');
  
  await page.goto(SITE_URL);
  await page.evaluate((token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
  }, authToken);
  
  try {
    await page.goto(`${SITE_URL}/payment/credit-card`, { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    await page.waitForTimeout(2000);
    
    // Verificar se tem formulário de cartão
    const hasCardForm = await page.evaluate(() => {
      return document.body.textContent.includes('Cartão') || 
             document.body.textContent.includes('Número') ||
             document.querySelector('input[placeholder*="cartão"]') !== null;
    });
    
    if (hasCardForm) {
      log('success', 'Página de Cartão carregou');
      
      // Verificar se tem campos
      const hasCardNumber = await page.$('input[name*="card"], input[placeholder*="cartão"]');
      const hasExpiry = await page.$('input[name*="expir"], input[placeholder*="válid"]');
      const hasCVV = await page.$('input[name*="cvv"], input[placeholder*="seguran"]');
      
      if (hasCardNumber) log('success', '  Campo número do cartão presente');
      if (hasExpiry) log('success', '  Campo validade presente');
      if (hasCVV) log('success', '  Campo CVV presente');
      
      await page.screenshot({ path: 'payment-card-test.png' });
      log('success', 'Screenshot salvo: payment-card-test.png');
      
      return true;
    } else {
      log('warning', 'Página de Cartão sem formulário visível');
      return false;
    }
  } catch (error) {
    log('warning', `Página de Cartão: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  💳 TESTE DE PAGAMENTOS - AGROISYNC');
  console.log('════════════════════════════════════════════════════════');
  console.log('\n');
  
  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    
    // 1. Login
    const loginOk = await login();
    if (!loginOk) return;
    
    // 2. Listar planos
    const plans = await testPlansList();
    const testPlan = plans.find(p => p.slug && p.slug.includes('pro')) || plans[0];
    const planSlug = testPlan?.slug || 'freteiro-pro';
    
    log('info', `\n📋 Usando plano de teste: ${planSlug}`);
    
    // 3. PIX
    await testPIXPayment(planSlug);
    
    // 4. Boleto
    await testBoletoPayment(planSlug);
    
    // 5. Cartão
    await testCardPaymentPage();
    
    console.log('\n\n');
    console.log('════════════════════════════════════════════════════════');
    console.log('  📊 RESUMO DOS TESTES DE PAGAMENTO');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n');
    console.log('✅ Testes concluídos!');
    console.log('\n📝 Observações:');
    console.log('  - PIX: Verifica se gera QR Code');
    console.log('  - Boleto: Verifica se gera código de barras');
    console.log('  - Cartão: Verifica se página tem formulário');
    console.log('\n⚠️  Pagamentos reais não foram processados (apenas teste)');
    console.log('\n');
    
  } catch (error) {
    log('error', `Erro fatal: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

runTests();

