# 🚀 GUIA DE CONFIGURAÇÃO DE DEPLOY - AGROTM

## 📋 Checklist de Configuração

### ✅ **Arquivos de Configuração Verificados e Atualizados**

#### **Frontend (Next.js)**
- ✅ `frontend/package.json` - Scripts, dependências e engines atualizados
- ✅ `frontend/next.config.js` - Configuração otimizada para produção
- ✅ `frontend/tsconfig.json` - Configuração TypeScript para Next.js 14
- ✅ `frontend/tailwind.config.js` - Configuração Tailwind com animações
- ✅ `frontend/vercel.json` - Configuração específica do Vercel
- ✅ `frontend/env.example` - Todas as variáveis de ambiente necessárias
- ✅ `frontend/.gitignore` - Configuração específica do frontend

#### **Backend (Node.js/Express)**
- ✅ `backend/package.json` - Scripts e dependências atualizados
- ✅ `backend/env.example` - Variáveis de ambiente do backend
- ✅ `railway.json` - Configuração Railway otimizada

#### **Infraestrutura**
- ✅ `vercel.json` - Configuração principal do Vercel
- ✅ `railway.json` - Configuração Railway
- ✅ `Procfile` - Configuração para Heroku/outras plataformas
- ✅ `.nvmrc` - Versão do Node.js especificada
- ✅ `Dockerfile` - Multi-stage build otimizado
- ✅ `docker-compose.yml` - Configuração Docker completa

## 🔧 **Configurações Específicas**

### **Node.js Version**
- **Especificada**: `>=18.0.0` (mais flexível)
- **Arquivo**: `.nvmrc` com versão `18`
- **Compatibilidade**: Suporta Node.js 18, 20, 22

### **Scripts de Build**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### **Dependências Otimizadas**
- ✅ Removidas dependências desnecessárias
- ✅ Versões atualizadas e seguras
- ✅ Vulnerabilidades corrigidas
- ✅ Bundle size otimizado

## 🌐 **Configuração de Deploy**

### **Amplify (Frontend)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "installCommand": "npm ci",
  "buildCommand": "npm run build"
}
```

### **ECS (Backend)**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/health"
  }
}
```

## 🔐 **Variáveis de Ambiente**

### **Frontend (.env.local)**
```bash
# Application URLs (AWS)
NEXT_PUBLIC_APP_URL=https://app.seu-amplify-domain.amplifyapp.com
NEXT_PUBLIC_API_URL=https://api.seu-dominio-aws.com

# Solana Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id

# Feature Flags
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_NFT_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
```

### **Backend (.env)**
```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
MONGODB_URI=your-mongodb-uri
REDIS_URL=your-redis-url

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Security
CORS_ORIGIN=https://agrotmsol.com.br
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛡️ **Segurança Implementada**

### **Headers de Segurança**
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### **Cache Optimization**
- ✅ Static assets: `max-age=31536000, immutable`
- ✅ Next.js static files otimizados
- ✅ Gzip compression habilitado

## 📊 **Performance Otimizada**

### **Build Optimization**
- ✅ `npm ci` para instalação limpa
- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Bundle analysis disponível
- ✅ Code splitting automático

### **Runtime Optimization**
- ✅ Next.js 14 App Router
- ✅ Image optimization
- ✅ Font optimization
- ✅ CSS optimization

## 🧪 **Testes de Build**

### **Script de Teste Local**
```bash
# Execute no diretório frontend
chmod +x build-test.sh
./build-test.sh
```

### **Verificações Automáticas**
- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Build de produção
- ✅ Verificação de arquivos gerados

## 🚀 **Comandos de Deploy**

### **Vercel (Automático)**
1. Push para GitHub
2. Vercel detecta automaticamente
3. Deploy automático executado

### **Railway (Automático)**
1. Push para GitHub
2. Railway detecta automaticamente
3. Deploy automático executado

### **Manual (Se necessário)**
```bash
# Frontend
cd frontend
npm ci
npm run build
npm start

# Backend
cd backend
npm ci
npm run build
npm start
```

## 📝 **Logs e Monitoramento**

### **Logs Importantes**
- **Vercel**: Build logs no painel
- **Railway**: Container logs no painel
- **GitHub Actions**: Workflow logs

### **Health Checks**
- **Frontend**: `https://seu-dominio.vercel.app`
- **Backend**: `https://seu-backend.railway.app/health`

## ✅ **Status Final**

**🟢 TODAS AS CONFIGURAÇÕES ESTÃO PRONTAS PARA DEPLOY!**

- ✅ **Arquivos de configuração**: Todos atualizados e otimizados
- ✅ **Variáveis de ambiente**: Documentadas e organizadas
- ✅ **Scripts de build**: Testados e funcionais
- ✅ **Segurança**: Headers e políticas implementadas
- ✅ **Performance**: Otimizações aplicadas
- ✅ **Compatibilidade**: Node.js 18+ suportado

---

**🎯 O projeto está 100% configurado e pronto para deploy em produção!** 