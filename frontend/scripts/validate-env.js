#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Variáveis obrigatórias para produção
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_RPC_ENDPOINT'
];

// Variáveis opcionais mas recomendadas
const recommendedEnvVars = [
  'NEXT_PUBLIC_CHAIN_ID',
  'NEXT_PUBLIC_NETWORK'
];

function validateEnv() {
  console.log('🔍 Validando variáveis de ambiente...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('⚠️  Arquivo .env.local não encontrado');
    console.log('📝 Copie env.example para .env.local e configure as variáveis');
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