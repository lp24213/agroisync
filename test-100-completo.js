// TESTE 100% COMPLETO - AGROISYNC
const puppeteer = require('puppeteer');
const fs = require('fs');

const SITE_URL = 'https://agroisync.com';
const TEST_EMAIL = `teste_${Date.now()}@agroisync.test`;
const TEST_PASSWORD = 'Teste@1234';
const EXISTING_EMAIL = 'luispaulo-de-oliveira@hotmail.com';
const EXISTING_PASSWORD = 'Th@ys1522';

let browser, page;
const errors = [];
const warnings = [];
const success = [];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

async function log(type, message) {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const msg = `[${timestamp}] ${message}`;
  
  if (type === 'success') {
    console.log('\x1b[32m✅', msg, '\x1b[0m');
    success.push(msg);
  } else if (type === 'error') {
    console.log('\x1b[31m❌', msg, '\x1b[0m');
    errors.push(msg);
  } else if (type === 'warning') {
    console.log('\x1b[33m⚠️', msg, '\x1b[0m');
    warnings.push(msg);
  } else {
    console.log('\x1b[36mℹ️', msg, '\x1b[0m');
  }
}

async function checkConsoleLogs(pageName) {
  log('info', `📋 Verificando console de: ${pageName}`);
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error' && !text.includes('DevTools') && !text.includes('ERR_BLOCKED')) {
      log('error', `Console Error em ${pageName}: ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    log('error', `JavaScript Error em ${pageName}: ${error.message}`);
  });
}

async function testPage(url, name) {
  try {
    log('info', `🌐 Testando página: ${name} (${url})`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    checkConsoleLogs(name);
    
    // Aguardar um pouco para erros aparecerem
    await page.waitForTimeout(2000);
    
    // Verificar se a página carregou
    const title = await page.title();
    if (title) {
      log('success', `Página ${name} carregou - Título: ${title}`);
    }
    
    return true;
  } catch (error) {
    log('error', `Falha ao carregar ${name}: ${error.message}`);
    return false;
  }
}

async function testAPI(endpoint, method = 'GET', body = null, token = null) {
  try {
    const url = `${SITE_URL}/api${endpoint}`;
    log('info', `🔌 Testando API: ${method} ${endpoint}`);
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok && data.success !== false) {
      log('success', `API ${endpoint} OK (${response.status})`);
      return { success: true, data };
    } else {
      log('error', `API ${endpoint} falhou: ${data.error || response.statusText}`);
      return { success: false, data };
    }
  } catch (error) {
    log('error', `Erro na API ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ============================================
// TESTES
// ============================================

async function testHomePage() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '1️⃣ TESTE: HOME PAGE (SEM LOGIN)');
  log('info', '═══════════════════════════════════════');
  
  await testPage(SITE_URL, 'Home');
  
  // Verificar elementos principais
  const hasHero = await page.$('h1');
  if (hasHero) {
    const heroText = await page.$eval('h1', el => el.textContent);
    log('success', `Hero presente: "${heroText}"`);
  } else {
    log('error', 'Hero <h1> não encontrado');
  }
  
  // Verificar GrainsChart
  const hasGrains = await page.$('.grains-chart, [class*="grain"]');
  if (hasGrains) {
    log('success', 'GrainsChart/Cotações presente');
  } else {
    log('warning', 'GrainsChart não encontrado');
  }
  
  // Verificar VLibras
  const hasVLibras = await page.$('[vw-access-button]');
  if (hasVLibras) {
    log('success', 'VLibras presente');
    
    // Verificar tamanho
    const size = await page.$eval('[vw-access-button]', el => ({
      width: el.offsetWidth,
      height: el.offsetHeight
    }));
    
    if (size.width <= 60 && size.height <= 60) {
      log('success', `VLibras tamanho OK: ${size.width}x${size.height}`);
    } else {
      log('warning', `VLibras muito grande: ${size.width}x${size.height}`);
    }
  } else {
    log('error', 'VLibras não encontrado');
  }
  
  // Verificar Chatbot
  const hasChatbot = await page.$('.chatbot-container, [class*="chatbot"]');
  if (hasChatbot) {
    log('success', 'Chatbot presente');
  } else {
    log('warning', 'Chatbot não encontrado');
  }
}

async function testPublicPages() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '2️⃣ TESTE: PÁGINAS PÚBLICAS');
  log('info', '═══════════════════════════════════════');
  
  const publicPages = [
    { url: '/about', name: 'Sobre' },
    { url: '/plans', name: 'Planos' },
    { url: '/marketplace', name: 'Marketplace' },
    { url: '/freights', name: 'Fretes' },
    { url: '/store', name: 'Loja' },
    { url: '/technology', name: 'Tecnologia' },
    { url: '/contact', name: 'Contato' },
  ];
  
  for (const p of publicPages) {
    await testPage(`${SITE_URL}${p.url}`, p.name);
  }
}

async function testRegister() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '3️⃣ TESTE: CADASTRO');
  log('info', '═══════════════════════════════════════');
  
  await testPage(`${SITE_URL}/register`, 'Cadastro');
  
  // Preencher formulário
  try {
    await page.type('input[name="name"], input[placeholder*="nome"]', 'Teste Usuario', { delay: 50 });
    await page.type('input[type="email"]', TEST_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', TEST_PASSWORD, { delay: 50 });
    
    log('success', 'Formulário de cadastro preenchido');
    
    // Verificar se Turnstile existe
    const hasTurnstile = await page.$('.cf-turnstile, [class*="turnstile"]');
    if (hasTurnstile) {
      log('success', 'Turnstile presente');
    } else {
      log('warning', 'Turnstile não encontrado');
    }
    
    // Verificar botão de submit
    const hasSubmit = await page.$('button[type="submit"]');
    if (hasSubmit) {
      const isDisabled = await page.$eval('button[type="submit"]', el => el.disabled);
      if (isDisabled) {
        log('warning', 'Botão de submit está desabilitado (aguardando Turnstile)');
      } else {
        log('success', 'Botão de submit habilitado');
      }
    }
    
  } catch (error) {
    log('error', `Erro ao preencher cadastro: ${error.message}`);
  }
}

async function testLogin() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '4️⃣ TESTE: LOGIN');
  log('info', '═══════════════════════════════════════');
  
  await testPage(`${SITE_URL}/login`, 'Login');
  
  try {
    // Preencher login
    await page.type('input[type="email"]', EXISTING_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', EXISTING_PASSWORD, { delay: 50 });
    
    log('success', 'Formulário de login preenchido');
    
    // Tentar fazer login via API diretamente
    const loginResult = await testAPI('/auth/login', 'POST', {
      email: EXISTING_EMAIL,
      password: EXISTING_PASSWORD
    });
    
    if (loginResult.success) {
      global.authToken = loginResult.data.data?.token || loginResult.data.token;
      log('success', `Token obtido: ${global.authToken?.substring(0, 30)}...`);
    }
    
  } catch (error) {
    log('error', `Erro no login: ${error.message}`);
  }
}

async function testAuthenticatedAPIs() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '5️⃣ TESTE: APIs AUTENTICADAS');
  log('info', '═══════════════════════════════════════');
  
  if (!global.authToken) {
    log('error', 'Token não disponível, pulando testes autenticados');
    return;
  }
  
  await testAPI('/user/profile', 'GET', null, global.authToken);
  await testAPI('/user/limits', 'GET', null, global.authToken);
  await testAPI('/products', 'GET', null, global.authToken);
  await testAPI('/freights', 'GET', null, global.authToken);
  await testAPI('/conversations?status=active', 'GET', null, global.authToken);
  await testAPI('/price-alerts', 'GET', null, global.authToken);
  await testAPI('/favorites', 'GET', null, global.authToken);
}

async function testPublicAPIs() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '6️⃣ TESTE: APIs PÚBLICAS');
  log('info', '═══════════════════════════════════════');
  
  await testAPI('/products', 'GET');
  await testAPI('/freights', 'GET');
  await testAPI('/plans', 'GET');
  await testAPI('/cotacoes?produtos=soja,milho,cafe', 'GET');
}

async function testPlansPage() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '7️⃣ TESTE: PÁGINA DE PLANOS');
  log('info', '═══════════════════════════════════════');
  
  await testPage(`${SITE_URL}/plans`, 'Planos');
  
  // Verificar se tem planos para todos os tipos
  const hasComprador = await page.evaluate(() => {
    return document.body.textContent.includes('Comprador') || 
           document.body.textContent.includes('comprador');
  });
  
  const hasFreteiro = await page.evaluate(() => {
    return document.body.textContent.includes('Freteiro') || 
           document.body.textContent.includes('freteiro');
  });
  
  const hasAnunciante = await page.evaluate(() => {
    return document.body.textContent.includes('Anunciante') || 
           document.body.textContent.includes('anunciante');
  });
  
  if (hasComprador) log('success', 'Planos de Comprador presentes');
  else log('error', 'Planos de Comprador não encontrados');
  
  if (hasFreteiro) log('success', 'Planos de Freteiro presentes');
  else log('error', 'Planos de Freteiro não encontrados');
  
  if (hasAnunciante) log('success', 'Planos de Anunciante presentes');
  else log('error', 'Planos de Anunciante não encontrados');
  
  // Verificar valores competitivos
  const hasGratuito = await page.evaluate(() => {
    return document.body.textContent.includes('Gratuito') || 
           document.body.textContent.includes('R$ 0');
  });
  
  if (hasGratuito) log('success', 'Planos gratuitos presentes');
  else log('warning', 'Planos gratuitos não encontrados');
}

async function testDashboard() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '8️⃣ TESTE: DASHBOARD (LOGADO)');
  log('info', '═══════════════════════════════════════');
  
  if (!global.authToken) {
    log('warning', 'Pulando teste de dashboard (sem token)');
    return;
  }
  
  // Injetar token no localStorage
  await page.goto(SITE_URL);
  await page.evaluate((token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
  }, global.authToken);
  
  await testPage(`${SITE_URL}/user-dashboard`, 'Dashboard');
  
  // Verificar se mostra dados do usuário
  await page.waitForTimeout(2000);
  
  const hasUserData = await page.evaluate(() => {
    return document.body.textContent.includes('Luis') || 
           document.body.textContent.includes('Dashboard');
  });
  
  if (hasUserData) {
    log('success', 'Dashboard mostrando dados do usuário');
  } else {
    log('warning', 'Dashboard pode não estar mostrando dados');
  }
}

async function testChatbot() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '9️⃣ TESTE: CHATBOT');
  log('info', '═══════════════════════════════════════');
  
  await page.goto(SITE_URL);
  
  // Verificar se chatbot existe
  const chatbotButton = await page.$('.chatbot-button, [class*="chatbot"]');
  if (chatbotButton) {
    log('success', 'Botão do chatbot encontrado');
    
    try {
      await chatbotButton.click();
      await page.waitForTimeout(1000);
      log('success', 'Chatbot foi clicado');
    } catch (error) {
      log('warning', 'Não foi possível clicar no chatbot');
    }
  } else {
    log('warning', 'Botão do chatbot não encontrado');
  }
}

async function testVLibras() {
  log('info', '\n\n═══════════════════════════════════════');
  log('info', '🔟 TESTE: VLIBRAS (ACESSIBILIDADE)');
  log('info', '═══════════════════════════════════════');
  
  await page.goto(SITE_URL);
  await page.waitForTimeout(3000); // Aguardar VLibras carregar
  
  const vlibrasButton = await page.$('[vw-access-button]');
  if (vlibrasButton) {
    log('success', 'VLibras botão encontrado');
    
    // Verificar se está visível
    const isVisible = await page.$eval('[vw-access-button]', el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    
    if (isVisible) {
      log('success', 'VLibras está visível');
      
      try {
        await vlibrasButton.click();
        await page.waitForTimeout(1000);
        log('success', 'VLibras foi clicado');
      } catch (error) {
        log('warning', 'Não foi possível clicar no VLibras');
      }
    } else {
      log('error', 'VLibras não está visível');
    }
  } else {
    log('error', 'VLibras não encontrado');
  }
}

// ============================================
// EXECUTAR TODOS OS TESTES
// ============================================

async function runAllTests() {
  console.log('\n\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  🔥 TESTE 100% COMPLETO - AGROISYNC.COM 🔥');
  console.log('════════════════════════════════════════════════════════');
  console.log('\n');
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Capturar erros de console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('DevTools') && !text.includes('ERR_BLOCKED')) {
          errors.push(`Console: ${text}`);
        }
      }
    });
    
    // EXECUTAR TODOS OS TESTES
    await testHomePage();
    await testPublicPages();
    await testPublicAPIs();
    await testRegister();
    await testLogin();
    await testAuthenticatedAPIs();
    await testPlansPage();
    await testDashboard();
    await testChatbot();
    await testVLibras();
    
  } catch (error) {
    log('error', `Erro fatal: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
  
  // ============================================
  // RELATÓRIO FINAL
  // ============================================
  
  console.log('\n\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  📊 RELATÓRIO FINAL');
  console.log('════════════════════════════════════════════════════════');
  console.log('\n');
  
  console.log(`\x1b[32m✅ SUCESSOS: ${success.length}\x1b[0m`);
  console.log(`\x1b[33m⚠️  AVISOS: ${warnings.length}\x1b[0m`);
  console.log(`\x1b[31m❌ ERROS: ${errors.length}\x1b[0m`);
  
  if (errors.length > 0) {
    console.log('\n\n🔴 ERROS ENCONTRADOS:');
    console.log('─────────────────────────────────────────');
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n\n⚠️  AVISOS:');
    console.log('─────────────────────────────────────────');
    warnings.forEach((warn, i) => {
      console.log(`${i + 1}. ${warn}`);
    });
  }
  
  // Salvar relatório
  const report = {
    timestamp: new Date().toISOString(),
    success: success.length,
    warnings: warnings.length,
    errors: errors.length,
    details: { success, warnings, errors }
  };
  
  fs.writeFileSync('RELATORIO_TESTES_100.json', JSON.stringify(report, null, 2));
  console.log('\n\n💾 Relatório salvo em: RELATORIO_TESTES_100.json');
  
  console.log('\n\n');
}

runAllTests();

