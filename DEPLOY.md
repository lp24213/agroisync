# 🚀 Guia de Deploy - AGROTM

> Guia completo para deploy da plataforma AGROTM em produção

## 📋 Pré-requisitos

### Contas Necessárias
- [ ] **MetaMask** com ETH para gas
- [ ] **Firebase** (Google Cloud)
- [ ] **Vercel** (Frontend)
- [ ] **Infura/Alchemy** (RPC Ethereum)
- [ ] **CoinGecko** (API de preços)
- [ ] **Sentry** (Monitoramento)

### Chaves e APIs
- [ ] **Firebase API Key**
- [ ] **Infura/Alchemy API Key**
- [ ] **CoinGecko API Key**
- [ ] **Sentry DSN**
- [ ] **Telegram Bot Token** (opcional)
- [ ] **Discord Webhook** (opcional)

## 🔧 Configuração Inicial

### 1. Clone e Setup
```bash
git clone https://github.com/agrotm/agrotm-solana.git
cd agrotm-solana
chmod +x setup.sh
./setup.sh
```

### 2. Configure o .env
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Endereço MetaMask do dono (OBRIGATÓRIO)
OWNER_METAMASK_ADDRESS=0xSEU_ENDERECO_METAMASK_AQUI

# Taxa de comissão (5% = 500)
COMMISSION_RATE=500

# Firebase (OBRIGATÓRIO)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Ethereum RPC (OBRIGATÓRIO)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETHEREUM_CHAIN_ID=1

# APIs (OBRIGATÓRIO)
COINGECKO_API_KEY=your_coingecko_api_key

# Monitoramento (RECOMENDADO)
SENTRY_DSN=your_sentry_dsn
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## 🏗️ Deploy dos Contratos

### 1. Prepare o Deploy
```bash
cd contracts/ethereum

# Instale dependências
npm install

# Compile os contratos
npm run compile

# Verifique se tudo está correto
npm run test
```

### 2. Deploy em Testnet (Recomendado)
```bash
# Sepolia (Ethereum testnet)
npm run deploy:sepolia

# BSC Testnet
npm run deploy:bsctest

# Mumbai (Polygon testnet)
npm run deploy:mumbai
```

### 3. Deploy em Mainnet
```bash
# Ethereum Mainnet
npm run deploy:mainnet

# BSC Mainnet
npm run deploy:bsc

# Polygon Mainnet
npm run deploy:polygon
```

### 4. Verificar Contratos
```bash
# Verificar no Etherscan
npm run verify:mainnet

# Verificar no BSCScan
npm run verify:bsc

# Verificar no Polygonscan
npm run verify:polygon
```

### 5. Salvar Endereços
Após o deploy, copie os endereços dos contratos para o `.env`:
```env
AGROTM_TOKEN_ADDRESS=0x...
NFT_AGRO_ADDRESS=0x...
BUY_WITH_COMMISSION_ADDRESS=0x...
STAKING_CONTRACT_ADDRESS=0x...
```

## 🌐 Deploy do Frontend (Vercel)

### 1. Prepare o Build
```bash
# Configure as variáveis de ambiente
cp .env frontend/.env.local

# Build do frontend
npm run build:frontend
```

### 2. Deploy no Vercel
```bash
# Instale Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure Variáveis no Vercel
No dashboard do Vercel, configure as variáveis de ambiente:
- `NEXT_PUBLIC_AGROTM_TOKEN_ADDRESS`
- `NEXT_PUBLIC_NFT_AGRO_ADDRESS`
- `NEXT_PUBLIC_BUY_WITH_COMMISSION_ADDRESS`
- `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

## 🔥 Deploy do Backend (Firebase)

### 1. Configure Firebase
```bash
# Instale Firebase CLI
npm i -g firebase-tools

# Login no Firebase
firebase login

# Inicialize o projeto
firebase init
```

### 2. Configure Firebase Functions
```bash
cd backend

# Instale dependências
npm install

# Build
npm run build

# Deploy
firebase deploy --only functions
```

### 3. Configure Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dados públicos podem ser lidos por todos
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Dados de staking
    match /staking/{stakeId} {
      allow read, write: if request.auth != null;
    }
    
    // Dados de NFTs
    match /nfts/{nftId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔐 Configuração de Segurança

### 1. SSL/TLS
```bash
# Configure SSL no Vercel (automático)
# Configure SSL no Firebase (automático)

# Para domínio customizado
# Configure no seu provedor de DNS
```

### 2. Headers de Segurança
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### 3. Rate Limiting
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const limit = 100; // requests per minute
  const windowMs = 60 * 1000; // 1 minute

  const current = rateLimit.get(ip) ?? 0;
  
  if (current >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  rateLimit.set(ip, current + 1);
  
  // Clean up old entries
  setTimeout(() => {
    rateLimit.delete(ip);
  }, windowMs);

  return NextResponse.next();
}
```

## 📊 Monitoramento

### 1. Sentry
```javascript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 2. Firebase Analytics
```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### 3. Alertas
```javascript
// monitoring/alerts.ts
export const sendAlert = async (message: string, level: 'info' | 'warning' | 'error') => {
  // Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `[AGROTM] ${level.toUpperCase()}: ${message}`,
        parse_mode: 'HTML'
      })
    });
  }

  // Discord
  if (process.env.DISCORD_WEBHOOK_URL) {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `[AGROTM] ${level.toUpperCase()}: ${message}`
      })
    });
  }
};
```

## 🧪 Testes de Produção

### 1. Testes de Contratos
```bash
# Testes unitários
npm run test:contracts

# Testes de integração
npm run test:integration

# Testes de segurança
npm run test:security
```

### 2. Testes de Frontend
```bash
# Testes unitários
npm run test:frontend

# Testes E2E
npm run test:e2e

# Testes de performance
npm run test:performance
```

### 3. Testes de Backend
```bash
# Testes unitários
npm run test:backend

# Testes de API
npm run test:api

# Testes de carga
npm run test:load
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy AGROTM

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:frontend
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:backend
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

## 📈 Monitoramento Pós-Deploy

### 1. Métricas a Monitorar
- **Uptime**: 99.9%+
- **Response Time**: <200ms
- **Error Rate**: <0.1%
- **Gas Usage**: Otimizado
- **TVL**: Crescimento
- **Usuários Ativos**: Crescimento

### 2. Alertas Configurados
- **Downtime**: >5 minutos
- **Error Rate**: >1%
- **Gas Price**: >100 gwei
- **Contract Failures**: Qualquer
- **Security Events**: Qualquer

### 3. Logs e Analytics
- **Sentry**: Erros e performance
- **Firebase Analytics**: Comportamento do usuário
- **Vercel Analytics**: Performance do frontend
- **Custom Logs**: Transações blockchain

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Contratos não deployam
```bash
# Verifique o saldo de ETH
# Verifique a configuração do Hardhat
# Verifique as permissões da carteira
```

#### 2. Frontend não carrega
```bash
# Verifique as variáveis de ambiente
# Verifique os endereços dos contratos
# Verifique a conexão com RPC
```

#### 3. Backend não responde
```bash
# Verifique os logs do Firebase
# Verifique as regras do Firestore
# Verifique as variáveis de ambiente
```

#### 4. Transações falham
```bash
# Verifique o saldo de ETH
# Verifique o gas price
# Verifique as permissões dos contratos
```

## 📞 Suporte

### Canais de Ajuda
- **Documentação**: [docs.agrotm.com](https://docs.agrotm.com)
- **Discord**: [discord.gg/agrotm](https://discord.gg/agrotm)
- **Telegram**: [t.me/agrotm](https://t.me/agrotm)
- **Email**: support@agrotm.com

### Links Úteis
- **Etherscan**: [etherscan.io](https://etherscan.io)
- **BSCScan**: [bscscan.com](https://bscscan.com)
- **Polygonscan**: [polygonscan.com](https://polygonscan.com)
- **Vercel**: [vercel.com](https://vercel.com)
- **Firebase**: [firebase.google.com](https://firebase.google.com)

---

**AGROTM** - Deploy seguro e escalável 🌱⚡ 