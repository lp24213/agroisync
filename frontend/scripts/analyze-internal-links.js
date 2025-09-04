const fs = require('fs');
const path = require('path');

// Configurações
const SRC_DIR = './src';
const OUTPUT_FILE = 'internal-links-report.json';

// Estatísticas
let stats = {
  total: 0,
  internal: 0,
  external: 0,
  broken: 0,
  links: []
};

// Função para extrair links de um arquivo
function extractLinksFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];
    
    // Regex para encontrar links
    const linkPatterns = [
      { pattern: /href=["']([^"']+)["']/g, type: 'href' },
      { pattern: /to=["']([^"']+)["']/g, type: 'to' },
      { pattern: /router\.push\(["']([^"']+)["']\)/g, type: 'router.push' },
      { pattern: /navigate\(["']([^"']+)["']\)/g, type: 'navigate' },
      { pattern: /window\.location\.href\s*=\s*["']([^"']+)["']/g, type: 'window.location' }
    ];

    linkPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const link = match[1];
        if (link && !link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:')) {
          links.push({
            url: link,
            type: type,
            file: filePath,
            line: content.substring(0, match.index).split('\n').length,
            context: content.substring(Math.max(0, match.index - 30), match.index + 30).trim()
          });
        }
      }
    });

    return links;
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return [];
  }
}

// Função para verificar se é link interno
function isInternalLink(url) {
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

// Função para verificar se link interno existe
function checkInternalLink(url, baseDir) {
  if (!url.startsWith('/')) {
    return { exists: false, reason: 'Link relativo não suportado' };
  }
  
  // Remover parâmetros de query
  const cleanUrl = url.split('?')[0];
  
  // Mapear rotas para arquivos
  const routeMap = {
    '/': 'src/pages/Home.js',
    '/home': 'src/pages/Home.js',
    '/loja': 'src/pages/Loja.js',
    '/agroconecta': 'src/pages/AgroConecta.js',
    '/cripto': 'src/pages/Crypto.js',
    '/sobre': 'src/pages/Sobre.js',
    '/contato': 'src/pages/Contato.js',
    '/planos': 'src/pages/Planos.js',
    '/login': 'src/pages/Login.js',
    '/cadastro': 'src/pages/Cadastro.js',
    '/admin': 'src/pages/Admin.js',
    '/admin/login': 'src/pages/AdminLogin.js',
    '/admin-login': 'src/pages/AdminLogin.js',
    '/admin/dashboard': 'src/pages/Admin.js',
    '/dashboard': 'src/pages/Dashboard.js',
    '/ajuda': 'src/pages/Ajuda.js',
    '/faq': 'src/pages/FAQ.js',
    '/termos': 'src/pages/Termos.js',
    '/privacidade': 'src/pages/Privacidade.js',
    '/painel-usuario': 'src/pages/PainelUsuario.js',
    '/verify-email': 'src/pages/VerifyEmail.js',
    '/cadastro-produto': 'src/pages/CadastroProduto.js',
    '/mensageria': 'src/pages/Mensageria.js',
    '/forgot-password': 'src/pages/ForgotPassword.js',
    '/reset-password': 'src/pages/ResetPassword.js',
    '/otp-verification': 'src/pages/OtpVerification.js',
    '/payment-success': 'src/pages/PaymentSuccess.js',
    '/payment-cancel': 'src/pages/PaymentCancel.js',
    '/cotacao': 'src/pages/Cotacao.js',
    '/status': 'src/pages/Status.js',
    '/commodities': 'src/pages/commodities.js',
    '/grains-dashboard': 'src/pages/grains-dashboard.js',
    '/ibge-data': 'src/pages/ibge-data.js',
    '/receita': 'src/pages/receita.js',
    '/global': 'src/pages/global.js',
    '/parcerias': 'src/pages/Parcerias.js',
    '/lgpd': 'src/pages/LGPD.js',
    '/cookies': 'src/pages/Cookies.js',
    '/messages': 'src/pages/Messages.js',
    '/messages-products': 'src/pages/MessagesProducts.js',
    '/messages-freights': 'src/pages/MessagesFreights.js',
    '/admin-panel': 'src/pages/AdminSecurePanel.js',
    '/panel/loja': 'src/pages/Loja.js',
    '/maintenance': 'src/pages/Status.js'
  };
  
  const targetFile = routeMap[cleanUrl];
  
  if (!targetFile) {
    return { exists: false, reason: 'Rota não mapeada' };
  }
  
  const fullPath = path.join(baseDir, targetFile);
  
  if (fs.existsSync(fullPath)) {
    return { exists: true, file: targetFile };
  } else {
    return { exists: false, reason: 'Arquivo não encontrado', expectedFile: targetFile };
  }
}

// Função para encontrar todos os arquivos JS/JSX
function findJsFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(itemPath);
        } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
          files.push(itemPath);
        }
      });
    } catch (error) {
      console.error(`Erro ao escanear diretório ${currentDir}:`, error);
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Função principal
function analyzeLinks() {
  console.log('🔍 Analisando links internos...\n');
  
  // Encontrar todos os arquivos JS/JSX
  const jsFiles = findJsFiles(SRC_DIR);
  console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript/JSX\n`);
  
  // Extrair todos os links
  const allLinks = [];
  jsFiles.forEach(file => {
    const links = extractLinksFromFile(file);
    allLinks.push(...links);
  });
  
  // Remover duplicatas
  const uniqueLinks = allLinks.filter((link, index, self) => 
    index === self.findIndex(l => l.url === link.url)
  );
  
  stats.total = uniqueLinks.length;
  console.log(`🔗 Encontrados ${uniqueLinks.length} links únicos\n`);
  
  // Analisar cada link
  uniqueLinks.forEach((link, index) => {
    console.log(`[${index + 1}/${uniqueLinks.length}] Analisando: ${link.url}`);
    
    if (isInternalLink(link.url)) {
      stats.internal++;
      const check = checkInternalLink(link.url, '.');
      
      if (check.exists) {
        console.log(`✅ Link interno válido -> ${check.file}`);
        stats.links.push({
          ...link,
          status: 'valid',
          targetFile: check.file
        });
      } else {
        stats.broken++;
        console.log(`❌ Link interno quebrado: ${check.reason}`);
        stats.links.push({
          ...link,
          status: 'broken',
          reason: check.reason,
          expectedFile: check.expectedFile
        });
      }
    } else {
      stats.external++;
      console.log(`🌐 Link externo: ${link.url}`);
      stats.links.push({
        ...link,
        status: 'external'
      });
    }
  });
  
  // Gerar relatório
  const report = {
    summary: {
      total: stats.total,
      internal: stats.internal,
      external: stats.external,
      broken: stats.broken,
      validInternal: stats.internal - stats.broken,
      successRate: stats.internal > 0 ? (((stats.internal - stats.broken) / stats.internal) * 100).toFixed(2) + '%' : 'N/A'
    },
    brokenLinks: stats.links.filter(l => l.status === 'broken'),
    validInternalLinks: stats.links.filter(l => l.status === 'valid'),
    externalLinks: stats.links.filter(l => l.status === 'external')
  };
  
  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // Exibir resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO DE LINKS INTERNOS');
  console.log('='.repeat(50));
  console.log(`Total de Links: ${stats.total}`);
  console.log(`🔗 Links Internos: ${stats.internal}`);
  console.log(`✅ Válidos: ${stats.internal - stats.broken}`);
  console.log(`❌ Quebrados: ${stats.broken}`);
  console.log(`🌐 Links Externos: ${stats.external}`);
  console.log(`📈 Taxa de Sucesso: ${report.summary.successRate}`);
  console.log('='.repeat(50));
  
  if (stats.broken > 0) {
    console.log('\n🔗 LINKS QUEBRADOS:');
    stats.links.filter(l => l.status === 'broken').forEach(link => {
      console.log(`❌ ${link.url} - ${link.file}:${link.line}`);
      console.log(`   Motivo: ${link.reason}`);
      if (link.expectedFile) console.log(`   Arquivo esperado: ${link.expectedFile}`);
    });
  }
  
  console.log(`\n📄 Relatório salvo em: ${OUTPUT_FILE}`);
}

// Executar análise
analyzeLinks();
