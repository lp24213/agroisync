# AgroSync Backend

Backend completo da plataforma AgroSync - Sistema de agronegócio com marketplace, fretes, pagamentos e mensageria privada.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação Segura**: JWT, bcrypt, validações
- **Validações em Tempo Real**: CPF/CNPJ (ReceitaWS), CEP (IBGE), IE (Sefaz)
- **Sistema de Pagamentos**: Stripe + Metamask (crypto)
- **Mensageria Privada**: Conversas entre usuários pagos
- **Controle de Acesso**: Baseado em planos ativos
- **Rate Limiting**: Proteção contra abuso
- **Segurança**: Helmet, CORS, validação de entrada

### 🔄 Em Desenvolvimento
- **WebSocket**: Mensageria em tempo real
- **Upload de Arquivos**: AWS S3 ou similar
- **Notificações**: Email, push, SMS
- **Analytics**: Métricas e relatórios

## 🛠️ Tecnologias

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Autenticação**: JWT + bcrypt
- **Email**: Resend API
- **Pagamentos**: Stripe + Metamask
- **Validação**: Joi + express-validator
- **Segurança**: CORS + Rate Limiting + Turnstile

## 📋 Pré-requisitos

- Conta Cloudflare (Workers + D1)
- Wrangler CLI instalado
- Conta Stripe (para pagamentos)
- Conta Resend (para emails)
- Chaves de API externas (IBGE, ViaCEP, OpenWeather)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/agrosync/backend.git
cd backend
```

### 2. Login no Cloudflare
```bash
npx wrangler login
npx wrangler whoami  # Verificar login
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

### 4. Deploy do Worker
```bash
npx wrangler deploy
```

### 5. Inicializar banco D1 (primeira vez)
```bash
# Aplicar schema
npx wrangler d1 execute agroisync-db --file=schema.sql

# Executar migrações
npx wrangler d1 execute agroisync-db --file=migrations/001_create_users_table.sql
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Cloudflare D1 Database
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_stripe

# Crypto
OWNER_WALLET=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
WEB3_PROVIDER=https://mainnet.infura.io/v3/seu_projeto

# APIs Externas

## 🔒 Segurança

### Medidas Implementadas:
- **JWT Authentication**: Tokens seguros com expiração
- **Rate Limiting**: Proteção contra abuso de API
- **CORS**: Controle de acesso entre origens
- **Cloudflare Turnstile**: Proteção contra bots
- **Validação de Entrada**: Sanitização de dados
- **Auditoria**: Log de ações críticas
- **D1 Prepared Statements**: Proteção contra SQL injection

### Variáveis Críticas:
```env
JWT_SECRET=sua-chave-jwt-muito-segura-min-32-chars
CLOUDFLARE_TURNSTILE_SECRET_KEY=sua-chave-turnstile
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook
```

# APIs Externas
OPENWEATHER_API_KEY=sua_chave_openweather
RECEITA_WS_API_KEY=sua_chave_receita
SEFAZ_API_KEY=sua_chave_sefaz
```

### 4. Inicie o MongoDB
```bash
# Local
mongod

# Ou usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Execute as migrações (se necessário)
```bash
npm run db:migrate
```

### 6. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Estrutura do Projeto

```
backend/
├── src/
│   ├── models/          # Modelos Mongoose
│   │   ├── User.js      # Usuários e autenticação
│   │   ├── Payment.js   # Pagamentos e planos
│   │   ├── Conversation.js # Conversas da mensageria
│   │   └── Message.js   # Mensagens individuais
│   ├── routes/          # Rotas da API
│   │   ├── auth.js      # Autenticação
│   │   ├── validation.js # Validações CPF/CNPJ/CEP/IE
│   │   ├── payments.js  # Pagamentos Stripe + Crypto
│   │   ├── messages.js  # Mensageria privada
│   │   ├── products.js  # Produtos da loja
│   │   ├── freights.js  # Fretes do AgroConecta
│   │   └── admin.js     # Painel administrativo
│   ├── middleware/      # Middlewares customizados
│   │   └── auth.js      # Autenticação JWT
│   └── server.js        # Servidor principal
├── scripts/             # Scripts utilitários
├── tests/               # Testes automatizados
├── .env.example         # Exemplo de variáveis
├── package.json         # Dependências
└── README.md           # Este arquivo
```

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

### Validações
- `POST /api/validation/cpf` - Validar CPF via ReceitaWS
- `POST /api/validation/cnpj` - Validar CNPJ via ReceitaWS
- `POST /api/validation/cep` - Validar CEP via IBGE
- `POST /api/validation/ie` - Validar IE via Sefaz

### Pagamentos
- `GET /api/payments/status` - Status do pagamento
- `POST /api/payments/stripe/create-session` - Criar sessão Stripe
- `POST /api/payments/crypto/verify` - Verificar pagamento crypto
- `POST /api/payments/cancel` - Cancelar assinatura
- `GET /api/payments/history` - Histórico de pagamentos

### Mensageria
- `GET /api/messages/conversations` - Listar conversas
- `GET /api/messages/conversations/:id` - Buscar conversa
- `POST /api/messages/conversations` - Criar conversa
- `POST /api/messages/conversations/:id/messages` - Enviar mensagem
- `PUT /api/messages/conversations/:id/read` - Marcar como lida

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Buscar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Fretes
- `GET /api/freights` - Listar fretes
- `POST /api/freights` - Criar frete
- `GET /api/freights/:id` - Buscar frete
- `PUT /api/freights/:id` - Atualizar frete
- `DELETE /api/freights/:id` - Deletar frete

## 🔐 Autenticação

### JWT Token
O sistema usa JWT para autenticação. Inclua o token no header:

```bash
Authorization: Bearer <seu-jwt-token>
```

### Controle de Acesso
- **Usuários não autenticados**: Apenas endpoints públicos
- **Usuários autenticados**: Acesso básico + perfil
- **Usuários pagos**: Acesso completo aos recursos privados
- **Admins**: Acesso total ao sistema

## 💳 Sistema de Pagamentos

### Stripe (Cartão)
- Criação de sessões de checkout
- Webhooks para confirmação
- Assinaturas recorrentes
- Suporte a múltiplas moedas

### Metamask (Crypto)
- Integração com Ethereum
- Verificação de transações
- Suporte a múltiplas redes
- Pagamentos para carteira específica

## 📱 Mensageria

### Conversas
- Entre compradores e vendedores
- Entre freteiros e anunciantes
- Suporte a arquivos e imagens
- Histórico completo salvo

### Recursos
- Upload de arquivos (10MB max)
- Tipos: texto, arquivo, imagem
- Status: enviada, entregue, lida
- Notificações em tempo real (em breve)

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📝 Linting e Formatação

```bash
# Verificar código
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix

# Formatar código
npm run format
```

## 🚀 Deploy

### Variáveis de Produção
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://agrosync.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrosync
JWT_SECRET=chave-super-secreta-producao
```

### PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker
```bash
docker build -t agrosync-backend .
docker run -p 5000:5000 agrosync-backend
```

## 🔒 Segurança

- **Rate Limiting**: Proteção contra abuso
- **Validação de Entrada**: Sanitização de dados
- **Headers de Segurança**: Helmet + CORS
- **Autenticação JWT**: Tokens seguros
- **Hash de Senhas**: bcrypt com salt
- **Logs de Auditoria**: Rastreamento de ações

## 📊 Monitoramento

- **Health Check**: `/health`
- **Logs**: Morgan + console
- **Métricas**: Em desenvolvimento
- **Alertas**: Em desenvolvimento

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/agrosync/backend/issues)
- **Documentação**: [Wiki](https://github.com/agrosync/backend/wiki)
- **Email**: suporte@agrosync.com

## 🔄 Changelog

### v1.0.0 (Atual)
- ✅ Sistema de autenticação completo
- ✅ Validações em tempo real
- ✅ Pagamentos Stripe + Crypto
- ✅ Mensageria privada
- ✅ Controle de acesso baseado em planos
- ✅ API REST completa
- ✅ Segurança e rate limiting

### Próximas Versões
- 🔄 WebSocket para mensageria em tempo real
- 🔄 Upload de arquivos
- 🔄 Sistema de notificações
- 🔄 Analytics e métricas
- 🔄 Cache Redis
- 🔄 Testes automatizados