# AGROTM - Solana Agricultural Tokenization Platform

## 🚀 Status do Projeto

- **Frontend**: [Vercel](https://agrotm-solana.vercel.app) ✅
- **Backend**: [Railway](https://agrotm-backend.railway.app) ✅
- **Health Check**: [Frontend](https://agrotm-solana.vercel.app/api/health) | [Backend](https://agrotm-backend.railway.app/health)
- **Deployment**: Triggered - CI/CD in progress 🚀
- **Last Update**: $(date) - Deploy automático funcionando

## 📋 Pré-requisitos

- Node.js >= 20
- npm >= 7 ou pnpm >= 8
- Git

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/lp24213/agrotm.sol.git
cd agrotm.sol

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp frontend/env.example frontend/.env.local
cp backend/env.example backend/.env.local

# Execute o projeto
npm run dev
```

## 📁 Estrutura do Projeto

```
agrotm.sol/
├── frontend/          # Next.js Frontend
├── backend/           # Node.js Backend
├── contracts/         # Smart Contracts
└── docs/             # Documentação
```

## 🚀 Deploy

### Frontend (Vercel)
- Deploy automático via GitHub Actions
- URL: https://agrotm-solana.vercel.app

### Backend (Railway)
- Deploy manual via Railway Dashboard
- URL: https://agrotm-backend.railway.app

## 📊 Monitoramento

- **GitHub Actions**: https://github.com/lp24213/agrotm.sol/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard

## 🔧 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Blockchain**: Solana, Web3.js
- **Deploy**: Vercel, Railway

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.
