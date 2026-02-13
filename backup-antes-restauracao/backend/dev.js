#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração
const config = {
  port: process.env.PORT || 8787,
  bindingsFile: '.dev.vars',
  compatibilityDate: '2024-09-23'
};

// Verifica e cria arquivo de bindings se não existir
function ensureBindings() {
  const bindingsPath = path.join(process.cwd(), config.bindingsFile);
  if (!fs.existsSync(bindingsPath)) {
    const defaultBindings = `
NODE_ENV=development
API_VERSION=v1
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8787
LOG_LEVEL=debug
ENABLE_METRICS=false
MAX_UPLOAD_SIZE=10mb
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Cloudflare Turnstile em desenvolvimento
CF_TURNSTILE_ENABLED=false
CF_TURNSTILE_SITE_KEY=1x0000000000000000000000000000000AA
CF_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
CF_TURNSTILE_TIMEOUT=30s

# Resend em desenvolvimento
RESEND_ENABLED=false
RESEND_API_KEY=re_123456789
RESEND_FROM_EMAIL=dev@localhost
RESEND_DOMAIN=localhost
EMAIL_RETRY_ATTEMPTS=3
EMAIL_RETRY_DELAY=5s

# JWT e Segurança
JWT_SECRET=desenvolvimento_local_nao_usar_em_producao
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=refresh_desenvolvimento_local_nao_usar_em_producao
JWT_REFRESH_EXPIRES_IN=30d
PASSWORD_MIN_LENGTH=8
PASSWORD_HASH_ROUNDS=10
SESSION_TIMEOUT=24h
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENABLE_CSRF=false
SECURE_HEADERS=true
XSS_PROTECTION=true
    `.trim();

    fs.writeFileSync(bindingsPath, defaultBindings);
    console.log(`Arquivo de bindings criado em ${config.bindingsFile}`);
  }
}

// Executa wrangler com as configurações corretas
function runWrangler() {
  try {
    ensureBindings();

    const command = `npx wrangler dev src/worker.js \
      --local \
      --port ${config.port} \
      --compatibility-date=${config.compatibilityDate} \
      --var-path=${config.bindingsFile} \
      --experimental-local \
      --persist`;

    console.log('Iniciando servidor de desenvolvimento...');
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

runWrangler();