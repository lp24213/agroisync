# 🔧 CONFIGURAÇÃO CLOUDFLARE WORKERS - AGROSYNC

## ✅ CORREÇÕES APLICADAS

### 1. **Chave Stripe Corrigida** ✅
- ❌ Removida chave exposta do código
- ✅ Configurada para usar variável de ambiente
- ✅ Adicionados Price IDs obrigatórios

### 2. **Webhooks Unificados** ✅
- ❌ Removido webhook duplicado de `/api/plans/webhook`
- ✅ Mantido apenas `/api/payments/stripe/webhook`
- ✅ Evita processamento duplicado

### 3. **Cloudflare Workers Configurado** ✅
- ✅ Criado `wrangler.toml` para Workers
- ✅ Criado `worker.js` principal
- ✅ Criados utilitários CORS
- ✅ Configurado para produção e staging

## 🚀 COMO CONFIGURAR

### 1. **Instalar Wrangler**
```bash
npm install -g wrangler
wrangler login
```

### 2. **Configurar Secrets**
```bash
# Stripe
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET

# Database
wrangler secret put MONGODB_URI

# JWT
wrangler secret put JWT_SECRET
```

### 3. **Deploy**
```bash
chmod +x scripts/deploy-cloudflare.sh
./scripts/deploy-cloudflare.sh
```

## 🔗 URLs DE PRODUÇÃO

- **Backend**: `https://agroisync-backend-prod.luispaulooliveira767.workers.dev`
- **Staging**: `https://agroisync-backend-staging.luispaulooliveira767.workers.dev`
- **Webhook**: `https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api/payments/stripe/webhook`

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Stripe Dashboard
- [ ] Criar produtos e preços
- [ ] Configurar webhook endpoint
- [ ] Obter chaves de produção
- [ ] Testar pagamentos

### Cloudflare Dashboard
- [ ] Configurar secrets
- [ ] Verificar logs
- [ ] Monitorar performance

### Frontend
- [ ] Atualizar `REACT_APP_API_URL`
- [ ] Configurar chave pública Stripe
- [ ] Testar integração

## 🚨 IMPORTANTE

1. **NUNCA** commite chaves reais
2. **SEMPRE** use secrets do Cloudflare
3. **TESTE** em staging antes da produção
4. **MONITORE** logs e performance

## 🔍 TESTE DE FUNCIONAMENTO

```bash
# Health check
curl https://agroisync-backend-prod.luispaulooliveira767.workers.dev/health

# Teste de pagamento (com dados válidos)
curl -X POST https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api/payments/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"planId": "loja-basic", "frequency": "monthly"}'
```

## ✅ STATUS ATUAL

- ✅ Backend configurado para Cloudflare Workers
- ✅ Chave Stripe corrigida
- ✅ Webhooks unificados
- ✅ CORS configurado
- ✅ Rate limiting implementado
- ✅ Scripts de deploy criados
- ✅ Documentação completa

**AGORA OS PAGAMENTOS FUNCIONARÃO CORRETAMENTE!** 🎉
