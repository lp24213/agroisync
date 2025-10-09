#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Agroisync Next.js...\n');

// Verificar se .env.local existe
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Criando .env.local a partir do .env.example...');
  const examplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ .env.local criado! Configure as variáveis de ambiente.\n');
  }
} else {
  console.log('✅ .env.local já existe.\n');
}

// Verificar dependências críticas
console.log('🔍 Verificando configuração...');

const packageJson = require('./package.json');
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'next-sitemap',
  '@marsidev/react-turnstile',
  'resend'
];

const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
if (missingDeps.length > 0) {
  console.log('❌ Dependências faltando:', missingDeps.join(', '));
  console.log('Execute: npm install');
} else {
  console.log('✅ Todas as dependências estão instaladas.');
}

// Verificar arquivos críticos
const criticalFiles = [
  'next.config.js',
  'next-sitemap.config.js',
  'wrangler.toml',
  'pages/_app.js',
  'pages/_document.js',
  'components/ConsentBanner.js'
];

console.log('\n📁 Verificando arquivos críticos...');
criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
  }
});

console.log('\n🛠️  Próximos passos:');
console.log('1. Configure as variáveis em .env.local');
console.log('2. Execute: npm run dev (desenvolvimento)');
console.log('3. Execute: npm run cf:build (build para produção)');
console.log('4. Execute: npm run cf:deploy (deploy no Cloudflare Pages)');

console.log('\n📋 Comandos de teste:');
console.log('• npm run test:a11y - Testes de acessibilidade');
console.log('• npm run ci:lhci - Lighthouse CI');
console.log('• curl -L http://localhost:3000/ | head -50 - Testar SSR');

console.log('\n🔗 Links úteis:');
console.log('• Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/');
console.log('• Resend API: https://resend.com/');
console.log('• Google Analytics: https://analytics.google.com/');

console.log('\n✨ Setup concluído!');
