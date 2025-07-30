# 🌱 Agrotm Solana DeFi Platform

Uma plataforma DeFi completa construída na blockchain Solana, focada em agricultura sustentável e finanças descentralizadas.

## 🚀 Características Principais

- **DeFi Completo**: Staking, yield farming, pools de liquidez
- **Blockchain Solana**: Alta performance e baixas taxas
- **Interface Moderna**: React + Next.js + Tailwind CSS
- **Arquitetura Modular**: Microserviços escaláveis
- **Monitoramento Avançado**: Prometheus + Grafana + ELK Stack
- **Segurança Robusta**: Auditoria de segurança e compliance
- **Multi-idioma**: Suporte para EN, PT, ZH

## 🏗️ Arquitetura

```
agrotm-solana/
├── frontend/          # Next.js Frontend (Porta 3000)
├── backend/           # Node.js API (Porta 3001)
├── api/              # API Gateway (Porta 3002)
├── staking/          # Módulo Staking (Porta 3003)
├── defi-dashboard/   # Dashboard DeFi (Porta 3004)
├── contracts/        # Smart Contracts Solana
├── microservices/    # Microserviços adicionais
├── components/       # Componentes React reutilizáveis
├── hooks/           # React Hooks customizados
├── services/        # Serviços de negócio
├── types/           # Definições TypeScript
├── utils/           # Utilitários
└── public/          # Arquivos estáticos
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Solana Web3.js** - Integração blockchain
- **React Query** - Gerenciamento de estado
- **Framer Motion** - Animações

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **JWT** - Autenticação

### Blockchain
- **Solana** - Blockchain principal
- **Anchor** - Framework de smart contracts
- **Rust** - Linguagem dos contratos
- **SPL Tokens** - Tokens Solana

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Prometheus** - Monitoramento
- **Grafana** - Dashboards
- **ELK Stack** - Logs e analytics
- **Nginx** - Reverse proxy

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm 8+
- Docker e Docker Compose
- Solana CLI (opcional)

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/agrotm/agrotm-solana.git
cd agrotm-solana

# Instale todas as dependências
npm run install:all

# Execute em modo desenvolvimento
npm run dev
```

### Execução com Docker

```bash
# Construa e execute todos os serviços
docker-compose up -d

# Visualize os logs
docker-compose logs -f

# Pare todos os serviços
docker-compose down
```

### Execução Individual

```bash
# Frontend apenas
npm run dev:frontend

# Backend apenas
npm run dev:backend

# Todos os módulos
npm run dev:api
npm run dev:staking
npm run dev:dashboard
```

## 📊 Monitoramento

### Dashboards Disponíveis
- **Grafana**: http://localhost:3005 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200

### Métricas Monitoradas
- Performance da aplicação
- Métricas de blockchain
- Uso de recursos
- Logs e erros
- Métricas de negócio

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Executa frontend + backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend
npm run dev:api          # API Gateway
npm run dev:staking      # Módulo Staking
npm run dev:dashboard    # DeFi Dashboard
```

### Build e Deploy
```bash
npm run build           # Build de todos os módulos
npm run start           # Executa em produção
npm run docker:build    # Build Docker
npm run docker:up       # Executa com Docker
```

### Qualidade de Código
```bash
npm run lint            # Verifica código
npm run lint:fix        # Corrige automaticamente
npm run type-check      # Verifica tipos TypeScript
npm run test            # Executa testes
npm run format          # Formata código
```

### Manutenção
```bash
npm run clean           # Limpa arquivos temporários
npm run security:audit  # Auditoria de segurança
npm run install:all     # Instala todas as dependências
```

## 🌐 Portas dos Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 3000 | Interface principal |
| Backend | 3001 | API principal |
| API Gateway | 3002 | Gateway de APIs |
| Staking | 3003 | Módulo de staking |
| DeFi Dashboard | 3004 | Dashboard DeFi |
| Grafana | 3005 | Dashboards de monitoramento |
| Prometheus | 9090 | Métricas |
| Kibana | 5601 | Visualização de logs |
| Elasticsearch | 9200 | Busca de logs |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6379 | Cache |

## 🔐 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Aplicação
NODE_ENV=development
PORT=3000

# Banco de Dados
DATABASE_URL=postgresql://postgres:password@localhost:5432/agrotm
REDIS_URL=redis://localhost:6379

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# JWT
JWT_SECRET=your-super-secret-jwt-key

# APIs Externas
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Monitoramento
PROMETHEUS_URL=http://localhost:9090
GRAFANA_URL=http://localhost:3005
```

## 📁 Estrutura de Arquivos

```
agrotm-solana/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 api/               # APIs do Next.js
│   ├── 📂 dashboard/         # Página do dashboard
│   └── 📂 staking/           # Página de staking
├── 📂 components/            # Componentes React
│   ├── 📂 ui/               # Componentes de interface
│   ├── 📂 layout/           # Componentes de layout
│   ├── 📂 sections/         # Seções da página
│   ├── 📂 dashboard/        # Componentes do dashboard
│   ├── 📂 forms/            # Formulários
│   ├── 📂 modals/           # Modais
│   ├── 📂 analytics/        # Componentes de analytics
│   ├── 📂 widgets/          # Widgets
│   └── 📂 soar/             # Componentes SOAR
├── 📂 frontend/             # Módulo Frontend
├── 📂 backend/              # Módulo Backend
├── 📂 api/                  # Módulo API Gateway
├── 📂 staking/              # Módulo Staking
├── 📂 defi-dashboard/       # Módulo DeFi Dashboard
├── 📂 contracts/            # Smart Contracts Solana
├── 📂 microservices/        # Microserviços
├── 📂 hooks/               # React Hooks
├── 📂 services/            # Serviços de negócio
├── 📂 types/               # Definições TypeScript
├── 📂 utils/               # Utilitários
├── 📂 public/              # Arquivos públicos
│   ├── 📂 assets/          # Assets estáticos
│   ├── 📂 locales/         # Internacionalização
│   └── 📂 videos/          # Vídeos
└── 📂 .github/             # GitHub Actions
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [docs.agrotm.com](https://docs.agrotm.com)
- **Issues**: [GitHub Issues](https://github.com/agrotm/agrotm-solana/issues)
- **Discord**: [Agrotm Community](https://discord.gg/agrotm)
- **Email**: support@agrotm.com

## 🔗 Links Úteis

- [Website](https://agrotm.com)
- [Whitepaper](https://agrotm.com/whitepaper.pdf)
- [Documentação](https://docs.agrotm.com)
- [API Docs](https://api.agrotm.com/docs)
- [Status](https://status.agrotm.com)

---

**Desenvolvido com ❤️ pela equipe Agrotm**
