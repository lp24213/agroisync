// TESTE DE FLUXOS CRÍTICOS - DASHBOARD, LIMITES, PAGAMENTOS
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
  log('info', '\n═════════════════════════════════════');
  log('info', '1️⃣ TESTE: LOGIN E OBTER TOKEN');
  log('info', '═════════════════════════════════════\n');
  
  const response = await fetch(`${SITE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  
  const data = await response.json();
  
  if (data.success && data.data?.token) {
    authToken = data.data.token;
    log('success', `Login OK - Token: ${authToken.substring(0, 30)}...`);
    return true;
  } else {
    log('error', 'Login falhou');
    return false;
  }
}

async function testDashboard() {
  log('info', '\n═════════════════════════════════════');
  log('info', '2️⃣ TESTE: DASHBOARD COM DADOS');
  log('info', '═════════════════════════════════════\n');
  
  await page.goto(SITE_URL);
  await page.evaluate((token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
  }, authToken);
  
  await page.goto(`${SITE_URL}/user-dashboard`, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);
  
  // Verificar se mostra nome do usuário
  const hasUserName = await page.evaluate(() => {
    return document.body.textContent.includes('Luis') || 
           document.body.textContent.includes('Paulo');
  });
  
  if (hasUserName) {
    log('success', 'Dashboard mostrando nome do usuário');
  } else {
    log('warning', 'Dashboard pode não estar mostrando dados');
  }
  
  // Verificar se tem botões de ação
  const hasActions = await page.$$('button, a[href*="signup"]');
  if (hasActions.length > 0) {
    log('success', `Dashboard tem ${hasActions.length} botões/links`);
  }
  
  // Screenshot
  await page.screenshot({ path: 'dashboard-test.png', fullPage: true });
  log('success', 'Screenshot salvo: dashboard-test.png');
}

async function testLimits() {
  log('info', '\n═════════════════════════════════════');
  log('info', '3️⃣ TESTE: LIMITES DO USUÁRIO');
  log('info', '═════════════════════════════════════\n');
  
  const response = await fetch(`${SITE_URL}/api/user/limits`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  
  if (data.success) {
    log('success', 'API de limites OK');
    log('info', `  Tipo: ${data.data.business_type}`);
    log('info', `  Plano: ${data.data.plan}`);
    log('info', `  Produtos: ${data.data.current.products}/${data.data.limits.products}`);
    log('info', `  Fretes: ${data.data.current.freights}/${data.data.limits.freights}`);
    log('info', `  Pode adicionar produto? ${data.data.canAddProduct ? 'SIM' : 'NÃO'}`);
    log('info', `  Pode adicionar frete? ${data.data.canAddFreight ? 'SIM' : 'NÃO'}`);
    
    return data.data;
  } else {
    log('error', 'Falha ao obter limites');
    return null;
  }
}

async function testCreateProduct(limits) {
  log('info', '\n═════════════════════════════════════');
  log('info', '4️⃣ TESTE: CRIAR PRODUTO (VERIFICAR LIMITE)');
  log('info', '═════════════════════════════════════\n');
  
  if (!limits.canAddProduct) {
    log('warning', 'Usuário atingiu limite de produtos');
    log('info', `  Atual: ${limits.current.products}/${limits.limits.products}`);
    return;
  }
  
  const productData = {
    name: `Teste Produto ${Date.now()}`,
    category: 'graos',
    subcategory: 'soja',
    price: 150.00,
    quantity: 100,
    unit: 'saca',
    origin: 'Sinop, MT',
    description: 'Produto de teste para verificar limites'
  };
  
  const response = await fetch(`${SITE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  
  const data = await response.json();
  
  if (response.status === 403) {
    log('success', 'Limite de produtos funcionando! API retornou 403');
    log('info', `  Mensagem: ${data.error}`);
  } else if (data.success) {
    log('success', 'Produto criado com sucesso');
    log('info', `  ID: ${data.data.id}`);
  } else {
    log('error', `Erro inesperado: ${data.error}`);
  }
}

async function testCreateFreight(limits) {
  log('info', '\n═════════════════════════════════════');
  log('info', '5️⃣ TESTE: CRIAR FRETE (VERIFICAR LIMITE)');
  log('info', '═════════════════════════════════════\n');
  
  if (!limits.canAddFreight) {
    log('warning', 'Usuário atingiu limite de fretes');
    log('info', `  Atual: ${limits.current.freights}/${limits.limits.freights}`);
    return;
  }
  
  const freightData = {
    origin: 'Sinop, MT',
    destination: 'São Paulo, SP',
    cargo_type: 'graos',
    weight: 30000,
    vehicle_type: 'carreta',
    price: 8500.00,
    description: 'Frete de teste para verificar limites',
    pickup_date: new Date(Date.now() + 86400000).toISOString()
  };
  
  const response = await fetch(`${SITE_URL}/api/freights`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(freightData)
  });
  
  const data = await response.json();
  
  if (response.status === 403) {
    log('success', 'Limite de fretes funcionando! API retornou 403');
    log('info', `  Mensagem: ${data.error}`);
  } else if (data.success) {
    log('success', 'Frete criado com sucesso');
    log('info', `  ID: ${data.data.id}`);
    
    // Verificar se email de rastreio foi enviado
    log('info', '  Aguardando 2s para verificar email...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    log('warning', 'Verificação de email: manual (checar inbox)');
  } else {
    log('error', `Erro inesperado: ${data.error}`);
  }
}

async function testPlansPage() {
  log('info', '\n═════════════════════════════════════');
  log('info', '6️⃣ TESTE: PÁGINA DE PLANOS');
  log('info', '═════════════════════════════════════\n');
  
  await page.goto(`${SITE_URL}/plans`, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(2000);
  
  // Verificar planos gratuitos
  const hasGratuito = await page.evaluate(() => {
    return document.body.textContent.includes('Gratuito') || 
           document.body.textContent.includes('R$ 0');
  });
  
  if (hasGratuito) {
    log('success', 'Planos gratuitos presentes na página');
  } else {
    log('error', 'Planos gratuitos NÃO encontrados');
  }
  
  // Verificar valores competitivos
  const has10Produtos = await page.evaluate(() => {
    return document.body.textContent.includes('10 produtos');
  });
  
  const has20Fretes = await page.evaluate(() => {
    return document.body.textContent.includes('20 fretes');
  });
  
  if (has10Produtos) {
    log('success', '10 produtos grátis mencionado (vs 5 do MF Rural)');
  }
  
  if (has20Fretes) {
    log('success', '20 fretes grátis mencionado (vs 10 do Fretebras)');
  }
  
  await page.screenshot({ path: 'plans-test.png', fullPage: true });
  log('success', 'Screenshot salvo: plans-test.png');
}

async function testPaymentPage() {
  log('info', '\n═════════════════════════════════════');
  log('info', '7️⃣ TESTE: PÁGINA DE PAGAMENTO');
  log('info', '═════════════════════════════════════\n');
  
  // Tentar acessar página de PIX
  try {
    await page.goto(`${SITE_URL}/payment/pix`, { waitUntil: 'networkidle2', timeout: 10000 });
    log('success', 'Página de pagamento PIX carregou');
    
    const hasQRCode = await page.$('canvas, img[alt*="QR"], [class*="qr"]');
    if (hasQRCode) {
      log('success', 'Elemento de QR Code presente');
    } else {
      log('warning', 'QR Code não encontrado (pode precisar de dados de pagamento)');
    }
  } catch (error) {
    log('warning', 'Página de PIX não acessível sem dados de pagamento');
  }
}

async function testVLibras() {
  log('info', '\n═════════════════════════════════════');
  log('info', '8️⃣ TESTE: VLIBRAS (ACESSIBILIDADE)');
  log('info', '═════════════════════════════════════\n');
  
  await page.goto(SITE_URL, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000);
  
  // Verificar se botão existe
  const vlibrasButton = await page.$('[vw-access-button]');
  if (vlibrasButton) {
    log('success', 'Botão VLibras encontrado');
    
    // Verificar se está visível
    const isVisible = await page.$eval('[vw-access-button]', el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && 
             style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    });
    
    if (isVisible) {
      log('success', 'VLibras está VISÍVEL na página');
      
      // Obter posição
      const position = await page.$eval('[vw-access-button]', el => {
        const rect = el.getBoundingClientRect();
        return {
          bottom: window.innerHeight - rect.bottom,
          right: window.innerWidth - rect.right,
          width: rect.width,
          height: rect.height
        };
      });
      
      log('info', `  Posição: bottom=${position.bottom}px, right=${position.right}px`);
      log('info', `  Tamanho: ${position.width}x${position.height}px`);
      
      if (position.width >= 45 && position.width <= 55) {
        log('success', 'Tamanho correto (50px)');
      }
    } else {
      log('error', 'VLibras NÃO está visível');
    }
  } else {
    log('error', 'Botão VLibras NÃO encontrado');
  }
  
  await page.screenshot({ path: 'vlibras-test.png' });
  log('success', 'Screenshot salvo: vlibras-test.png');
}

async function testCotacoes() {
  log('info', '\n═════════════════════════════════════');
  log('info', '9️⃣ TESTE: API COTAÇÕES (PÚBLICA)');
  log('info', '═════════════════════════════════════\n');
  
  const response = await fetch(`${SITE_URL}/api/cotacoes?produtos=soja,milho,cafe`);
  const data = await response.json();
  
  if (response.ok && data.success) {
    log('success', 'API /cotacoes funcionando sem autenticação');
    
    if (data.cotacoes) {
      Object.keys(data.cotacoes).forEach(produto => {
        const cotacao = data.cotacoes[produto];
        log('info', `  ${produto}: R$ ${cotacao.preco} (${cotacao.variacao > 0 ? '+' : ''}${cotacao.variacao}%)`);
      });
    }
  } else {
    log('error', 'API /cotacoes falhou');
    log('info', `  Status: ${response.status}`);
    log('info', `  Erro: ${data.error || 'Desconhecido'}`);
  }
}

async function runTests() {
  console.log('\n\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  🔥 TESTE DE FLUXOS CRÍTICOS - AGROISYNC 🔥');
  console.log('════════════════════════════════════════════════════════');
  console.log('\n');
  
  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 1. Login
    const loginOk = await login();
    if (!loginOk) {
      log('error', 'Não foi possível continuar sem login');
      return;
    }
    
    // 2. Dashboard
    await testDashboard();
    
    // 3. Limites
    const limits = await testLimits();
    
    // 4. Criar Produto
    if (limits) {
      await testCreateProduct(limits);
    }
    
    // 5. Criar Frete
    if (limits) {
      await testCreateFreight(limits);
    }
    
    // 6. Planos
    await testPlansPage();
    
    // 7. Pagamento
    await testPaymentPage();
    
    // 8. VLibras
    await testVLibras();
    
    // 9. Cotações
    await testCotacoes();
    
    console.log('\n\n');
    console.log('════════════════════════════════════════════════════════');
    console.log('  ✅ TESTES CONCLUÍDOS!');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n');
    console.log('📸 Screenshots salvos:');
    console.log('  - dashboard-test.png');
    console.log('  - plans-test.png');
    console.log('  - vlibras-test.png');
    console.log('\n');
    
  } catch (error) {
    log('error', `Erro fatal: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

runTests();

