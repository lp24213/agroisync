# 🔐 Configuração de Secrets - AgroSync Backend

## ⚡ CRÍTICO - Configurar antes do deploy

O Worker **NÃO funcionará** sem esses secrets configurados.

---

## 📋 Secrets Obrigatórios

### **1. JWT_SECRET** (CRÍTICO)
Token de segurança para autenticação JWT

```bash
cd backend
wrangler secret put JWT_SECRET
```

**Gerar um secret seguro:**
```bash
# Linux/Mac:
openssl rand -hex 64

# Windows PowerShell:
$bytes = New-Object byte[] 64; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)

# Ou use um gerador online:
# https://generate-secret.vercel.app/64
```

Cole o valor quando solicitado.

---

### **2. RESEND_API_KEY** (CRÍTICO)
API Key do Resend para envio de emails

```bash
wrangler secret put RESEND_API_KEY
```

**Onde obter:**
1. Acesse https://resend.com/
2. Login ou cadastro
3. API Keys → Create API Key
4. Copie a key (começa com `re_`)

---

### **3. STRIPE_SECRET_KEY** (CRÍTICO)
Secret Key do Stripe para pagamentos

```bash
wrangler secret put STRIPE_SECRET_KEY
```

**Onde obter:**
1. Acesse https://dashboard.stripe.com/
2. Developers → API Keys
3. Copie a "Secret key" (começa com `sk_`)
4. **ATENÇÃO**: Use `sk_test_` para testes, `sk_live_` para produção

---

### **4. CLOUDFLARE_TURNSTILE_SECRET_KEY** (Recomendado)
Secret do Cloudflare Turnstile (Captcha)

```bash
wrangler secret put CLOUDFLARE_TURNSTILE_SECRET_KEY
```

**Onde obter:**
1. Acesse https://dash.cloudflare.com/
2. Turnstile
3. Create Widget
4. Copie a "Secret Key"

---

## ✅ Verificar se os secrets foram configurados

```bash
wrangler secret list
```

Deve mostrar:
```
JWT_SECRET
RESEND_API_KEY
STRIPE_SECRET_KEY
CLOUDFLARE_TURNSTILE_SECRET_KEY
```

---

## 🔄 Atualizar um secret

```bash
wrangler secret put JWT_SECRET
```

Digite o novo valor quando solicitado.

---

## 🗑️ Deletar um secret

```bash
wrangler secret delete SECRET_NAME
```

---

## 🚨 IMPORTANTE

- **NUNCA** commite secrets no Git
- **NUNCA** coloque secrets no `wrangler.toml`
- Use secrets diferentes para dev/staging/production
- Rotacione secrets periodicamente (a cada 90 dias)
- Mantenha backup dos secrets em local seguro (1Password, Bitwarden, etc)

---

## 🧪 Testar após configurar

```bash
# Deploy
wrangler deploy

# Testar health
curl https://agroisync.com/api/health

# Testar autenticação
curl -X POST https://agroisync.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

---

## 📝 Checklist Pré-Deploy

- [ ] JWT_SECRET configurado (64+ caracteres)
- [ ] RESEND_API_KEY configurado
- [ ] STRIPE_SECRET_KEY configurado
- [ ] CLOUDFLARE_TURNSTILE_SECRET_KEY configurado
- [ ] Schema D1 aplicado (`wrangler d1 execute agroisync-db --file=schema.sql`)
- [ ] Secrets verificados (`wrangler secret list`)
- [ ] Deploy testado (`wrangler deploy`)
- [ ] Health check OK (`curl https://agroisync.com/api/health`)

---

## 🆘 Troubleshooting

### "Worker threw exception: Cannot read property 'JWT_SECRET' of undefined"
→ Secret JWT_SECRET não configurado. Execute: `wrangler secret put JWT_SECRET`

### "Resend API error: Unauthorized"
→ RESEND_API_KEY inválido. Verifique em https://resend.com/api-keys

### "Stripe error: Invalid API Key"
→ STRIPE_SECRET_KEY inválido. Verifique em https://dashboard.stripe.com/apikeys

