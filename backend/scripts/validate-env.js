#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Variáveis obrigatórias para produção
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'SOLANA_RPC_URL'
];

// Variáveis opcionais mas recomendadas
const recommendedEnvVars = [
  'REDIS_URL',
  'CORS_ORIGIN',
  'LOG_LEVEL'
];

function validateEnv() {
  console.log('🔍 Validando variáveis de ambiente do backend...');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('⚠️  Arquivo .env não encontrado');
    console.log('📝 Copie env.example para .env e configure as variáveis');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  let hasErrors = false;
  
  // Verificar variáveis obrigatórias
  requiredEnvVars.forEach(varName => {
    if (!envVars[varName] || envVars[varName] === '') {
      console.error(`❌ Variável obrigatória não encontrada: ${varName}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}: ${envVars[varName].substring(0, 20)}...`);
    }
  });
  
  // Verificar variáveis recomendadas
  recommendedEnvVars.forEach(varName => {
    if (!envVars[varName] || envVars[varName] === '') {
      console.warn(`⚠️  Variável recomendada não encontrada: ${varName}`);
    } else {
      console.log(`✅ ${varName}: ${envVars[varName]}`);
    }
  });
  
  // Validações específicas
  if (envVars.JWT_SECRET && envVars.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET deve ter pelo menos 32 caracteres');
    hasErrors = true;
  }
  
  if (envVars.PORT && isNaN(parseInt(envVars.PORT))) {
    console.error('❌ PORT deve ser um número válido');
    hasErrors = true;
  }
  
  if (hasErrors) {
    console.error('\n❌ Validação falhou. Configure as variáveis obrigatórias.');
    process.exit(1);
  }
  
  console.log('\n✅ Validação de ambiente concluída com sucesso!');
}

if (require.main === module) {
  validateEnv();
}

module.exports = validateEnv; 