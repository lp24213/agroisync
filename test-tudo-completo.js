const puppeteer = require('puppeteer');
const fs = require('fs');

const LOGIN_EMAIL = 'luispaulo-de-oliveira@hotmail.com';
const LOGIN_PASSWORD = 'Th@ys1522';

const allErrors = [];
const allWarnings = [];
const securityIssues = [];
const performanceIssues = [];

async function testPageComplete(page, url, name, isLoggedIn = false) {
  const result = {
    url,
    name,
    isLoggedIn,
    errors: [],
    warnings: [],
    consoleErrors: [],
    jsErrors: [],
    networkErrors: [],
    securityIssues: [],
    performanceIssues: [],
    missingElements: [],
    brokenLinks: [],
    status: 'testing'
  };

  // Capturar TODOS os tipos de erros
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      result.consoleErrors.push(text);
      console.log(`❌ [${name}] CONSOLE ERROR: ${text}`);
    } else if (type === 'warning') {
      result.warnings.push(text);
      console.log(`⚠️ [${name}] WARNING: ${text}`);
    }
  });

  page.on('pageerror', error => {
    result.jsErrors.push(error.message);
    console.log(`❌ [${name}] JS ERROR: ${error.message}`);
  });

  page.on('requestfailed', request => {
    const failure = `${request.url()} - ${request.failure().errorText}`;
    result.networkErrors.push(failure);
    console.log(`❌ [${name}] NETWORK ERROR: ${failure}`);
  });

  page.on('response', response => {
    const status = response.status();
    if (status >= 400) {
      const error = `${response.url()} - Status ${status}`;
      result.networkErrors.push(error);
      console.log(`❌ [${name}] HTTP ${status}: ${response.url()}`);
    }
  });

  try {
    console.log(`\n🔍 TESTANDO: ${name} (${url})`);
    
    // Navegar para a página
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    // Aguardar carregamento completo
    await page.waitForTimeout(5000);

    // 1. VERIFICAR ELEMENTOS CRÍTICOS
    console.log(`  🔍 Verificando elementos críticos...`);
    
    const checks = [
      { selector: 'header, [role="banner"]', name: 'Header' },
      { selector: 'footer, [role="contentinfo"]', name: 'Footer' },
      { selector: 'nav, [role="navigation"]', name: 'Navigation' },
      { selector: 'main, [role="main"]', name: 'Main content' },
      { selector: '#root', name: 'React Root' },
      { selector: 'div[vw]', name: 'VLibras' },
    ];

    for (const check of checks) {
      const exists = await page.$(check.selector);
      if (!exists) {
        result.missingElements.push(check.name);
        console.log(`  ❌ Missing: ${check.name}`);
      } else {
        console.log(`  ✅ Found: ${check.name}`);
      }
    }

    // 2. VERIFICAR LINKS QUEBRADOS
    console.log(`  🔍 Verificando links...`);
    const links = await page.$$eval('a[href]', anchors => 
      anchors.map(a => ({
        href: a.href,
        text: a.textContent.trim()
      })).filter(l => l.href && !l.href.includes('javascript:'))
    );

    for (const link of links.slice(0, 20)) { // Testar primeiros 20 links
      try {
        const linkResponse = await page.goto(link.href, { timeout: 5000, waitUntil: 'domcontentloaded' });
        if (linkResponse && linkResponse.status() >= 400) {
          result.brokenLinks.push(`${link.text}: ${link.href}`);
          console.log(`  ❌ Broken link: ${link.text} -> ${link.href}`);
        }
      } catch (e) {
        // Ignorar erros de navegação de links
      }
    }

    // Voltar para a página original
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 3. VERIFICAR SEGURANÇA
    console.log(`  🔍 Verificando segurança...`);
    
    // Verificar CSP
    const csp = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return meta ? meta.content : null;
    });

    if (!csp) {
      result.securityIssues.push('CSP não configurado');
      console.log(`  ⚠️ CSP não encontrado`);
    } else {
      console.log(`  ✅ CSP configurado`);
    }

    // Verificar HTTPS
    if (!url.startsWith('https://')) {
      result.securityIssues.push('Não está usando HTTPS');
      console.log(`  ❌ Não está usando HTTPS`);
    } else {
      console.log(`  ✅ Usando HTTPS`);
    }

    // Verificar inputs sem validação
    const unvalidatedInputs = await page.$$eval('input:not([required]):not([pattern])', inputs => 
      inputs.filter(i => i.type !== 'hidden').length
    );

    if (unvalidatedInputs > 0) {
      result.securityIssues.push(`${unvalidatedInputs} inputs sem validação`);
      console.log(`  ⚠️ ${unvalidatedInputs} inputs sem validação`);
    }

    // 4. VERIFICAR PERFORMANCE
    console.log(`  🔍 Verificando performance...`);
    
    const metrics = await page.evaluate(() => {
      const perf = window.performance;
      const timing = perf.timing;
      
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: perf.getEntriesByType('paint').find(e => e.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: perf.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    if (metrics.loadTime > 5000) {
      result.performanceIssues.push(`Tempo de carregamento lento: ${metrics.loadTime}ms`);
      console.log(`  ⚠️ Carregamento lento: ${metrics.loadTime}ms`);
    } else {
      console.log(`  ✅ Carregamento rápido: ${metrics.loadTime}ms`);
    }

    // 5. VERIFICAR ACESSIBILIDADE
    console.log(`  🔍 Verificando acessibilidade...`);
    
    const a11yIssues = await page.evaluate(() => {
      const issues = [];
      
      // Verificar imagens sem alt
      const imgsWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));
      if (imgsWithoutAlt.length > 0) {
        issues.push(`${imgsWithoutAlt.length} imagens sem atributo alt`);
      }
      
      // Verificar botões sem label
      const btnsWithoutLabel = Array.from(document.querySelectorAll('button:not([aria-label]):not([title])')).filter(
        btn => !btn.textContent.trim()
      );
      if (btnsWithoutLabel.length > 0) {
        issues.push(`${btnsWithoutLabel.length} botões sem label`);
      }
      
      // Verificar contraste de cores
      const hasLowContrast = document.querySelectorAll('[style*="color"]').length > 0;
      
      return issues;
    });

    result.securityIssues.push(...a11yIssues);

    // 6. VERIFICAR FUNCIONALIDADES ESPECÍFICAS
    console.log(`  🔍 Verificando funcionalidades...`);
    
    // VLibras
    const vLibrasWorking = await page.evaluate(() => {
      return typeof window.VLibras !== 'undefined' && 
             typeof window.VLibras.Widget !== 'undefined';
    });

    if (!vLibrasWorking) {
      result.errors.push('VLibras não carregado corretamente');
      console.log(`  ❌ VLibras não funciona`);
    } else {
      console.log(`  ✅ VLibras funcionando`);
    }

    // React carregado
    const reactLoaded = await page.evaluate(() => {
      return typeof window.React !== 'undefined' || 
             document.getElementById('root')?.hasChildNodes();
    });

    if (!reactLoaded) {
      result.errors.push('React não carregado');
      console.log(`  ❌ React não carregado`);
    } else {
      console.log(`  ✅ React carregado`);
    }

    // Screenshot
    await page.screenshot({ 
      path: `screenshots/${name.replace(/[^a-z0-9]/gi, '_')}.png`, 
      fullPage: false 
    });

    // Consolidar erros
    result.errors = [
      ...result.consoleErrors,
      ...result.jsErrors,
      ...result.networkErrors
    ];

    result.status = 'success';
    console.log(`  ✅ Teste concluído: ${name}`);

  } catch (error) {
    result.errors.push(error.message);
    result.status = 'error';
    console.log(`  ❌ Erro no teste: ${error.message}`);
  }

  return result;
}

async function main() {
  console.log('🔥 INICIANDO TESTE COMPLETO DE TUDO - AGROISYNC.COM\n');
  console.log('📋 O QUE SERÁ TESTADO:');
  console.log('  ✅ Erros de console');
  console.log('  ✅ Erros de JavaScript');
  console.log('  ✅ Erros de rede');
  console.log('  ✅ Links quebrados');
  console.log('  ✅ Elementos ausentes');
  console.log('  ✅ Segurança (CSP, HTTPS, validações)');
  console.log('  ✅ Performance (tempo de carregamento)');
  console.log('  ✅ Acessibilidade');
  console.log('  ✅ Funcionalidades (VLibras, React)');
  console.log('  ✅ HTTP Status Codes');
  console.log('\n');

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  try {
    // ========== PÁGINAS PÚBLICAS ==========
    console.log('\n📱 ========== TESTANDO PÁGINAS PÚBLICAS ==========\n');
    
    const publicPage = await browser.newPage();
    await publicPage.setViewport({ width: 1920, height: 1080 });
    
    const publicPages = [
      { url: 'https://agroisync.com', name: 'Home' },
      { url: 'https://agroisync.com/login', name: 'Login' },
      { url: 'https://agroisync.com/register', name: 'Register' },
      { url: 'https://agroisync.com/about', name: 'About' },
      { url: 'https://agroisync.com/marketplace', name: 'Marketplace' },
      { url: 'https://agroisync.com/plans', name: 'Plans' },
      { url: 'https://agroisync.com/contact', name: 'Contact' },
      { url: 'https://agroisync.com/crypto', name: 'Crypto' },
      { url: 'https://agroisync.com/partnerships', name: 'Partnerships' },
      { url: 'https://agroisync.com/help', name: 'Help' },
      { url: 'https://agroisync.com/faq', name: 'FAQ' },
      { url: 'https://agroisync.com/terms', name: 'Terms' },
      { url: 'https://agroisync.com/privacy', name: 'Privacy' },
    ];

    for (const page of publicPages) {
      results.push(await testPageComplete(publicPage, page.url, page.name, false));
    }

    await publicPage.close();

    // ========== PÁGINAS LOGADAS ==========
    console.log('\n👤 ========== TESTANDO PÁGINAS LOGADAS ==========\n');
    
    const loggedPage = await browser.newPage();
    await loggedPage.setViewport({ width: 1920, height: 1080 });
    
    // Fazer login
    console.log('🔐 Fazendo login...');
    await loggedPage.goto('https://agroisync.com/login', { waitUntil: 'networkidle2' });
    await loggedPage.waitForTimeout(2000);
    
    await loggedPage.type('input[type="email"], input[name="email"]', LOGIN_EMAIL);
    await loggedPage.type('input[type="password"], input[name="password"]', LOGIN_PASSWORD);
    await loggedPage.click('button[type="submit"]');
    await loggedPage.waitForTimeout(5000);
    
    const loggedPages = [
      { url: 'https://agroisync.com/dashboard', name: 'Dashboard' },
      { url: 'https://agroisync.com/user-dashboard', name: 'User Dashboard' },
      { url: 'https://agroisync.com/profile', name: 'Profile' },
      { url: 'https://agroisync.com/freight', name: 'Freights' },
      { url: 'https://agroisync.com/products', name: 'Products' },
      { url: 'https://agroisync.com/messages', name: 'Messages' },
      { url: 'https://agroisync.com/admin', name: 'Admin Panel' },
    ];

    for (const page of loggedPages) {
      results.push(await testPageComplete(loggedPage, page.url, page.name, true));
    }

    await loggedPage.close();

  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
  } finally {
    await browser.close();
  }

  // ========== GERAR RELATÓRIO DETALHADO ==========
  console.log('\n\n📊 ========== GERANDO RELATÓRIO COMPLETO ==========\n');

  const totalPages = results.length;
  const pagesWithErrors = results.filter(r => r.errors.length > 0).length;
  const pagesWithWarnings = results.filter(r => r.warnings.length > 0).length;
  const pagesWithSecurity = results.filter(r => r.securityIssues.length > 0).length;
  const pagesWithPerformance = results.filter(r => r.performanceIssues.length > 0).length;
  const successPages = results.filter(r => 
    r.errors.length === 0 && 
    r.securityIssues.length === 0 && 
    r.performanceIssues.length === 0
  ).length;

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalPages,
      perfect: successPages,
      withErrors: pagesWithErrors,
      withWarnings: pagesWithWarnings,
      withSecurityIssues: pagesWithSecurity,
      withPerformanceIssues: pagesWithPerformance
    },
    pages: results
  };

  fs.writeFileSync('RELATORIO_COMPLETO_FINAL.json', JSON.stringify(report, null, 2));
  
  let txt = '🔥 RELATÓRIO COMPLETO DE TUDO - AGROISYNC.COM\n';
  txt += '='.repeat(80) + '\n\n';
  txt += `📊 RESUMO GERAL:\n`;
  txt += `  Total de páginas: ${totalPages}\n`;
  txt += `  ✅ Páginas perfeitas: ${successPages}\n`;
  txt += `  ❌ Páginas com erros: ${pagesWithErrors}\n`;
  txt += `  ⚠️ Páginas com avisos: ${pagesWithWarnings}\n`;
  txt += `  🔒 Páginas com problemas de segurança: ${pagesWithSecurity}\n`;
  txt += `  ⚡ Páginas com problemas de performance: ${pagesWithPerformance}\n\n`;
  txt += '='.repeat(80) + '\n\n';

  results.forEach(r => {
    txt += `\n${'='.repeat(80)}\n`;
    txt += `📄 ${r.name} ${r.isLoggedIn ? '(LOGADO)' : '(PÚBLICO)'}\n`;
    txt += `URL: ${r.url}\n`;
    txt += `Status: ${r.status}\n`;
    txt += `${'='.repeat(80)}\n\n`;
    
    if (r.consoleErrors.length > 0) {
      txt += `❌ ERROS DE CONSOLE (${r.consoleErrors.length}):\n`;
      r.consoleErrors.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.jsErrors.length > 0) {
      txt += `❌ ERROS DE JAVASCRIPT (${r.jsErrors.length}):\n`;
      r.jsErrors.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.networkErrors.length > 0) {
      txt += `❌ ERROS DE REDE (${r.networkErrors.length}):\n`;
      r.networkErrors.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.missingElements.length > 0) {
      txt += `❌ ELEMENTOS AUSENTES (${r.missingElements.length}):\n`;
      r.missingElements.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.securityIssues.length > 0) {
      txt += `🔒 PROBLEMAS DE SEGURANÇA (${r.securityIssues.length}):\n`;
      r.securityIssues.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.performanceIssues.length > 0) {
      txt += `⚡ PROBLEMAS DE PERFORMANCE (${r.performanceIssues.length}):\n`;
      r.performanceIssues.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.warnings.length > 0) {
      txt += `⚠️ AVISOS (${r.warnings.length}):\n`;
      r.warnings.forEach((e, i) => txt += `  ${i+1}. ${e}\n`);
      txt += '\n';
    }
    
    if (r.errors.length === 0 && r.securityIssues.length === 0 && r.performanceIssues.length === 0) {
      txt += `✅ PÁGINA PERFEITA! Nenhum problema encontrado!\n\n`;
    }
  });

  fs.writeFileSync('RELATORIO_COMPLETO_FINAL.txt', txt);

  console.log('\n✅ RELATÓRIOS GERADOS:');
  console.log('  📄 RELATORIO_COMPLETO_FINAL.json');
  console.log('  📄 RELATORIO_COMPLETO_FINAL.txt');
  console.log('  📸 screenshots/ (todas as páginas)');
  
  console.log('\n' + txt);
}

main().catch(console.error);

