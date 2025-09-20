# 🚀 Deploy Separado - Frontend e Backend

## 📋 Problema Resolvido

O problema era que o **backend estava sendo deployado junto com o frontend** no Cloudflare Pages, causando conflito. Agora está **separado corretamente**:

- **Frontend**: Cloudflare Pages (interface do usuário)
- **Backend**: Cloudflare Workers (API)

## 🔧 Configuração Atual

### Backend (Cloudflare Workers)
- **Arquivo**: `backend/wrangler.toml`
- **Nome**: `agroisync-backend`
- **URLs**:
  - Staging: `https://agroisync-backend-staging.luispaulooliveira767.workers.dev`
  - Produção: `https://agroisync-backend-prod.luispaulooliveira767.workers.dev`

### Frontend (Cloudflare Pages)
- **Arquivo**: `frontend/cloudflare-pages.json`
- **Configuração**: `frontend/src/config/config.js`
- **API URL**: Aponta para o backend separado

## 🚀 Como Fazer Deploy

### 1. Deploy do Backend (Cloudflare Workers)

```bash
# Navegar para o diretório backend
cd backend

# Deploy para staging
wrangler deploy --env staging

# Deploy para produção
wrangler deploy --env production
```

**Ou usar o script automatizado:**
```bash
chmod +x scripts/deploy-cloudflare.sh
./scripts/deploy-cloudflare.sh
```

### 2. Deploy do Frontend (Cloudflare Pages)

**Opção A: Via Dashboard do Cloudflare**
1. Acesse [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Conecte o repositório GitHub
3. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `frontend`

**Opção B: Via Wrangler (se configurado)**
```bash
cd frontend
wrangler pages deploy build
```

## 🔗 URLs Finais

- **Frontend**: `https://agroisync-frontend.pages.dev` (ou URL customizada)
- **Backend**: `https://agroisync-backend-prod.luispaulooliveira767.workers.dev`

## ✅ Verificação

### Backend funcionando:
```bash
curl https://agroisync-backend-prod.luispaulooliveira767.workers.dev/health
```

### Frontend funcionando:
- Acesse a URL do Cloudflare Pages
- Deve mostrar a interface do AgroSync
- Deve conseguir fazer chamadas para a API

## 🔧 Configurações Importantes

### Variáveis de Ambiente (Backend)
Configure no dashboard do Cloudflare Workers:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MONGODB_URI`
- `JWT_SECRET`

### Variáveis de Ambiente (Frontend)
Configure no dashboard do Cloudflare Pages:
- `REACT_APP_API_URL`: URL do backend
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`

## 📚 Documentação

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🎯 Resultado

Agora você tem:
- ✅ **Frontend** servido pelo Cloudflare Pages
- ✅ **Backend** servido pelo Cloudflare Workers
- ✅ **Comunicação** entre frontend e backend funcionando
- ✅ **Deploy separado** sem conflitos
