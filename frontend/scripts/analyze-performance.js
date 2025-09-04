const fs = require('fs');
const path = require('path');

// Configurações
const SRC_DIR = './src';
const OUTPUT_FILE = 'performance-report.json';

// Estatísticas
let stats = {
  totalFiles: 0,
  totalLines: 0,
  totalSize: 0,
  components: 0,
  pages: 0,
  services: 0,
  contexts: 0,
  issues: [],
  recommendations: []
};

// Função para analisar um arquivo
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    const lines = content.split('\n');
    const size = stats.size;
    
    return {
      file: filePath,
      lines: lines.length,
      size: size,
      imports: countImports(content),
      components: countComponents(content),
      hooks: countHooks(content),
      effects: countEffects(content),
      stateVariables: countStateVariables(content),
      performanceIssues: findPerformanceIssues(content, filePath)
    };
  } catch (error) {
    console.error(`Erro ao analisar arquivo ${filePath}:`, error);
    return null;
  }
}

// Contar imports
function countImports(content) {
  const importMatches = content.match(/^import\s+.*from\s+['"][^'"]+['"]/gm);
  return importMatches ? importMatches.length : 0;
}

// Contar componentes
function countComponents(content) {
  const componentMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|class\s+\w+/g);
  return componentMatches ? componentMatches.length : 0;
}

// Contar hooks
function countHooks(content) {
  const hookMatches = content.match(/use[A-Z][a-zA-Z]*/g);
  return hookMatches ? hookMatches.length : 0;
}

// Contar useEffect
function countEffects(content) {
  const effectMatches = content.match(/useEffect/g);
  return effectMatches ? effectMatches.length : 0;
}

// Contar variáveis de estado
function countStateVariables(content) {
  const stateMatches = content.match(/useState/g);
  return stateMatches ? stateMatches.length : 0;
}

// Encontrar problemas de performance
function findPerformanceIssues(content, filePath) {
  const issues = [];
  
  // Verificar imports desnecessários
  const unusedImports = findUnusedImports(content);
  if (unusedImports.length > 0) {
    issues.push({
      type: 'unused_imports',
      message: `Imports não utilizados: ${unusedImports.join(', ')}`,
      severity: 'warning'
    });
  }
  
  // Verificar useEffect sem dependências
  const useEffectWithoutDeps = content.match(/useEffect\(\(\)\s*=>\s*\{/g);
  if (useEffectWithoutDeps) {
    issues.push({
      type: 'useEffect_no_deps',
      message: 'useEffect sem array de dependências',
      severity: 'warning'
    });
  }
  
  // Verificar re-renders desnecessários
  const inlineFunctions = content.match(/onClick=\{\(\)\s*=>\s*[^}]+}/g);
  if (inlineFunctions && inlineFunctions.length > 5) {
    issues.push({
      type: 'inline_functions',
      message: 'Muitas funções inline podem causar re-renders',
      severity: 'warning'
    });
  }
  
  // Verificar arquivos muito grandes
  const lines = content.split('\n').length;
  if (lines > 500) {
    issues.push({
      type: 'large_file',
      message: `Arquivo muito grande (${lines} linhas) - considere dividir`,
      severity: 'warning'
    });
  }
  
  // Verificar imports muito pesados
  const heavyImports = content.match(/import\s+\*\s+as\s+\w+\s+from/g);
  if (heavyImports) {
    issues.push({
      type: 'heavy_imports',
      message: 'Imports com * podem aumentar o bundle',
      severity: 'warning'
    });
  }
  
  return issues;
}

// Encontrar imports não utilizados
function findUnusedImports(content) {
  const imports = content.match(/import\s+\{([^}]+)\}\s+from/g);
  if (!imports) return [];
  
  const unused = [];
  imports.forEach(match => {
    const importNames = match[1].split(',').map(name => name.trim());
    importNames.forEach(name => {
      if (!content.includes(name) && name !== 'React') {
        unused.push(name);
      }
    });
  });
  
  return unused;
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
function analyzePerformance() {
  console.log('🔍 Analisando performance do projeto...\n');
  
  // Encontrar todos os arquivos JS/JSX
  const jsFiles = findJsFiles(SRC_DIR);
  console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript/JSX\n`);
  
  // Analisar cada arquivo
  const fileAnalyses = [];
  jsFiles.forEach(file => {
    const analysis = analyzeFile(file);
    if (analysis) {
      fileAnalyses.push(analysis);
      
      // Categorizar arquivo
      if (file.includes('/components/')) {
        stats.components++;
      } else if (file.includes('/pages/')) {
        stats.pages++;
      } else if (file.includes('/services/')) {
        stats.services++;
      } else if (file.includes('/contexts/')) {
        stats.contexts++;
      }
      
      // Acumular estatísticas
      stats.totalFiles++;
      stats.totalLines += analysis.lines;
      stats.totalSize += analysis.size;
      
      // Coletar problemas
      stats.issues.push(...analysis.performanceIssues);
    }
  });
  
  // Gerar recomendações
  generateRecommendations(fileAnalyses);
  
  // Gerar relatório
  const report = {
    summary: {
      totalFiles: stats.totalFiles,
      totalLines: stats.totalLines,
      totalSize: formatBytes(stats.totalSize),
      components: stats.components,
      pages: stats.pages,
      services: stats.services,
      contexts: stats.contexts,
      averageLinesPerFile: Math.round(stats.totalLines / stats.totalFiles),
      averageSizePerFile: formatBytes(stats.totalSize / stats.totalFiles)
    },
    issues: stats.issues,
    recommendations: stats.recommendations,
    fileAnalyses: fileAnalyses.map(analysis => ({
      file: analysis.file,
      lines: analysis.lines,
      size: formatBytes(analysis.size),
      imports: analysis.imports,
      components: analysis.components,
      hooks: analysis.hooks,
      effects: analysis.effects,
      stateVariables: analysis.stateVariables,
      issues: analysis.performanceIssues.length
    }))
  };
  
  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // Exibir resumo
  console.log('='.repeat(50));
  console.log('📊 RELATÓRIO DE PERFORMANCE');
  console.log('='.repeat(50));
  console.log(`📁 Total de Arquivos: ${stats.totalFiles}`);
  console.log(`📄 Total de Linhas: ${stats.totalLines.toLocaleString()}`);
  console.log(`💾 Tamanho Total: ${formatBytes(stats.totalSize)}`);
  console.log(`🧩 Componentes: ${stats.components}`);
  console.log(`📄 Páginas: ${stats.pages}`);
  console.log(`🔧 Serviços: ${stats.services}`);
  console.log(`🔄 Contextos: ${stats.contexts}`);
  console.log(`📊 Média por Arquivo: ${Math.round(stats.totalLines / stats.totalFiles)} linhas`);
  console.log(`⚠️  Problemas Encontrados: ${stats.issues.length}`);
  console.log('='.repeat(50));
  
  if (stats.issues.length > 0) {
    console.log('\n⚠️  PROBLEMAS DE PERFORMANCE:');
    stats.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.message} (${issue.severity})`);
    });
  }
  
  if (stats.recommendations.length > 0) {
    console.log('\n💡 RECOMENDAÇÕES:');
    stats.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log(`\n📄 Relatório salvo em: ${OUTPUT_FILE}`);
}

// Gerar recomendações
function generateRecommendations(fileAnalyses) {
  const totalEffects = fileAnalyses.reduce((sum, file) => sum + file.effects, 0);
  const totalState = fileAnalyses.reduce((sum, file) => sum + file.stateVariables, 0);
  const largeFiles = fileAnalyses.filter(file => file.lines > 300);
  
  if (totalEffects > 50) {
    stats.recommendations.push('Considere usar useMemo e useCallback para otimizar re-renders');
  }
  
  if (totalState > 100) {
    stats.recommendations.push('Considere usar useReducer para gerenciar estado complexo');
  }
  
  if (largeFiles.length > 5) {
    stats.recommendations.push('Considere dividir arquivos grandes em componentes menores');
  }
  
  stats.recommendations.push('Implemente lazy loading para páginas não críticas');
  stats.recommendations.push('Use React.memo para componentes que não mudam frequentemente');
  stats.recommendations.push('Considere implementar code splitting com React.lazy');
}

// Formatar bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Executar análise
analyzePerformance();
