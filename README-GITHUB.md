# 🌱 AGROTM.SOL - Plataforma DeFi Agrícola

[![AGROTM CI/CD Pipeline](https://github.com/lp24213/agrotm.sol/workflows/AGROTM%20CI%2FCD%20Pipeline/badge.svg)](https://github.com/lp24213/agrotm.sol/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black.svg)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-1.98.4-purple.svg)](https://solana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Plataforma DeFi revolucionária que conecta agricultores, investidores e consumidores através da blockchain Solana**

## 🚀 Visão Geral

AGROTM.SOL é uma plataforma completa de DeFi agrícola que permite:

- **Tokenização de Ativos Agrícolas**: Transforme fazendas em NFTs negociáveis
- **Staking e Yield Farming**: Ganhe recompensas com tokens AGRO
- **Marketplace NFT**: Compre e venda ativos agrícolas tokenizados
- **Governança DAO**: Participe das decisões da plataforma
- **Analytics Avançados**: Dashboard completo com métricas em tempo real

## 🏗️ Arquitetura

```
agrotm.sol/
├── frontend/          # Next.js 14 + TypeScript
├── backend/           # Node.js + Express + MongoDB
├── contracts/         # Smart Contracts Solana + Ethereum
├── rust/             # Contratos Rust para Solana
├── docs/             # Documentação técnica
└── scripts/          # Scripts de deploy e automação
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações
- **Solana Web3.js** - Integração blockchain
- **React Query** - Gerenciamento de estado

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação
- **Winston** - Logging

### Blockchain
- **Solana** - Blockchain principal
- **Anchor** - Framework para smart contracts
- **Ethereum** - Contratos secundários
- **Hardhat** - Desenvolvimento Ethereum

## 🚀 Deploy

### Frontend (AWS Amplify)
- **URL**: https://app.seu-amplify-domain.amplifyapp.com
- **Branch**: `main` → Production, `develop` → Staging

### Backend (AWS ECS/Lambda)
- **URL**: https://api.seu-dominio-aws.com
- **Health Check**: `/health`

## 📦 Instalação Local

### Pré-requisitos
- Node.js >= 20
- npm >= 7 ou pnpm >= 8
- Git

### Setup Frontend
```bash
cd frontend
npm install
cp env.example .env.local
# Configure as variáveis de ambiente
npm run dev
```

### Setup Backend
```bash
cd backend
npm install
cp env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Setup Smart Contracts
```bash
cd contracts
npm install
# Configure hardhat.config.ts
npx hardhat compile
```

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run type-check   # Verificação de tipos
npm run lint         # Linting
npm run start        # Servidor produção
```

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run type-check   # Verificação de tipos
npm run start        # Servidor produção
```

## 🔐 Variáveis de Ambiente

### Frontend (.env.local)
```env
NEXT_PUBLIC_APP_URL=https://app.seu-amplify-domain.amplifyapp.com
NEXT_PUBLIC_API_URL=https://api.seu-dominio-aws.com
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/agrotm
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=3001
```

## 🧪 Testes

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test

# Smart Contracts
cd contracts
npx hardhat test
```

## 📊 Status do Projeto

- ✅ **Frontend**: 100% funcional
- ✅ **Backend**: 100% funcional
- ✅ **Smart Contracts**: 100% funcional
- ✅ **CI/CD**: Configurado
- ✅ **Deploy**: Automatizado
- ✅ **TypeScript**: Sem erros
- ✅ **Linting**: Configurado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/lp24213/agrotm.sol/issues)
- **Documentação**: [Wiki](https://github.com/lp24213/agrotm.sol/wiki)
- **Email**: support@agrotm.sol

## 🔗 Links Úteis

- [Website](https://agrotm.sol)
- [Documentação](https://docs.agrotm.sol)
- [Whitepaper](https://agrotm.sol/whitepaper.pdf)
- [Telegram](https://t.me/agrotm)
- [Twitter](https://twitter.com/agrotm_sol)

---

**Desenvolvido com ❤️ pela equipe AGROTM** 