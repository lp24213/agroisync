# 🚀 Instruções de Deploy - AgroSync Backend

## Visão Geral

Este documento fornece instruções detalhadas para fazer o deploy do backend
AgroSync no Cloudflare Workers com banco de dados D1.

---

## 📋 Pré-requisitos

1. **Node.js** instalado (v18 ou superior)
2. **Conta Cloudflare** com Workers habilitado
3. **Domínio** configurado no Cloudflare (`agroisync.com`)
4. **Wrangler CLI** instalado globalmente ou via npx

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Login no Cloudflare

```bash
npx wrangler login
```

Isso abrirá seu navegador para autorizar o Wrangler.

### 3. Verificar Conta

```bash
npx wrangler whoami
```

---

## 💾 Configuração do Banco de Dados D1

### 1. Criar o Banco de Dados

```bash
npx wrangler d1 create agroisync-db
```

**Importante:** Copie o `database_id` gerado e atualize em
`wrangler-worker.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "agroisync-db"
database_id = "SEU_DATABASE_ID_AQUI"
```

### 2. Aplicar Schema

```bash
# Aplicar localmente (desenvolvimento)
npx wrangler d1 execute agroisync-db --local --file=./schema.sql

# Aplicar remotamente (produção)
npx wrangler d1 execute agroisync-db --remote --file=./schema.sql
```

### 3. Verificar Tabelas

```bash
# Local
npx wrangler d1 execute agroisync-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

# Remoto
npx wrangler d1 execute agroisync-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🔐 Configurar Secrets

Configure as variáveis de ambiente sensíveis:

### JWT Secret

```bash
npx wrangler secret put JWT_SECRET
# Digite: uma string aleatória longa e segura
```

### Stripe (Pagamentos)

```bash
npx wrangler secret put STRIPE_SECRET_KEY
# Digite: sk_live_... ou sk_test_...

npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Digite: whsec_...
```

### Resend (Emails)

```bash
npx wrangler secret put RESEND_API_KEY
# Digite: re_...
```

### Cloudinary (Uploads - Opcional)

```bash
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

---

## 🌐 Configurar Custom Domain

### 1. Adicionar Rotas no wrangler-worker.toml

Já está configurado:

```toml
[[routes]]
pattern = "agroisync.com/api/*"
zone_name = "agroisync.com"

[[routes]]
pattern = "www.agroisync.com/api/*"
zone_name = "agroisync.com"
```

### 2. Verificar DNS

Certifique-se de que o domínio está no Cloudflare:

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Selecione `agroisync.com`
3. Verifique que os nameservers estão corretos
4. DNS deve estar em modo "Proxied" (nuvem laranja)

---

## 🚀 Deploy

### Método 1: Script Automático (Recomendado)

**Windows PowerShell:**

```powershell
cd backend
.\deploy-cloudflare.ps1
```

**Linux/Mac:**

```bash
cd backend
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Método 2: Manual

```bash
cd backend

# 1. Verificar código
npm run lint

# 2. Deploy
npx wrangler deploy --config wrangler-worker.toml

# 3. Verificar
npx wrangler deployments list
```

---

## ✅ Testar o Deploy

### 1. Health Check

```bash
curl https://agroisync.com/api/health
```

Resposta esperada:

```json
{
  "success": true,
  "message": "AgroSync API - Backend ativo",
  "version": "1.0.0",
  "database": "D1 Connected",
  "timestamp": "2025-10-01T...",
  "environment": "production"
}
```

### 2. Teste de Login (após criar usuário)

```bash
curl -X POST https://agroisync.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Teste de Rota Protegida

```bash
curl https://agroisync.com/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

```bash
npx wrangler tail
```

### Ver Logs Filtrados

```bash
# Apenas erros
npx wrangler tail --format=pretty --status=error

# Filtrar por método
npx wrangler tail --method=POST
```

### Verificar Métricas

1. Acesse [Workers Dashboard](https://dash.cloudflare.com)
2. Selecione seu worker `backend`
3. Veja:
   - Requests por segundo
   - Erros
   - Latência
   - CPU time

---

## 🔄 Atualizações

### Deploy de Nova Versão

```bash
cd backend
git pull origin main
npm run lint
npx wrangler deploy --config wrangler-worker.toml
```

### Rollback para Versão Anterior

```bash
# Listar deploys
npx wrangler deployments list

# Fazer rollback
npx wrangler rollback --message="Rollback devido a erro"
```

---

## 🐛 Troubleshooting

### Erro: "No D1 databases configured"

**Solução:** Verifique se `wrangler-worker.toml` tem a configuração correta do
D1:

```toml
[[d1_databases]]
binding = "DB"
database_name = "agroisync-db"
database_id = "seu-database-id"
```

### Erro: "Authentication error"

**Solução:**

```bash
npx wrangler logout
npx wrangler login
```

### Erro: "Route conflicts with existing route"

**Solução:** Remova rotas duplicadas no dashboard do Cloudflare ou no
wrangler.toml

### Worker não responde

**Solução:**

1. Verifique logs: `npx wrangler tail`
2. Teste localmente: `npx wrangler dev --config wrangler-worker.toml`
3. Verifique se o domínio está no Cloudflare

### Banco de dados vazio

**Solução:**

```bash
# Reaplicar schema
npx wrangler d1 execute agroisync-db --remote --file=./schema.sql

# Verificar tabelas
npx wrangler d1 execute agroisync-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 📚 Recursos Adicionais

- [Documentação Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentação D1 Database](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [API Routes Documentation](./API-ROUTES-DOCUMENTATION.md)
- [Backend Analysis Report](./BACKEND_ANALYSIS_REPORT.md)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `npx wrangler tail`
2. Consulte a documentação: `./BACKEND_ANALYSIS_REPORT.md`
3. Teste localmente: `npx wrangler dev --config wrangler-worker.toml --local`

---

**Desenvolvido por:** AgroSync Team  
**Última Atualização:** 01/10/2025
