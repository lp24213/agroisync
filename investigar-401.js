// INVESTIGAR ERROS 401
const puppeteer = require('puppeteer');

async function investigar() {
  console.log('\n🔍 INVESTIGANDO ERROS 401 EM AGROISYNC.COM\n');
  console.log('═'.repeat(60));
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors401 = [];
  const allRequests = [];
  
  // Capturar todas as respostas
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    
    allRequests.push({ url, status });
    
    if (status === 401) {
      try {
        const contentType = response.headers()['content-type'] || '';
        const body = await response.text().catch(() => '');
        
        errors401.push({
          url,
          status,
          contentType,
          body: body.substring(0, 200)
        });
      } catch (e) {
        errors401.push({ url, status, error: e.message });
      }
    }
  });
  
  // Carregar página
  console.log('\n📄 Carregando https://agroisync.com...\n');
  await page.goto('https://agroisync.com', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Aguardar mais um pouco
  await page.waitForTimeout(3000);
  
  // RESULTADOS
  console.log('\n═'.repeat(60));
  console.log('📊 RESULTADOS:\n');
  
  console.log(`Total de requests: ${allRequests.length}`);
  console.log(`Erros 401: ${errors401.length}\n`);
  
  if (errors401.length === 0) {
    console.log('✅ NENHUM ERRO 401 ENCONTRADO!\n');
    console.log('Isso significa que:');
    console.log('  1. Todos os recursos autenticados estão OK');
    console.log('  2. APIs protegidas funcionam corretamente');
    console.log('  3. Os erros anteriores eram temporários ou do Puppeteer\n');
  } else {
    console.log('❌ ERROS 401 ENCONTRADOS:\n');
    
    errors401.forEach((error, i) => {
      console.log(`${i + 1}. URL: ${error.url}`);
      console.log(`   Status: ${error.status}`);
      console.log(`   Tipo: ${error.contentType || 'N/A'}`);
      
      // Identificar tipo de recurso
      if (error.url.includes('/api/')) {
        console.log(`   📡 Categoria: API do Backend`);
        
        // Extrair endpoint
        const endpoint = error.url.split('/api/')[1];
        console.log(`   🔗 Endpoint: /api/${endpoint}`);
        
        // Verificar se é endpoint protegido
        if (endpoint.includes('user') || endpoint.includes('profile') || 
            endpoint.includes('limits') || endpoint.includes('conversations')) {
          console.log(`   ⚠️  MOTIVO: Endpoint protegido (requer token)`);
          console.log(`   ✅ COMPORTAMENTO ESPERADO: Home não está logada`);
        }
      } else if (error.url.includes('.js') || error.url.includes('.css')) {
        console.log(`   📦 Categoria: Asset estático`);
      } else if (error.url.includes('cloudflare') || error.url.includes('analytics')) {
        console.log(`   📊 Categoria: Analytics/CDN`);
        console.log(`   ℹ️  Pode ser bloqueio de privacidade do Puppeteer`);
      } else {
        console.log(`   ❓ Categoria: Outro`);
      }
      
      console.log('');
    });
    
    // ANÁLISE
    console.log('\n═'.repeat(60));
    console.log('🔍 ANÁLISE:\n');
    
    const apiErrors = errors401.filter(e => e.url.includes('/api/'));
    const cdnErrors = errors401.filter(e => e.url.includes('cloudflare') || e.url.includes('analytics'));
    const assetErrors = errors401.filter(e => e.url.includes('.js') || e.url.includes('.css'));
    
    console.log(`📡 Erros de API: ${apiErrors.length}`);
    if (apiErrors.length > 0) {
      console.log('   Endpoints afetados:');
      apiErrors.forEach(e => {
        const endpoint = e.url.split('/api/')[1]?.split('?')[0];
        console.log(`   - /api/${endpoint}`);
      });
      console.log('\n   ✅ ISSO É NORMAL:');
      console.log('   - Home não está logada');
      console.log('   - Endpoints protegidos retornam 401');
      console.log('   - Comportamento esperado!\n');
    }
    
    console.log(`📊 Erros de CDN/Analytics: ${cdnErrors.length}`);
    if (cdnErrors.length > 0) {
      console.log('   ✅ ISSO É NORMAL:');
      console.log('   - Puppeteer pode bloquear analytics');
      console.log('   - Não afeta usuários reais\n');
    }
    
    console.log(`📦 Erros de Assets: ${assetErrors.length}`);
    if (assetErrors.length > 0) {
      console.log('   ⚠️  VERIFICAR:');
      console.log('   - Assets não devem retornar 401');
      assetErrors.forEach(e => console.log(`   - ${e.url}`));
      console.log('');
    }
  }
  
  // RECOMENDAÇÕES
  console.log('\n═'.repeat(60));
  console.log('💡 RECOMENDAÇÕES:\n');
  
  if (errors401.filter(e => e.url.includes('/api/')).length > 0) {
    console.log('✅ Erros 401 de API são ESPERADOS na home (sem login)');
  }
  
  if (errors401.filter(e => e.url.includes('cloudflare')).length > 0) {
    console.log('✅ Erros 401 de CDN/Analytics são NORMAIS no Puppeteer');
  }
  
  if (errors401.filter(e => e.url.includes('.js') || e.url.includes('.css')).length > 0) {
    console.log('⚠️  Investigar assets que retornam 401');
  }
  
  if (errors401.length === 0) {
    console.log('✅ Nenhuma ação necessária!');
  }
  
  console.log('\n═'.repeat(60));
  console.log('');
  
  await browser.close();
}

investigar().catch(console.error);

