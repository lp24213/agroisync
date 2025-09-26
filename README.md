# 🚀 AgroSync - Futuro do Agronegócio

A plataforma de agronegócio mais futurista e completa do mundo, superando Tesla, Apple, Solana e Star Atlas em design e usabilidade, com arquitetura enterprise, backend seguro e frontend premium.

## 📋 Estrutura do Projeto

Este repositório contém **apenas o frontend** do AgroSync. O backend está em um repositório separado.

### 🎯 Frontend (Este Repositório)
- **Nome**: `agroisync`
- **URL**: https://agroisync.pages.dev/
- **Plataforma**: Cloudflare Pages
- **Framework**: React (Create React App)
- **Styling**: TailwindCSS + Framer Motion

### 🔧 Backend (Repositório Separado)
- **Nome**: `agroisync-backend`
- **URL**: https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api
- **Plataforma**: Cloudflare Workers
- **Runtime**: Node.js

## ✨ Características Principais

### 🎨 Design & UX
- **Tema futurista**: Dark mode profissional com toques de neon (azul/verde/dourado/roxo)
- **Glassmorphism**: Cards com vidro fosco e sombras suaves
- **Animações fluidas**: Framer Motion para transições premium
- **Responsivo total**: Desktop, tablet e mobile
- **Tipografia moderna**: Inter + JetBrains Mono

### 🖥️ Frontend (React 18 + Tailwind + Framer Motion)
- **Home**: Hero animado, clima em tempo real, cotações agrícolas, notícias, chatbot IA
- **Marketplace**: Loja completa com filtros avançados, favoritos, carrinho, avaliações
- **AgroConecta**: Sistema de fretes com mapa interativo, propostas, rastreamento
- **Cripto**: Integração MetaMask, staking, NFTs agrícolas, DeFi
- **Mensageria**: Chat privado em tempo real com notificações
- **Painel Admin**: Estatísticas, gestão de usuários, relatórios
- **Autenticação**: Login/Registro/2FA com Cognito + JWT + TOTP/SMS
- **Planos**: Assinaturas com Stripe + Crypto
- **Dashboard**: Perfil, histórico, favoritos, transações

### ⚙️ Backend (Node.js + Express + MongoDB + AWS)
- **APIs completas**: Auth, produtos, fretes, mensagens, pagamentos, admin
- **Segurança**: JWT + 2FA, rate limiting, bcrypt, logs
- **LGPD**: Opt-in/out, direito ao esquecimento
- **Real-time**: Socket.io para mensageria
- **Cache**: Redis para performance
- **Upload**: Cloudinary para imagens

### ☁️ AWS Amplify + Cognito + Lambda
- **Cognito**: MFA obrigatório, social login, UI hosted
- **Lambda**: Funções admin, NFTs, staking, analytics
- **S3**: Armazenamento seguro com criptografia
- **Amplify**: Deploy automático, CDN global, SSL

### 💳 Pagamentos
- **Stripe**: Planos, webhooks, faturas
- **Ethereum**: MetaMask, staking, NFTs
- **Escrow**: Pagamentos condicionais, disputas, arbitragem

### 🌐 Multilíngue
- **Idiomas**: PT (padrão), EN, ES, ZH
- **i18next**: Fallback automático
- **Localização**: Datas, moedas, números

### 📊 Analytics & Notificações
- **Dashboard**: Métricas em tempo real
- **Notificações**: Push, SMS, email, in-app
- **Relatórios**: PDF/CSV para admin

### 🤖 Chatbot IA
- **Sempre visível**: Em todas as páginas
- **Múltiplos modos**: Texto, voz, imagem
- **Integração**: Dados do AgroSync, FAQ, suporte

## 🛠️ Tecnologias

### Frontend
- React 18
- TailwindCSS
- Framer Motion
- React Router
- Axios
- Socket.io Client
- i18next
- Ethers.js
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB
- Redis
- Socket.io
- JWT
- Bcrypt
- Stripe
- Twilio
- Cloudinary

### Cloud & DevOps
- AWS Amplify
- AWS Cognito
- AWS Lambda
- AWS S3
- MongoDB Atlas
- Redis Cloud

## 🚀 Deploy

### Frontend (Cloudflare Pages)
```bash
# Deploy automático via GitHub
git add .
git commit -m "Update frontend"
git push origin main

# Ou deploy manual
npm run build
# Upload da pasta frontend/build para Cloudflare Pages
```

### Backend (Cloudflare Workers)
```bash
# No repositório do backend
wrangler deploy --env production
```

## 🛠️ Desenvolvimento Local

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 📁 Estrutura de Diretórios

```
agroisync/                    # Frontend (este repositório)
├── frontend/                 # Código fonte do frontend
│   ├── src/                 # Componentes React
│   ├── public/              # Arquivos estáticos
│   └── build/               # Build de produção
├── cloudflare-pages.json    # Configuração Cloudflare Pages
├── pages.toml              # Configuração adicional
└── deploy-frontend.ps1     # Script de deploy

agroisync-backend/           # Backend (repositório separado)
├── src/                     # Código fonte do backend
├── wrangler.toml           # Configuração Cloudflare Workers
└── deploy-backend.ps1      # Script de deploy
```

## 🌐 URLs de Produção

- **Frontend**: https://agroisync.pages.dev/
- **API**: https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api
- **Dashboard Cloudflare**: https://dash.cloudflare.com/

## 🔧 Configuração

### Variáveis de Ambiente (Frontend)
- `REACT_APP_API_URL`: URL da API do backend
- `NODE_VERSION`: Versão do Node.js (18.20.4)

### Secrets (Backend)
- `MONGODB_URI`: String de conexão MongoDB
- `JWT_SECRET`: Chave secreta JWT
- `STRIPE_SECRET_KEY`: Chave secreta Stripe

## 📱 Funcionalidades

### 🏠 Home
- Hero section animado
- Estatísticas em tempo real
- Recursos principais
- Depoimentos
- CTA para registro

### 🛒 Marketplace
- Catálogo de produtos
- Filtros avançados
- Sistema de favoritos
- Carrinho de compras
- Avaliações e reviews

### 🚛 AgroConecta
- Publicação de fretes
- Mapa interativo
- Sistema de propostas
- Rastreamento em tempo real
- Histórico de fretes

### ₿ Cripto & DeFi
- Integração MetaMask
- Carteira digital
- Staking de tokens
- NFTs agrícolas
- Transações blockchain

### 💬 Mensageria
- Chat em tempo real
- Notificações push
- Histórico de conversas
- Compartilhamento de arquivos

### ⚙️ Admin Panel
- Dashboard com métricas
- Gestão de usuários
- Relatórios avançados
- Configurações do sistema

## 🔐 Segurança

- **Autenticação**: JWT + 2FA obrigatório
- **Autorização**: Role-based access control
- **Rate Limiting**: Proteção contra ataques
- **Validação**: Joi para validação de dados
- **Criptografia**: Bcrypt para senhas
- **LGPD**: Conformidade com privacidade
- **Logs**: Auditoria completa

## 🌍 Deploy em Produção

### Frontend (Cloudflare Pages)
```bash
# Deploy automático via GitHub
git add .
git commit -m "Update frontend"
git push origin main

# Cloudflare Pages fará deploy automaticamente
```

### Backend (Cloudflare Workers)
```bash
# No repositório do backend
wrangler deploy --env production
```

## 📊 Monitoramento

- **Logs**: Winston com rotação diária
- **Métricas**: Performance e uso
- **Alertas**: Notificações automáticas
- **Backup**: Automático e seguro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: contato@agrosync.com
- **Telefone**: +55 (11) 99999-9999
- **Documentação**: [docs.agrosync.com](https://docs.agrosync.com)
- **Status**: [status.agrosync.com](https://status.agrosync.com)

## 🎯 Roadmap

- [ ] Integração com mais blockchains
- [ ] IA para análise de mercado
- [ ] App mobile nativo
- [ ] Integração com IoT
- [ ] Marketplace global
- [ ] Sistema de leilões

---

**AgroSync** - Conectando o futuro do agronegócio 🚀