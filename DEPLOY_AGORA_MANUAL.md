# 🚀 DEPLOY MANUAL AGORA - PASSO A PASSO

## ⚠️ PROBLEMA ATUAL

O token do Cloudflare está **EXPIRADO** ou **SEM PERMISSÃO**.

Erro: `Unable to authenticate request [code: 10001]`

## 🔧 SOLUÇÃO - FAZER AGORA:

### 1️⃣ RENOVAR TOKEN DO CLOUDFLARE

```powershell
# Limpar token antigo
wrangler logout

# Fazer login de novo (vai abrir o navegador)
wrangler login
```

**Se der erro de "You are logged in with an API Token":**

```powershell
# Remover variável de ambiente
$env:CF_API_TOKEN = ""
$env:CLOUDFLARE_API_TOKEN = ""

# Tentar login de novo
wrangler login
```

### 2️⃣ DEPLOY DO BACKEND

```powershell
cd backend
wrangler deploy src/cloudflare-worker.js
```

### 3️⃣ DEPLOY DO FRONTEND

```powershell
cd ..
cd frontend

# Build (se ainda não fez)
npm run build

# Deploy
wrangler pages deploy build --project-name=agroisync
```

---

## 🎯 ALTERNATIVA: DEPLOY PELO DASHBOARD

Se o comando não funcionar, faça pelo dashboard:

### Backend Worker:
1. Acesse: https://dash.cloudflare.com/workers
2. Clique em "backend" worker
3. Clique em "Quick Edit" ou "Edit Code"
4. Cole o conteúdo de: `backend/src/cloudflare-worker.js`
5. Clique em "Save and Deploy"

### Frontend Pages:
1. Acesse: https://dash.cloudflare.com/pages
2. Clique em "agroisync" project
3. Clique em "Create deployment"
4. Upload a pasta `frontend/build`
5. Deploy!

---

## ✅ DEPOIS DO DEPLOY

Rode o teste completo de novo:

```powershell
node test-producao-completo.js
```

E vai mostrar:
- ✅ Plano Gratuito aparecendo
- ✅ Todos os planos novos funcionando
- ✅ API /plans retornando dados

---

**FAÇA ISSO AGORA E ME AVISA QUE EU RODO O TESTE 100% COMPLETO!** 🚀

