# 🌱 AGROTM - Plataforma DeFi para Agricultura

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

> Plataforma descentralizada revolucionária para o setor agroindustrial, construída na blockchain Solana com tecnologias Web3 de última geração.

## 🚀 Visão Geral

AGROTM é uma plataforma DeFi inovadora que conecta agricultores, investidores e consumidores através de tecnologia blockchain, oferecendo:

- **💰 Staking e Yield Farming** - Maximize seus rendimentos com pools de liquidez otimizadas
- **🎨 NFTs Agrícolas** - Tokenize ativos agrícolas e propriedades rurais
- **🔄 Cross-Chain Bridge** - Interoperabilidade entre diferentes blockchains
- **📊 Analytics Avançado** - Dashboard em tempo real com métricas DeFi
- **🛡️ Segurança Máxima** - Contratos auditados e práticas de segurança rigorosas

## ✨ Características Principais

### 🎯 DeFi & Staking
- Pools de liquidez com APR competitivo
- Staking multi-token com recompensas automáticas
- Farming de yield otimizado
- Governança descentralizada (DAO)

### 🎨 NFT Marketplace
- Mintagem de NFTs agrícolas
- Marketplace integrado
- Metadata dinâmica com reveal
- Royalties automáticas

### 🌐 Tecnologias
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: Solana, Anchor Framework
- **Backend**: Firebase Functions, Node.js
- **UI/UX**: shadcn/ui, Recharts, Design System premium
- **Segurança**: Rate limiting, CORS, Helmet, Validação rigorosa

## 🛠️ Instalação e Configuração

### Pré-requisitos

```bash
# Node.js >= 18.0.0
node --version

# npm >= 9.0.0
npm --version

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/agrotm/agrotm-solana.git
cd agrotm-solana

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Compile os contratos Solana
npm run contracts:build

# Inicie o ambiente de desenvolvimento
npm run dev
```

### Configuração de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=seu_program_id_aqui

# Security
JWT_SECRET=seu_jwt_secret_super_seguro
CORS_ORIGIN=http://localhost:3000,https://agrotm.com

# Firebase (Opcional)
FIREBASE_PROJECT_ID=seu_projeto_firebase
FIREBASE_PRIVATE_KEY=sua_chave_privada
FIREBASE_CLIENT_EMAIL=seu_email_cliente

# APIs (Opcional)
COINGECKO_API_KEY=sua_chave_coingecko
CHAINLINK_API_KEY=sua_chave_chainlink

# Monitoring (Opcional)
SENTRY_DSN=seu_sentry_dsn
LOG_LEVEL=info
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia ambiente de desenvolvimento
npm run build            # Build completo do projeto
npm run start            # Inicia aplicação em produção

# Qualidade de Código
npm run lint             # Executa linting em todo o projeto
npm run format           # Formata código com Prettier
npm run type-check       # Verifica tipos TypeScript

# Contratos Solana
npm run contracts:build  # Compila contratos Anchor
npm run contracts:deploy # Deploy dos contratos
npm run contracts:test   # Testa contratos

# Segurança
npm run security:audit   # Auditoria de dependências
npm run security:fix     # Corrige vulnerabilidades

# Documentação
npm run docs:generate    # Gera documentação TypeDoc

# Utilitários
npm run clean            # Limpa arquivos de build
```

## 📁 Estrutura do Projeto

```
agrotm-solana/
├── src/                     # Código fonte principal
│   ├── core/               # Lógica central da aplicação
│   ├── contracts/          # Contratos Solana em Rust
│   ├── utils/              # Funções utilitárias
│   └── config/             # Configurações
├── components/             # Componentes React reutilizáveis
│   ├── defi/              # Componentes DeFi
│   ├── widgets/           # Widgets de UI
│   └── animations/        # Componentes animados
├── hooks/                  # Custom React Hooks
├── contexts/               # Contextos React
├── services/               # Serviços e integrações
├── middlewares/            # Middlewares de segurança
├── public/                 # Arquivos estáticos
├── scripts/                # Scripts de automação
└── docs/                   # Documentação
```

## 🔧 Desenvolvimento

### Adicionando Novos Recursos

1. **Componentes React**: Adicione em `components/` seguindo o padrão estabelecido
2. **Hooks**: Crie em `hooks/` com tipagem TypeScript rigorosa
3. **Contratos**: Desenvolva em `src/contracts/` usando Anchor Framework
4. **Serviços**: Implemente em `services/` com tratamento de erro robusto

### Padrões de Código

- **TypeScript**: Tipagem rigorosa obrigatória
- **ESLint + Prettier**: Formatação automática
- **Componentes**: Funcionais com hooks
- **Naming**: camelCase para variáveis, PascalCase para componentes
- **Commits**: Conventional Commits (feat:, fix:, docs:, etc.)

## 🛡️ Segurança

### Práticas Implementadas

- ✅ Rate limiting em APIs
- ✅ Validação rigorosa de inputs
- ✅ Sanitização de dados
- ✅ Headers de segurança (Helmet)
- ✅ CORS configurado
- ✅ Contratos auditados
- ✅ Tratamento seguro de chaves privadas

### Auditoria

```bash
# Verificar vulnerabilidades
npm run security:audit

# Corrigir automaticamente
npm run security:fix
```

## 🚀 Deploy

### Ambiente de Produção

```bash
# Build otimizado
npm run build

# Deploy automático
npm run deploy
```

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📊 Monitoramento

- **Performance**: Web Vitals integrado
- **Errors**: Sentry para tracking de erros
- **Analytics**: Dashboard customizado
- **Logs**: Sistema de logging estruturado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Solana Foundation](https://solana.org/) - Blockchain de alta performance
- [Anchor](https://anchor-lang.com/) - Framework para desenvolvimento Solana
- [Next.js](https://nextjs.org/) - Framework React de produção
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário

## 📞 Suporte

- 📧 Email: suporte@agrotm.com
- 💬 Discord: [AGROTM Community](https://discord.gg/agrotm)
- 🐦 Twitter: [@AGROTM_Official](https://twitter.com/AGROTM_Official)
- 📖 Docs: [docs.agrotm.com](https://docs.agrotm.com)

---

<div align="center">
  <strong>🌱 Construindo o futuro da agricultura descentralizada 🌱</strong>
</div>