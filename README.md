# AgroSync - Plataforma de Inteligência Agrícola

## 🚀 Funcionalidades Implementadas

### ✅ Página de Planos (`/planos`)
- **Integração completa com Stripe Checkout** para pagamentos via cartão
- **Integração com Metamask** para pagamentos em criptomoedas
- **Sistema de planos diferenciados** para Anunciantes e Freteiros
- **Liberação automática** do painel privado após confirmação de pagamento
- **Registro completo** de transações no MongoDB

### ✅ Página de Cripto (`/cripto`)
- **Integração com CoinGecko API** para dados reais em tempo real
- **Conectividade Metamask** para carteiras blockchain
- **Gráficos interativos** de preços e histórico
- **Suporte a múltiplas redes** (Ethereum, Polygon, BSC)
- **Pagamentos cripto** para planos e serviços

### ✅ Sistema de Notícias
- **Integração com Globo Rural RSS** para notícias atualizadas
- **APIs de Agrolink e Canal Rural** para cobertura completa
- **Sistema de cache inteligente** para performance
- **Categorização automática** de notícias por tema
- **Fallback robusto** em caso de indisponibilidade das APIs

### ✅ Sistema de Pagamentos
- **Webhook Stripe** para confirmação automática
- **Verificação on-chain** para pagamentos cripto
- **Gestão de planos** com expiração automática
- **Histórico completo** de transações
- **Notificações automáticas** para usuários

## 🔧 Configuração das APIs

### 1. Stripe (Pagamentos)
```bash
# Backend (.env)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# Frontend (.env.local)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Metamask (Criptomoedas)
```bash
# Backend (.env)
ETHEREUM_NETWORK=mainnet
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
METAMASK_PRIVATE_KEY=your-metamask-private-key

# Frontend (.env.local)
REACT_APP_OWNER_WALLET=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
REACT_APP_ETHEREUM_NETWORK=mainnet
```

### 3. CoinGecko (Dados Cripto)
```bash
# Frontend (.env.local)
REACT_APP_COINGECKO_API_URL=https://api.coingecko.com/api/v3
# API Key opcional para limites mais altos
REACT_APP_COINGECKO_API_KEY=your-api-key
```

### 4. OpenWeather (Clima)
```bash
# Backend (.env)
OPENWEATHER_API_KEY=your-openweather-api-key-here

# Frontend (.env.local)
REACT_APP_OPENWEATHER_API_KEY=your-openweather-api-key-here
```

### 5. APIs de Notícias
```bash
# Backend (.env)
# As APIs de notícias são públicas e não requerem chaves
# RSS URLs configuradas automaticamente:
# - Globo Rural: https://g1.globo.com/rss/g1/economia/agronegocios/
# - Agrolink: https://www.agrolink.com.br/rss/noticias
# - Canal Rural: https://www.canalrural.com.br/rss/noticias
```

## 📦 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/agroisync/agroisync.git
cd agroisync
```

### 2. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Backend
cp backend/env.example backend/.env
# Edite backend/.env com suas chaves de API

# Frontend
cp frontend/env.example frontend/.env.local
# Edite frontend/.env.local com suas chaves de API
```

### 4. Configure o MongoDB
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/agroisync
# Ou MongoDB Atlas
MONGODB_URI_PRODUCTION=mongodb+srv://username:password@cluster.mongodb.net/agroisync
```

### 5. Inicie os serviços
```bash
# Backend
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm start
```

## 🔐 Configuração de Segurança

### 1. JWT Secrets
```bash
# Backend (.env)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
```

### 2. Rate Limiting
```bash
# Backend (.env)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. CORS
```bash
# Backend (.env)
CORS_ORIGIN=http://localhost:3000
# Em produção: https://yourdomain.com
```

## 🚀 Deploy

### AWS Amplify (Recomendado)
```bash
# O projeto está configurado para deploy automático via GitHub
# Push para main branch dispara deploy automático
git push origin main
```

### Deploy Manual
```bash
# Build do frontend
cd frontend
npm run build

# Deploy do backend
cd ../backend
npm run build
# Deploy para AWS Lambda ou seu servidor preferido
```

## 📊 Monitoramento

### 1. Logs
- **Backend**: Logs estruturados com Winston
- **Frontend**: Console logs para desenvolvimento
- **Produção**: Integração com Sentry para monitoramento de erros

### 2. Métricas
- **Performance**: New Relic APM
- **Infraestrutura**: AWS CloudWatch
- **Aplicação**: Métricas customizadas no MongoDB

### 3. Alertas
- **Erros**: Notificações automáticas via Sentry
- **Performance**: Alertas de latência via New Relic
- **Infraestrutura**: Alertas AWS CloudWatch

## 🔧 Manutenção

### 1. Atualizações de Dependências
```bash
# Verificar dependências desatualizadas
npm audit

# Atualizar dependências
npm update

# Atualizar dependências com breaking changes
npm audit fix --force
```

### 2. Backup do Banco
```bash
# MongoDB local
mongodump --db agroisync --out ./backup

# MongoDB Atlas
# Usar ferramentas de backup automático do Atlas
```

### 3. Limpeza de Cache
```bash
# Limpar cache de notícias
# Acessar endpoint: POST /api/news/clear-cache
# Requer autenticação de admin
```

## 🆘 Suporte

### 1. Documentação da API
- **Backend**: `backend/API-ROUTES-DOCUMENTATION.md`
- **Swagger**: Disponível em `/api/docs` (quando implementado)

### 2. Logs de Erro
- **Desenvolvimento**: Console do navegador e terminal
- **Produção**: Sentry dashboard e AWS CloudWatch

### 3. Contato
- **Email**: suporte@agroisync.com
- **WhatsApp**: (66) 99236-2830
- **Issues**: GitHub Issues do projeto

## 📝 Changelog

### v2.0.0 (Atual)
- ✅ Integração completa Stripe + Metamask
- ✅ APIs reais de criptomoedas (CoinGecko)
- ✅ Sistema de notícias com RSS feeds
- ✅ Página de planos funcional
- ✅ Sistema de pagamentos robusto
- ✅ Tema branco consistente em todas as páginas

### v1.0.0
- ✅ Estrutura base do projeto
- ✅ Autenticação e autorização
- ✅ Dashboard básico
- ✅ Sistema de mensageria

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Stripe** pela infraestrutura de pagamentos
- **CoinGecko** pelos dados de criptomoedas
- **OpenWeather** pelos dados climáticos
- **Globo Rural, Agrolink, Canal Rural** pelas notícias agrícolas
- **Comunidade open source** pelas bibliotecas utilizadas