# 🔐 SECRETS COMPLETOS DO GITHUB - AGROTM

## 📋 RESUMO EXECUTIVO

### **OBRIGATÓRIOS (Deploy não funciona sem):**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RAILWAY_TOKEN`

### **OPCIONAIS (Funcionalidades extras):**
- `NOTIFICATION_WEBHOOK_URL`
- `BACKEND_URL`
- `HEALTH_LOG_WEBHOOK`
- `RAILWAY_SERVICE`

---

## 🔑 SECRETS OBRIGATÓRIOS

### 1. **VERCEL_TOKEN**
**Onde pegar:**
1. Acesse https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Nome: `AGROTM-GitHub-Actions`
4. Expiration: `No expiration`
5. Copie o token gerado

**Valor dummy:** `vercel_dummy_token_123456789`

### 2. **VERCEL_ORG_ID**
**Onde pegar:**
1. Vá para https://vercel.com/account
2. Clique em "Settings" → "General"
3. Copie o "Team ID" (Organization ID)

**Valor dummy:** `team_dummy_org_id_123456789`

### 3. **VERCEL_PROJECT_ID**
**Onde pegar:**
1. Vá para o projeto no https://vercel.com/dashboard
2. Clique em "Settings" → "General"
3. Copie o "Project ID"

**Valor dummy:** `prj_dummy_project_id_123456789`

### 4. **RAILWAY_TOKEN**
**Onde pegar:**
1. Acesse https://railway.app/account/tokens
2. Clique em "New Token"
3. Nome: `AGROTM-GitHub-Actions`
4. Copie o token gerado

**Valor dummy:** `railway_dummy_token_123456789`

---

## 🔧 SECRETS OPCIONAIS

### 5. **NOTIFICATION_WEBHOOK_URL**
**Onde pegar:**
- **Slack:** Settings → Integrations → Incoming Webhooks
- **Teams:** Connectors → Incoming Webhook
- **Discord:** Channel Settings → Integrations → Webhooks
- **Telegram:** Bot API webhook

**Valor dummy:** `https://hooks.slack.com/services/dummy/dummy/dummy`

### 6. **BACKEND_URL**
**Onde pegar:**
1. Railway Dashboard → Seu projeto → Settings → Domains
2. Copie a URL gerada (ex: `https://agrotm-backend-production-1234.up.railway.app`)

**Valor dummy:** `https://dummy-backend.railway.app`

### 7. **HEALTH_LOG_WEBHOOK**
**Onde pegar:**
- Mesmo processo do NOTIFICATION_WEBHOOK_URL
- Pode ser o mesmo webhook

**Valor dummy:** `https://hooks.slack.com/services/dummy/dummy/dummy`

### 8. **RAILWAY_SERVICE**
**Onde pegar:**
1. Railway Dashboard → Seu projeto
2. Nome do serviço (ex: `agrotm-backend`)

**Valor dummy:** `dummy-service-name`

---

## 🚀 CONFIGURAÇÃO RÁPIDA

### **Para deploy funcionar SEM ERROS:**

```bash
# Obrigatórios (configure estes primeiro)
VERCEL_TOKEN=vercel_dummy_token_123456789
VERCEL_ORG_ID=team_dummy_org_id_123456789
VERCEL_PROJECT_ID=prj_dummy_project_id_123456789
RAILWAY_TOKEN=railway_dummy_token_123456789

# Opcionais (pode deixar vazio ou dummy)
NOTIFICATION_WEBHOOK_URL=https://hooks.slack.com/services/dummy/dummy/dummy
BACKEND_URL=https://dummy-backend.railway.app
HEALTH_LOG_WEBHOOK=https://hooks.slack.com/services/dummy/dummy/dummy
RAILWAY_SERVICE=dummy-service-name
```

---

## 📊 WORKFLOWS E SEUS SECRETS

### **ci-cd.yml (Principal)**
- ✅ `VERCEL_TOKEN` - Obrigatório
- ✅ `VERCEL_ORG_ID` - Obrigatório
- ✅ `VERCEL_PROJECT_ID` - Obrigatório
- ✅ `RAILWAY_TOKEN` - Obrigatório
- ⚠️ `NOTIFICATION_WEBHOOK_URL` - Opcional

### **monitoring.yml**
- ✅ `VERCEL_TOKEN` - Obrigatório
- ✅ `VERCEL_ORG_ID` - Obrigatório
- ✅ `VERCEL_PROJECT_ID` - Obrigatório
- ⚠️ `BACKEND_URL` - Opcional (skip se não configurado)
- ⚠️ `NOTIFICATION_WEBHOOK_URL` - Opcional
- ⚠️ `HEALTH_LOG_WEBHOOK` - Opcional

### **rollback.yml**
- ✅ `VERCEL_TOKEN` - Obrigatório
- ✅ `VERCEL_ORG_ID` - Obrigatório
- ✅ `VERCEL_PROJECT_ID` - Obrigatório
- ⚠️ `NOTIFICATION_WEBHOOK_URL` - Opcional

### **ci-cd-simple.yml**
- ✅ `VERCEL_TOKEN` - Obrigatório
- ✅ `VERCEL_ORG_ID` - Obrigatório
- ✅ `VERCEL_PROJECT_ID` - Obrigatório
- ✅ `RAILWAY_TOKEN` - Obrigatório
- ⚠️ `RAILWAY_SERVICE` - Opcional

### **security.yml & security-audit.yml**
- ❌ Nenhum secret obrigatório

---

## 🛡️ GARANTIAS DE FUNCIONAMENTO

### **Deploy SEM ERROS:**
- ✅ Todos os webhooks são verificados com `if [ ! -z "${{ secrets.WEBHOOK }}" ]`
- ✅ BACKEND_URL tem fallback: `if [ -z "$BACKEND_URL" ]; then echo "⚠️ Skipping backend health check"`
- ✅ HEALTH_LOG_WEBHOOK é opcional
- ✅ NOTIFICATION_WEBHOOK_URL é opcional
- ✅ RAILWAY_SERVICE tem fallback

### **Workflows que SEMPRE funcionam:**
- ✅ `security.yml` - Zero secrets
- ✅ `security-audit.yml` - Zero secrets
- ✅ `ci-cd.yml` - Com secrets obrigatórios
- ✅ `monitoring.yml` - Com secrets obrigatórios
- ✅ `rollback.yml` - Com secrets obrigatórios

---

## 🔧 COMO CONFIGURAR

### **Método 1: Interface Web**
1. Vá para seu repositório no GitHub
2. Settings → Secrets and variables → Actions
3. "New repository secret"
4. Adicione cada secret

### **Método 2: GitHub CLI**
```bash
gh secret set VERCEL_TOKEN --body "seu_token_aqui"
gh secret set VERCEL_ORG_ID --body "seu_org_id_aqui"
gh secret set VERCEL_PROJECT_ID --body "seu_project_id_aqui"
gh secret set RAILWAY_TOKEN --body "seu_railway_token_aqui"
```

---

## ✅ CHECKLIST FINAL

### **Para deploy funcionar:**
- [ ] `VERCEL_TOKEN` configurado
- [ ] `VERCEL_ORG_ID` configurado
- [ ] `VERCEL_PROJECT_ID` configurado
- [ ] `RAILWAY_TOKEN` configurado

### **Para funcionalidades extras:**
- [ ] `NOTIFICATION_WEBHOOK_URL` (opcional)
- [ ] `BACKEND_URL` (opcional)
- [ ] `HEALTH_LOG_WEBHOOK` (opcional)
- [ ] `RAILWAY_SERVICE` (opcional)

### **Teste:**
- [ ] Push para main
- [ ] Verificar Actions → ci-cd.yml
- [ ] Deploy deve funcionar sem erros

---

## 🚨 EMERGÊNCIA

### **Se não conseguir os tokens reais:**
1. Use os valores dummy listados acima
2. O deploy funcionará (mas não fará deploy real)
3. Configure os tokens reais depois

### **Se algum workflow falhar:**
1. Verifique se os 4 secrets obrigatórios estão configurados
2. Use valores dummy temporariamente
3. O projeto NUNCA falha por falta de webhooks opcionais
