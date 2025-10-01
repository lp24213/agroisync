# ⚡ Quick Start - AgroSync Backend

## 🚀 Deploy em 5 Minutos

### Passo 1: Login no Cloudflare
```bash
npx wrangler login
```

### Passo 2: Verificar Configuração
```bash
# Verificar se está logado
npx wrangler whoami

# Listar databases D1
npx wrangler d1 list
```

### Passo 3: Aplicar Schema (se necessário)
```bash
cd backend
npx wrangler d1 execute agroisync-db --remote --file=./schema.sql
```

### Passo 4: Deploy Automático
```bash
# Windows PowerShell
.\deploy-cloudflare.ps1

# Linux/Mac
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Passo 5: Testar
```bash
curl https://agroisync.com/api/health
```

---

## ✅ Verificação Rápida

```bash
# 1. Health check
curl https://agroisync.com/api/health

# 2. Criar usuário
curl -X POST https://agroisync.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# 3. Login
curl -X POST https://agroisync.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 📊 Monitorar

```bash
# Ver logs em tempo real
npx wrangler tail

# Ver deployments
npx wrangler deployments list
```

---

## 🔧 Comandos Úteis

```bash
# Deploy
npx wrangler deploy --config wrangler-worker.toml

# Testar localmente
npx wrangler dev --config wrangler-worker.toml --local

# Ver logs
npx wrangler tail

# Rollback
npx wrangler rollback

# Configurar secret
npx wrangler secret put SECRET_NAME
```

---

## 🆘 Problemas Comuns

### Worker não responde
```bash
# Verificar logs
npx wrangler tail

# Testar localmente
npx wrangler dev --config wrangler-worker.toml --local
```

### Erro de autenticação
```bash
npx wrangler logout
npx wrangler login
```

### Banco vazio
```bash
npx wrangler d1 execute agroisync-db --remote --file=./schema.sql
```

---

## 📚 Mais Informações

- **Deploy Completo:** `DEPLOY_INSTRUCTIONS.md`
- **Análise Técnica:** `BACKEND_ANALYSIS_REPORT.md`
- **APIs:** `API-ROUTES-DOCUMENTATION.md`
- **Resumo:** `../SUMMARY_BACKEND_WORK.md`

---

**Pronto para produção! 🎉**

