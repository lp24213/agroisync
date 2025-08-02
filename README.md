# 🌾 AGROTM.SOL - Plataforma Web3 para Agronegócio

[![Deploy Status](https://img.shields.io/badge/Deploy-Status-green.svg)](https://github.com/lp24213/agrotm.sol/actions)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.

## 🚀 Deploy Status

- **Frontend**: [Vercel](https://agrotm-solana.vercel.app) ✅
- **Backend**: [Railway](https://agrotm-backend.railway.app) ✅
- **Health Check**: [Frontend](https://agrotm-solana.vercel.app/api/health) | [Backend](https://agrotm-backend.railway.app/health)

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- npm >= 7.0.0 ou pnpm >= 8.0.0
- Git

## 🛠️ Instalação Local

### 1. Clone o repositório
```bash
git clone https://github.com/lp24213/agrotm.sol.git
cd agrotm.sol
```

### 2. Configure as variáveis de ambiente

#### Frontend
```bash
cd frontend
cp env.example .env.local
# Edite .env.local com suas configurações
```

#### Backend
```bash
cd backend
cp env.example .env
# Edite .env com suas configurações
```

### 3. Instale as dependências
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 4. Execute localmente
```bash
# Frontend (porta 3000)
cd frontend
npm run dev

# Backend (porta 3001)
cd backend
npm run dev
```

## 🧪 Testes

### Frontend
```bash
cd frontend
npm run test:health  # Testa healthcheck
npm run type-check   # Verifica tipos TypeScript
npm run lint         # Linting
```

### Backend
```bash
cd backend
npm run test:health  # Testa healthcheck
npm run type-check   # Verifica tipos TypeScript
```

## 🚀 Deploy

### Configuração Automática (GitHub Actions)

O projeto usa CI/CD automático com GitHub Actions:

1. **Configure os secrets** no GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `RAILWAY_TOKEN`

2. **Push para main** dispara o deploy automático

### Deploy Manual

#### Frontend (Vercel)
```bash
cd frontend
npm run build
npm start
```

#### Backend (Railway)
```bash
cd backend
npm run build
npm start
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro 404 no Deploy
- Verifique se o `vercel.json` está configurado corretamente
- Confirme que o deploy é feito a partir de `frontend/`

#### 2. Healthcheck Falha
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que as portas estão corretas

#### 3. Build Falha
- Execute `npm run type-check` localmente
- Verifique se todas as dependências estão instaladas

### Logs de Deploy

- **Vercel**: Dashboard do projeto Vercel
- **Railway**: Dashboard do projeto Railway
- **GitHub Actions**: [Actions](https://github.com/lp24213/agrotm.sol/actions)

## 📁 Estrutura do Projeto

```
agrotm.sol/
├── frontend/          # Next.js App Router
│   ├── app/          # Páginas e componentes
│   ├── components/   # Componentes reutilizáveis
│   └── scripts/      # Scripts de validação
├── backend/          # Express.js API
│   ├── src/          # Código fonte
│   ├── dist/         # Build compilado
│   └── scripts/      # Scripts de validação
├── .github/          # GitHub Actions
├── docs/             # Documentação
└── contracts/        # Smart Contracts Solidity
```

## 🔐 Segurança

- Headers de segurança configurados
- Rate limiting implementado
- CORS configurado
- Validação de entrada
- Sanitização de dados

## 📊 Monitoramento

- Health checks implementados
- Logs estruturados
- Métricas de performance
- Alertas automáticos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/lp24213/agrotm.sol/issues)
- **Documentação**: [Wiki](https://github.com/lp24213/agrotm.sol/wiki)

---

**🌾 Revolucione a agricultura com DeFi na Solana!**
