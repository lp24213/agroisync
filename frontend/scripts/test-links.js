const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configurações
const BASE_URL = 'http://localhost:3000'; // URL base para testes
const OUTPUT_FILE = 'link-test-report.json';
const LOG_FILE = 'link-test.log';

// Estatísticas
let stats = {
  total: 0,
  working: 0,
  broken: 0,
  fixed: 0,
  startTime: new Date(),
  endTime: null,
  links: []
};

// Função para fazer requisição HTTP
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.get(url, { timeout }, (res) => {
      resolve({
        status: res.statusCode,
        working: res.statusCode >= 200 && res.statusCode < 400,
        url: url
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        working: false,
        error: err.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        working: false,
        error: 'Timeout',
        url: url
      });
    });
  });
}

// Função para extrair links de um arquivo
function extractLinksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = [];
  
  // Regex para encontrar links
  const linkPatterns = [
    /href=["']([^"']+)["']/g,
    /to=["']([^"']+)["']/g,
    /router\.push\(["']([^"']+)["']\)/g,
    /window\.location\.href\s*=\s*["']([^"']+)["']/g,
    /navigate\(["']([^"']+)["']\)/g
  ];

  linkPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const link = match[1];
      if (link && !link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
        links.push({
          url: link,
          file: filePath,
          line: content.substring(0, match.index).split('\n').length,
          context: content.substring(Math.max(0, match.index - 50), match.index + 50)
        });
      }
    }
  });

  return links;
}

// Função para testar um link
async function testLink(linkInfo) {
  let url = linkInfo.url;
  
  // Se é um link relativo, adicionar base URL
  if (url.startsWith('/')) {
    url = BASE_URL + url;
  }
  
  // Se não tem protocolo, adicionar http
  if (!url.startsWith('http')) {
    url = 'http://' + url;
  }

  console.log(`Testando: ${url}`);
  
  const result = await makeRequest(url);
  
  return {
    ...linkInfo,
    fullUrl: url,
    status: result.status,
    working: result.working,
    error: result.error
  };
}

// Função para corrigir links quebrados
function fixBrokenLink(linkInfo) {
  const { file, url, line } = linkInfo;
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    // Encontrar a linha com o link quebrado
    const targetLine = lines[line - 1];
    
    // Padrões de correção
    const corrections = [
      // Remover espaços extras
      { pattern: /href=["']\s*([^"']+)\s*["']/g, replacement: 'href="$1"' },
      { pattern: /to=["']\s*([^"']+)\s*["']/g, replacement: 'to="$1"' },
      // Corrigir barras duplas
      { pattern: /\/\//g, replacement: '/' },
      // Adicionar barra inicial se necessário
      { pattern: /href=["']([^\/][^"']*)["']/g, replacement: 'href="/$1"' }
    ];
    
    let fixedLine = targetLine;
    let wasFixed = false;
    
    corrections.forEach(correction => {
      if (correction.pattern.test(fixedLine)) {
        fixedLine = fixedLine.replace(correction.pattern, correction.replacement);
        wasFixed = true;
      }
    });
    
    if (wasFixed) {
      lines[line - 1] = fixedLine;
      fs.writeFileSync(file, lines.join('\n'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Erro ao corrigir link em ${file}:`, error);
    return false;
  }
}

// Função principal
async function testAllLinks() {
  console.log('🔍 Iniciando teste de links...\n');
  
  // Encontrar todos os arquivos JavaScript/JSX
  const jsFiles = [];
  
  function findJsFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findJsFiles(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        jsFiles.push(filePath);
      }
    });
  }
  
  findJsFiles('./src');
  
  console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript/JSX\n`);
  
  // Extrair todos os links
  const allLinks = [];
  jsFiles.forEach(file => {
    try {
      const links = extractLinksFromFile(file);
      allLinks.push(...links);
    } catch (error) {
      console.error(`Erro ao ler arquivo ${file}:`, error);
    }
  });
  
  // Remover duplicatas
  const uniqueLinks = allLinks.filter((link, index, self) => 
    index === self.findIndex(l => l.url === link.url)
  );
  
  stats.total = uniqueLinks.length;
  console.log(`🔗 Encontrados ${uniqueLinks.length} links únicos\n`);
  
  // Testar cada link
  for (let i = 0; i < uniqueLinks.length; i++) {
    const link = uniqueLinks[i];
    console.log(`[${i + 1}/${uniqueLinks.length}] Testando: ${link.url}`);
    
    const result = await testLink(link);
    stats.links.push(result);
    
    if (result.working) {
      stats.working++;
      console.log(`✅ Funcionando (${result.status})`);
    } else {
      stats.broken++;
      console.log(`❌ Quebrado (${result.status || 'Erro'})`);
      
      // Tentar corrigir
      if (fixBrokenLink(result)) {
        stats.fixed++;
        console.log(`🔧 Corrigido automaticamente`);
      }
    }
    
    // Pequena pausa para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  stats.endTime = new Date();
  
  // Gerar relatório
  const report = {
    summary: {
      total: stats.total,
      working: stats.working,
      broken: stats.broken,
      fixed: stats.fixed,
      successRate: ((stats.working / stats.total) * 100).toFixed(2) + '%',
      duration: Math.round((stats.endTime - stats.startTime) / 1000) + 's'
    },
    brokenLinks: stats.links.filter(l => !l.working),
    workingLinks: stats.links.filter(l => l.working),
    fixedLinks: stats.links.filter(l => !l.working && l.fixed)
  };
  
  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // Salvar log
  const log = stats.links.map(l => 
    `${l.working ? '✅' : '❌'} ${l.url} (${l.status || 'Erro'}) - ${l.file}:${l.line}`
  ).join('\n');
  
  fs.writeFileSync(LOG_FILE, log);
  
  // Exibir resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO DE TESTE DE LINKS');
  console.log('='.repeat(50));
  console.log(`Total de Links: ${stats.total}`);
  console.log(`✅ Funcionando: ${stats.working}`);
  console.log(`❌ Quebrados: ${stats.broken}`);
  console.log(`🔧 Corrigidos: ${stats.fixed}`);
  console.log(`📈 Taxa de Sucesso: ${report.summary.successRate}`);
  console.log(`⏱️  Duração: ${report.summary.duration}`);
  console.log('='.repeat(50));
  
  if (stats.broken > 0) {
    console.log('\n🔗 LINKS QUEBRADOS:');
    stats.links.filter(l => !l.working).forEach(link => {
      console.log(`❌ ${link.url} - ${link.file}:${link.line}`);
      if (link.error) console.log(`   Erro: ${link.error}`);
    });
  }
  
  console.log(`\n📄 Relatório salvo em: ${OUTPUT_FILE}`);
  console.log(`📝 Log salvo em: ${LOG_FILE}`);
}

// Executar teste
testAllLinks().catch(console.error);
