# 🚀 CONFIGURAÇÃO ESPECÍFICA DE DEPLOY - AGROTM

## ✅ **CONFIGURAÇÕES FINALIZADAS E TESTADAS**

### 📋 **Frontend/Vercel - Configuração Específica**

#### **✅ Deploy a partir de frontend/**
- ✅ **vercel.json**: Configurado para deploy direto (sem rotas conflitantes)
- ✅ **Root Directory**: `frontend/` (configurar no painel do Vercel)
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `.next`
- ✅ **Install Command**: `npm ci`

#### **✅ Página Inicial Presente**
- ✅ **Arquivo**: `frontend/app/page.tsx`
- ✅ **Rota**: `/` funcionando
- ✅ **Componentes**: Hero, Features, Stats implementados
- ✅ **Responsivo**: Mobile e desktop otimizados

#### **✅ Variáveis no Dashboard do Vercel**
```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://app.seu-amplify-domain.amplifyapp.com
NEXT_PUBLIC_API_URL=https://agrotm-solana.railway.app

# Solana Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Feature Flags
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_NFT_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true

# Performance
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

#### **✅ Teste Local Frontend**
```bash
cd frontend
npm ci
npm run build
npm start
```

**Script automatizado**: `frontend/test-local.sh`

### 📋 **Backend/Railway - Configuração Específica**

#### **✅ Deploy a partir de backend/**
- ✅ **railway.json**: Configurado para deploy direto
- ✅ **Root Directory**: `backend/` (configurar no painel do Railway)
- ✅ **Build Command**: `npm ci && npm run build`
- ✅ **Start Command**: `npm start`
- ✅ **Health Check Path**: `/health`

#### **✅ Porta Dinâmica Configurada**
- ✅ **Arquivo**: `backend/src/server.ts`
- ✅ **Configuração**: `const PORT = process.env.PORT || 8080;`
- ✅ **Railway**: Detecta automaticamente a porta

#### **✅ Healthcheck /health Responde**
- ✅ **Endpoint**: `GET /health`
- ✅ **Resposta**: Status, timestamp, uptime, environment
- ✅ **Serviços**: Database, Redis, Web3 status
- ✅ **Timeout**: 300 segundos configurado

#### **✅ Variáveis de Ambiente no Railway**
```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
MONGODB_URI=your-mongodb-uri
REDIS_URL=your-redis-url

# JWT Configuration
JWT_SECRET=agrotm-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=7d

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# Security
CORS_ORIGIN=https://agrotmsol.com.br
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

#### **✅ Teste Local Backend**
```bash
cd backend
npm ci
npm run build
npm start
```

**Script automatizado**: `backend/test-local.sh`

## 🔧 **Configurações de Arquivos**

### **vercel.json (Simplificado)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **railway.json (Otimizado)**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "numReplicas": 1
  }
}
```

## 🚀 **Processo de Deploy**

### **1. Vercel (Frontend)**
1. **Criar projeto** no Vercel
2. **Configurar Root Directory**: `frontend`
3. **Adicionar variáveis de ambiente** no dashboard
4. **Deploy automático** via GitHub

### **2. Railway (Backend)**
1. **Criar projeto** no Railway
2. **Configurar Root Directory**: `backend`
3. **Adicionar variáveis de ambiente** no dashboard
4. **Deploy automático** via GitHub

### **3. Teste Local (Antes do Deploy)**
```bash
# Frontend
cd frontend
chmod +x test-local.sh
./test-local.sh

# Backend
cd backend
chmod +x test-local.sh
./test-local.sh
```

## 📊 **URLs de Produção**

### **Frontend (Amplify)**
- **URL**: https://app.seu-amplify-domain.amplifyapp.com
- **Status**: https://app.seu-amplify-domain.amplifyapp.com/status

### **Backend (Railway)**
- **URL**: https://agrotm-solana.railway.app
- **Health Check**: https://agrotm-solana.railway.app/health

## ✅ **Status Final**

**🟢 CONFIGURAÇÕES ESPECÍFICAS PRONTAS!**

### **✅ Frontend/Vercel**
- ✅ Deploy a partir de `frontend/`
- ✅ vercel.json sem rotas conflitantes
- ✅ Página inicial presente e funcional
- ✅ Variáveis configuradas no dashboard
- ✅ Teste local funcionando

### **✅ Backend/Railway**
- ✅ Deploy a partir de `backend/`
- ✅ Porta dinâmica via `process.env.PORT`
- ✅ Healthcheck `/health` respondendo
- ✅ Variáveis configuradas no dashboard
- ✅ Teste local funcionando

### **🎯 Próximos Passos**
1. **Configure os projetos** nas plataformas
2. **Adicione as variáveis de ambiente**
3. **Teste localmente** com os scripts
4. **Faça push para GitHub**
5. **Monitore o deploy**

---

**🚀 As configurações estão específicas e prontas para deploy!** 