const puppeteer = require('puppeteer');
const fs = require('fs');

// Credenciais de login (você já tem um login)
const LOGIN_EMAIL = 'luispaulo-de-oliveira@hotmail.com';
const LOGIN_PASSWORD = 'Th@ys1522';

async function testPage(page, url, name) {
  const errors = [];
  const warnings = [];
  const logs = [];

  // Capturar erros de console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errors.push(text);
      console.log(`❌ [${name}] ERRO: ${text}`);
    } else if (type === 'warning') {
      warnings.push(text);
      console.log(`⚠️ [${name}] AVISO: ${text}`);
    } else if (type === 'log' && text.includes('✅')) {
      logs.push(text);
      console.log(`✅ [${name}] LOG: ${text}`);
    }
  });

  // Capturar erros de JavaScript
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`❌ [${name}] JS ERROR: ${error.message}`);
  });

  // Capturar requisições que falharam
  page.on('requestfailed', request => {
    errors.push(`Failed to load: ${request.url()}`);
    console.log(`❌ [${name}] REQUEST FAILED: ${request.url()}`);
  });

  try {
    console.log(`\n🔍 Testando: ${name} (${url})`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Aguardar 3 segundos para garantir que tudo carregou
    await page.waitForTimeout(3000);

    // Capturar screenshot
    await page.screenshot({ path: `screenshots/${name.replace(/[^a-z0-9]/gi, '_')}.png`, fullPage: true });

    return { url, name, errors, warnings, logs, status: 'success' };
  } catch (error) {
    console.log(`❌ [${name}] ERRO AO CARREGAR: ${error.message}`);
    return { url, name, errors: [...errors, error.message], warnings, logs, status: 'error' };
  }
}

async function main() {
  console.log('🚀 INICIANDO TESTES REAIS NO AGROISYNC.COM\n');

  // Criar pasta para screenshots
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  try {
    // ========== TESTES SEM LOGIN ==========
    console.log('\n📱 ========== PÁGINAS PÚBLICAS (SEM LOGIN) ==========\n');
    
    const publicPage = await browser.newPage();
    
    // 1. Home
    results.push(await testPage(publicPage, 'https://agroisync.com', 'Home'));
    
    // 2. Login
    results.push(await testPage(publicPage, 'https://agroisync.com/login', 'Login'));
    
    // 3. Register
    results.push(await testPage(publicPage, 'https://agroisync.com/register', 'Register'));
    
    // 4. About
    results.push(await testPage(publicPage, 'https://agroisync.com/about', 'About'));
    
    // 5. Marketplace
    results.push(await testPage(publicPage, 'https://agroisync.com/marketplace', 'Marketplace'));
    
    // 6. Plans
    results.push(await testPage(publicPage, 'https://agroisync.com/plans', 'Plans'));
    
    // 7. Contact
    results.push(await testPage(publicPage, 'https://agroisync.com/contact', 'Contact'));
    
    // 8. Crypto
    results.push(await testPage(publicPage, 'https://agroisync.com/crypto', 'Crypto'));
    
    // 9. Partnerships
    results.push(await testPage(publicPage, 'https://agroisync.com/partnerships', 'Partnerships'));
    
    // 10. Help
    results.push(await testPage(publicPage, 'https://agroisync.com/help', 'Help'));
    
    // 11. FAQ
    results.push(await testPage(publicPage, 'https://agroisync.com/faq', 'FAQ'));
    
    // 12. Terms
    results.push(await testPage(publicPage, 'https://agroisync.com/terms', 'Terms'));
    
    // 13. Privacy
    results.push(await testPage(publicPage, 'https://agroisync.com/privacy', 'Privacy'));

    await publicPage.close();

    // ========== TESTES COM LOGIN ==========
    console.log('\n👤 ========== FAZENDO LOGIN ==========\n');
    
    const loggedPage = await browser.newPage();
    
    // Fazer login
    console.log('🔐 Acessando página de login...');
    await loggedPage.goto('https://agroisync.com/login', { waitUntil: 'networkidle2' });
    await loggedPage.waitForTimeout(2000);

    console.log('📝 Preenchendo credenciais...');
    await loggedPage.type('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await loggedPage.type('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    
    console.log('🚀 Clicando em login...');
    await loggedPage.click('button[type="submit"]');
    
    // Aguardar redirecionamento
    await loggedPage.waitForTimeout(5000);
    
    console.log('\n👤 ========== PÁGINAS LOGADAS ==========\n');
    
    // 14. Dashboard
    results.push(await testPage(loggedPage, 'https://agroisync.com/dashboard', 'Dashboard (Logado)'));
    
    // 15. User Dashboard
    results.push(await testPage(loggedPage, 'https://agroisync.com/user-dashboard', 'User Dashboard'));
    
    // 16. Profile
    results.push(await testPage(loggedPage, 'https://agroisync.com/profile', 'Profile'));
    
    // 17. Freights
    results.push(await testPage(loggedPage, 'https://agroisync.com/freight', 'Freights'));
    
    // 18. Products
    results.push(await testPage(loggedPage, 'https://agroisync.com/products', 'Products'));
    
    // 19. Messages
    results.push(await testPage(loggedPage, 'https://agroisync.com/messages', 'Messages'));
    
    // 20. Settings
    results.push(await testPage(loggedPage, 'https://agroisync.com/settings', 'Settings'));
    
    // 21. Admin Panel (se for admin)
    results.push(await testPage(loggedPage, 'https://agroisync.com/admin', 'Admin Panel'));

    await loggedPage.close();

  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
  } finally {
    await browser.close();
  }

  // ========== GERAR RELATÓRIO ==========
  console.log('\n\n📊 ========== GERANDO RELATÓRIO ==========\n');

  const totalPages = results.length;
  const pagesWithErrors = results.filter(r => r.errors.length > 0).length;
  const pagesWithWarnings = results.filter(r => r.warnings.length > 0).length;
  const successPages = results.filter(r => r.errors.length === 0 && r.warnings.length === 0).length;

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalPages,
      success: successPages,
      withErrors: pagesWithErrors,
      withWarnings: pagesWithWarnings
    },
    pages: results
  };

  // Salvar relatório JSON
  fs.writeFileSync('RELATORIO_CONSOLE_REAL.json', JSON.stringify(report, null, 2));
  
  // Salvar relatório TXT
  let txtReport = '🔍 RELATÓRIO DE TESTES - AGROISYNC.COM\n';
  txtReport += '=' .repeat(60) + '\n\n';
  txtReport += `📊 RESUMO:\n`;
  txtReport += `  Total de páginas testadas: ${totalPages}\n`;
  txtReport += `  ✅ Páginas sem erros: ${successPages}\n`;
  txtReport += `  ⚠️ Páginas com avisos: ${pagesWithWarnings}\n`;
  txtReport += `  ❌ Páginas com erros: ${pagesWithErrors}\n\n`;
  txtReport += '=' .repeat(60) + '\n\n';

  results.forEach(result => {
    txtReport += `\n📄 ${result.name}\n`;
    txtReport += `URL: ${result.url}\n`;
    txtReport += `Status: ${result.status}\n`;
    
    if (result.errors.length > 0) {
      txtReport += `\n❌ ERROS (${result.errors.length}):\n`;
      result.errors.forEach((error, i) => {
        txtReport += `  ${i + 1}. ${error}\n`;
      });
    }
    
    if (result.warnings.length > 0) {
      txtReport += `\n⚠️ AVISOS (${result.warnings.length}):\n`;
      result.warnings.forEach((warning, i) => {
        txtReport += `  ${i + 1}. ${warning}\n`;
      });
    }
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      txtReport += `\n✅ Nenhum erro ou aviso!\n`;
    }
    
    txtReport += '\n' + '-'.repeat(60) + '\n';
  });

  fs.writeFileSync('RELATORIO_CONSOLE_REAL.txt', txtReport);

  console.log('\n✅ RELATÓRIO GERADO:');
  console.log('  📄 RELATORIO_CONSOLE_REAL.json');
  console.log('  📄 RELATORIO_CONSOLE_REAL.txt');
  console.log('  📸 screenshots/ (imagens de todas as páginas)');
  
  console.log('\n' + txtReport);
}

main().catch(console.error);

