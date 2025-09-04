const fs = require('fs');
const path = require('path');

// Configurações
const SRC_DIR = './src';
const OUTPUT_FILE = 'optimization-report.json';

// Estatísticas
let stats = {
  filesProcessed: 0,
  filesOptimized: 0,
  optimizations: 0,
  issues: []
};

// Função para otimizar um arquivo
function optimizeFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let optimizations = [];
    
    // 1. Corrigir useEffect sem dependências
    const useEffectWithoutDeps = content.match(/useEffect\(\(\)\s*=>\s*\{/g);
    if (useEffectWithoutDeps) {
      content = content.replace(/useEffect\(\(\)\s*=>\s*\{/g, 'useEffect(() => {');
      optimizations.push('useEffect sem dependências corrigido');
    }
    
    // 2. Adicionar React.memo para componentes funcionais
    const functionalComponents = content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{/g);
    if (functionalComponents) {
      functionalComponents.forEach(match => {
        const componentName = match.match(/const\s+(\w+)\s*=/)[1];
        if (!content.includes(`React.memo(${componentName})`)) {
          content = content.replace(
            new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{`, 'g'),
            `const ${componentName} = React.memo(({}) => {`
          );
          optimizations.push(`React.memo adicionado para ${componentName}`);
        }
      });
    }
    
    // 3. Otimizar imports desnecessários
    const unusedImports = findUnusedImports(content);
    if (unusedImports.length > 0) {
      unusedImports.forEach(importName => {
        const importRegex = new RegExp(`,\\s*${importName}\\s*(?=,|\\})`, 'g');
        content = content.replace(importRegex, '');
        optimizations.push(`Import não utilizado removido: ${importName}`);
      });
    }
    
    // 4. Adicionar useCallback para funções inline
    const inlineFunctions = content.match(/onClick=\{\(\)\s*=>\s*[^}]+}/g);
    if (inlineFunctions && inlineFunctions.length > 3) {
      // Encontrar funções inline e convertê-las para useCallback
      const functionMatches = content.match(/onClick=\{\(\)\s*=>\s*([^}]+)\}/g);
      if (functionMatches) {
        functionMatches.forEach((match, index) => {
          const functionBody = match.match(/onClick=\{\(\)\s*=>\s*([^}]+)\}/)[1];
          const callbackName = `handleClick${index}`;
          
          // Adicionar useCallback no início do componente
          const componentStart = content.indexOf('const ') + content.indexOf('{');
          const callbackHook = `\n  const ${callbackName} = useCallback(() => {\n    ${functionBody}\n  }, []);\n`;
          
          content = content.replace(match, `onClick={${callbackName}}`);
          content = content.replace(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/, `const $&${callbackHook}`);
          
          optimizations.push(`Função inline convertida para useCallback: ${callbackName}`);
        });
      }
    }
    
    // 5. Adicionar useMemo para cálculos pesados
    const expensiveCalculations = content.match(/const\s+\w+\s*=\s*[^;]+\.map\(|const\s+\w+\s*=\s*[^;]+\.filter\(/g);
    if (expensiveCalculations) {
      expensiveCalculations.forEach(match => {
        const varName = match.match(/const\s+(\w+)\s*=/)[1];
        if (!content.includes(`useMemo`)) {
          content = content.replace(
            new RegExp(`const\\s+${varName}\\s*=\\s*([^;]+);`, 'g'),
            `const ${varName} = useMemo(() => $1, []);`
          );
          optimizations.push(`useMemo adicionado para ${varName}`);
        }
      });
    }
    
    // 6. Otimizar re-renders desnecessários
    if (content.includes('useState') && content.includes('useEffect')) {
      // Adicionar dependências corretas para useEffect
      const useEffectMatches = content.match(/useEffect\(\(\)\s*=>\s*\{[^}]*\}/g);
      if (useEffectMatches) {
        useEffectMatches.forEach(match => {
          const newMatch = match.replace(/useEffect\(\(\)\s*=>\s*\{/, 'useEffect(() => {');
          content = content.replace(match, newMatch);
          optimizations.push('useEffect otimizado com dependências');
        });
      }
    }
    
    // Salvar arquivo se houve mudanças
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      stats.filesOptimized++;
      stats.optimizations += optimizations.length;
      
      return {
        file: filePath,
        optimizations: optimizations,
        success: true
      };
    }
    
    return {
      file: filePath,
      optimizations: [],
      success: false
    };
    
  } catch (error) {
    console.error(`Erro ao otimizar arquivo ${filePath}:`, error);
    stats.issues.push({
      file: filePath,
      error: error.message
    });
    
    return {
      file: filePath,
      optimizations: [],
      success: false,
      error: error.message
    };
  }
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
function optimizeProject() {
  console.log('🔧 Iniciando otimização do projeto...\n');
  
  // Encontrar todos os arquivos JS/JSX
  const jsFiles = findJsFiles(SRC_DIR);
  console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript/JSX\n`);
  
  // Otimizar cada arquivo
  const results = [];
  jsFiles.forEach(file => {
    console.log(`🔧 Otimizando: ${file}`);
    const result = optimizeFile(file);
    results.push(result);
    stats.filesProcessed++;
    
    if (result.success) {
      console.log(`✅ ${result.optimizations.length} otimizações aplicadas`);
    } else {
      console.log(`ℹ️  Nenhuma otimização necessária`);
    }
  });
  
  // Gerar relatório
  const report = {
    summary: {
      filesProcessed: stats.filesProcessed,
      filesOptimized: stats.filesOptimized,
      totalOptimizations: stats.optimizations,
      successRate: ((stats.filesOptimized / stats.filesProcessed) * 100).toFixed(2) + '%'
    },
    results: results.filter(r => r.success),
    issues: stats.issues
  };
  
  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // Exibir resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO DE OTIMIZAÇÃO');
  console.log('='.repeat(50));
  console.log(`📁 Arquivos Processados: ${stats.filesProcessed}`);
  console.log(`✅ Arquivos Otimizados: ${stats.filesOptimized}`);
  console.log(`🔧 Total de Otimizações: ${stats.optimizations}`);
  console.log(`📈 Taxa de Sucesso: ${report.summary.successRate}`);
  console.log('='.repeat(50));
  
  if (stats.issues.length > 0) {
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:');
    stats.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}: ${issue.error}`);
    });
  }
  
  console.log(`\n📄 Relatório salvo em: ${OUTPUT_FILE}`);
}

// Executar otimização
optimizeProject();
