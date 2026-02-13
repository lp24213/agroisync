#!/usr/bin/env node
/**
 * Script para gerar chave de criptografia EMAIL_ENCRYPTION_KEY
 * Uso: node scripts/generate-email-key.js
 */

import crypto from 'crypto';

const key = crypto.randomBytes(32).toString('hex');

console.log('\n✅ Chave de criptografia gerada:');
console.log('━'.repeat(64));
console.log(key);
console.log('━'.repeat(64));
console.log('\n📋 Use esta chave no Cloudflare:');
console.log(`   wrangler secret put EMAIL_ENCRYPTION_KEY`);
console.log(`\n   Cole quando solicitado: ${key}\n`);

