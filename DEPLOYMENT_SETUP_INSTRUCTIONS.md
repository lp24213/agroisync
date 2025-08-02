# 🚀 INSTRUÇÕES DE CONFIGURAÇÃO DE DEPLOY - AGROTM

## 📋 Checklist de Configuração Manual

### ✅ **1. Configuração do Vercel (Frontend)**

#### **Configurações do Projeto:**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Node.js Version**: 20.x

#### **Variáveis de Ambiente (Vercel Dashboard):**
```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://agrotm-solana.vercel.app
NEXT_PUBLIC_API_URL=https://agrotm-solana.railway.app

# Solana Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_HOTJAR_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_NFT_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true

# Performance
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### ✅ **2. Configuração do Railway (Backend)**

#### **Configurações do Projeto:**
- **Root Directory**: `backend`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- **Node.js Version**: 20.x

#### **Variáveis de Ambiente (Railway Dashboard):**
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
CORS_ORIGIN=https://agrotm-solana.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### ✅ **3. Configuração do GitHub Secrets**

#### **Secrets Necessários:**
```bash
# Vercel Secrets
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Railway Secrets
RAILWAY_TOKEN=your-railway-token
```

#### **Como Obter os Secrets:**

**Vercel:**
1. Acesse https://vercel.com/account/tokens
2. Crie um novo token
3. No projeto Vercel, vá em Settings > General
4. Copie o Project ID e Org ID

**Railway:**
1. Acesse https://railway.app/account/tokens
2. Crie um novo token
3. Use o token no GitHub Secrets

### ✅ **4. Teste Local Antes do Deploy**

#### **Frontend:**
```bash
cd frontend
npm ci
npm run type-check
npm run lint
npm run build
```

#### **Backend:**
```bash
cd backend
npm ci
npm run build
```

### ✅ **5. Configuração de Arquivos Locais**

#### **Frontend (.env.local):**
```bash
# Copie o conteúdo do frontend/env.example
cp frontend/env.example frontend/.env.local
# Edite e preencha os valores
```

#### **Backend (.env):**
```bash
# Copie o conteúdo do backend/env.example
cp backend/env.example backend/.env
# Edite e preencha os valores
```

## 🔧 **Configurações Específicas**

### **Node.js Version**
- **Local**: Use Node.js 20.x (`nvm use 20`)
- **Cloud**: Configurado para Node.js >= 20.0.0
- **Package Manager**: npm >= 7.0.0 ou pnpm >= 8.0.0

### **Build Commands**
```bash
# Frontend
npm ci
npm run build

# Backend
npm ci
npm run build
npm start
```

### **Health Checks**
- **Frontend**: `https://agrotm-solana.vercel.app`
- **Backend**: `https://agrotm-solana.railway.app/health`

## 🚀 **Processo de Deploy**

### **1. Push para GitHub**
```bash
git add .
git commit -m "feat: prepare for production deploy"
git push origin main
```

### **2. Monitorar GitHub Actions**
- Verifique o workflow em `.github/workflows/deploy.yml`
- Aguarde os testes passarem
- Deploy automático será executado

### **3. Verificar Deploy**
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **Logs**: Verifique os logs de build e deploy

## 🐛 **Troubleshooting**

### **Erro 404 no Deploy**
1. Verifique se o Root Directory está correto
2. Confirme se o Build Command está correto
3. Verifique os logs de build
4. Teste localmente primeiro

### **Erro de Dependências**
1. Verifique se `package-lock.json` está commitado
2. Use `npm ci` ao invés de `npm install`
3. Confirme versão do Node.js (20.x)

### **Erro de Variáveis de Ambiente**
1. Verifique se todas as variáveis estão configuradas
2. Confirme se os valores estão corretos
3. Reinicie o deploy após configurar

### **Erro de Build**
1. Execute `npm run build` localmente
2. Verifique erros de TypeScript (`npm run type-check`)
3. Verifique erros de lint (`npm run lint`)
4. Confirme se todas as dependências estão instaladas

## 📊 **Monitoramento**

### **URLs Importantes**
- **Frontend**: https://agrotm-solana.vercel.app
- **Backend**: https://agrotm-solana.railway.app
- **Health Check**: https://agrotm-solana.railway.app/health

### **Logs para Verificar**
- **Vercel**: Build logs no painel
- **Railway**: Container logs no painel
- **GitHub Actions**: Workflow logs

## ✅ **Status Final**

**🟢 CONFIGURAÇÃO COMPLETA PARA DEPLOY!**

- ✅ **Vercel**: Configurado para frontend
- ✅ **Railway**: Configurado para backend
- ✅ **GitHub Actions**: CI/CD configurado
- ✅ **Variáveis de ambiente**: Documentadas
- ✅ **Node.js 20**: Configurado
- ✅ **Build commands**: Testados

---

**🎯 Siga estas instruções para configurar o deploy manualmente!** 