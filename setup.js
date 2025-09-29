#!/usr/bin/env node

/**
 * AGROISYNC - Setup Script
 * 
 * Script interativo para configurar o projeto pela primeira vez.
 * Copia arquivos .env.example, instala dependências e valida configuração.
 * 
 * USO: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`)
};

// Interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Verificar se arquivo existe
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

// Copiar arquivo
const copyFile = (source, destination) => {
  try {
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    log.error(`Erro ao copiar ${source}: ${error.message}`);
    return false;
  }
};

// Executar comando
const runCommand = (command, cwd = process.cwd()) => {
  try {
    log.info(`Executando: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Erro ao executar comando: ${error.message}`);
    return false;
  }
};

// Etapa 1: Banner
const showBanner = () => {
  console.clear();
  console.log(`
${colors.green}╔═══════════════════════════════════════════════════════╗
║                                                       ║
║          🌾 AGROISYNC - Setup Script 🌾              ║
║                                                       ║
║     Configuração automática do projeto AgroSync      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝${colors.reset}
  `);
};

// Etapa 2: Verificar estrutura do projeto
const checkProjectStructure = () => {
  log.title('📁 Verificando estrutura do projeto...');
  
  const requiredDirs = ['frontend', 'backend'];
  const missingDirs = [];
  
  for (const dir of requiredDirs) {
    if (!fileExists(dir)) {
      missingDirs.push(dir);
      log.error(`Diretório ${dir} não encontrado`);
    } else {
      log.success(`Diretório ${dir} encontrado`);
    }
  }
  
  if (missingDirs.length > 0) {
    log.error('Estrutura do projeto incompleta!');
    return false;
  }
  
  return true;
};

// Etapa 3: Configurar arquivos .env
const setupEnvFiles = async () => {
  log.title('⚙️  Configurando arquivos .env...');
  
  const envConfigs = [
    { dir: 'frontend', example: 'env.example', target: '.env' },
    { dir: 'backend', example: 'env.example', target: '.env' }
  ];
  
  for (const config of envConfigs) {
    const examplePath = path.join(config.dir, config.example);
    const targetPath = path.join(config.dir, config.target);
    
    // Verificar se .env.example existe
    if (!fileExists(examplePath)) {
      log.warning(`${examplePath} não encontrado, pulando...`);
      continue;
    }
    
    // Verificar se .env já existe
    if (fileExists(targetPath)) {
      const answer = await question(
        `${colors.yellow}⚠${colors.reset} ${targetPath} já existe. Sobrescrever? (s/N): `
      );
      
      if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'sim') {
        log.info(`Mantendo ${targetPath} existente`);
        continue;
      }
    }
    
    // Copiar arquivo
    if (copyFile(examplePath, targetPath)) {
      log.success(`Criado ${targetPath}`);
      log.warning(`⚠️  Edite ${targetPath} e configure suas chaves reais!`);
    }
  }
};

// Etapa 4: Instalar dependências
const installDependencies = async () => {
  log.title('📦 Instalando dependências...');
  
  const answer = await question(
    `${colors.cyan}?${colors.reset} Deseja instalar dependências agora? (S/n): `
  );
  
  if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'não') {
    log.info('Pulando instalação de dependências');
    return true;
  }
  
  // Frontend
  log.info('Instalando dependências do frontend...');
  if (!runCommand('npm install', 'frontend')) {
    log.error('Falha ao instalar dependências do frontend');
    return false;
  }
  log.success('Dependências do frontend instaladas');
  
  // Backend
  log.info('Instalando dependências do backend...');
  if (!runCommand('npm install', 'backend')) {
    log.error('Falha ao instalar dependências do backend');
    return false;
  }
  log.success('Dependências do backend instaladas');
  
  return true;
};

// Etapa 5: Validar configuração
const validateConfiguration = () => {
  log.title('✓ Validando configuração...');
  
  const checks = [
    {
      name: 'Frontend .env',
      path: 'frontend/.env',
      required: true
    },
    {
      name: 'Backend .env',
      path: 'backend/.env',
      required: true
    },
    {
      name: 'Frontend node_modules',
      path: 'frontend/node_modules',
      required: false
    },
    {
      name: 'Backend node_modules',
      path: 'backend/node_modules',
      required: false
    }
  ];
  
  let allOk = true;
  
  for (const check of checks) {
    if (fileExists(check.path)) {
      log.success(check.name);
    } else {
      if (check.required) {
        log.error(`${check.name} não encontrado`);
        allOk = false;
      } else {
        log.warning(`${check.name} não encontrado (opcional)`);
      }
    }
  }
  
  return allOk;
};

// Etapa 6: Mostrar próximos passos
const showNextSteps = () => {
  log.title('🚀 Próximos passos:');
  
  console.log(`
${colors.bright}1. Configurar variáveis de ambiente:${colors.reset}
   ${colors.cyan}Frontend:${colors.reset} Edite frontend/.env com suas chaves reais
   ${colors.cyan}Backend:${colors.reset} Edite backend/.env com suas chaves reais

${colors.bright}2. Configurar chaves importantes:${colors.reset}
   ${colors.yellow}⚠️  MongoDB:${colors.reset} MONGODB_URI
   ${colors.yellow}⚠️  JWT:${colors.reset} JWT_SECRET e JWT_REFRESH_SECRET
   ${colors.yellow}⚠️  Stripe:${colors.reset} STRIPE_SECRET_KEY e STRIPE_PUBLISHABLE_KEY
   ${colors.yellow}⚠️  APIs:${colors.reset} OpenWeather, Cloudflare, etc.

${colors.bright}3. Iniciar o projeto:${colors.reset}
   ${colors.green}Terminal 1:${colors.reset} cd backend && npm run dev
   ${colors.green}Terminal 2:${colors.reset} cd frontend && npm start

${colors.bright}4. Acessar o projeto:${colors.reset}
   ${colors.cyan}Frontend:${colors.reset} http://localhost:3000
   ${colors.cyan}Backend:${colors.reset} http://localhost:3001

${colors.bright}5. Ler a documentação:${colors.reset}
   📖 IMPROVEMENTS_GUIDE.md - Como usar as melhorias
   📊 EXECUTION_REPORT.md - Relatório completo
   ✅ IMPROVEMENTS_CHECKLIST.md - Checklist de ações
  `);
};

// Função principal
const main = async () => {
  try {
    showBanner();
    
    // Verificar estrutura
    if (!checkProjectStructure()) {
      log.error('Estrutura do projeto inválida. Execute este script na raiz do projeto.');
      process.exit(1);
    }
    
    // Configurar .env
    await setupEnvFiles();
    
    // Instalar dependências
    await installDependencies();
    
    // Validar configuração
    const isValid = validateConfiguration();
    
    // Mostrar próximos passos
    showNextSteps();
    
    // Mensagem final
    if (isValid) {
      log.success('\n✨ Setup concluído com sucesso!\n');
    } else {
      log.warning('\n⚠️  Setup concluído com avisos. Verifique as mensagens acima.\n');
    }
    
  } catch (error) {
    log.error(`Erro durante setup: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Executar
main();
