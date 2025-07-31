# 🚀 Deploy AGROTM Backend no Railway

## Configuração Inicial

### 1. Criar projeto no Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login

# Criar novo projeto
railway init

# Conectar ao projeto existente
railway link
```

### 2. Configurar Variáveis de Ambiente

No dashboard do Railway, configure as seguintes variáveis:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrotm?retryWrites=true&w=majority

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_MAINNET_RPC=https://api.mainnet-beta.solana.com
SOLANA_DEVNET_RPC=https://api.devnet.solana.com
SOLANA_TESTNET_RPC=https://api.testnet.solana.com

# Security Configuration
CORS_ORIGIN=https://agrotm.com,https://www.agrotm.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Health Check Configuration
HEALTH_CHECK_INTERVAL=30000
HEALTH_CHECK_TIMEOUT=5000
```

### 3. Deploy Manual

```bash
# Deploy para produção
railway up

# Ver logs
railway logs

# Abrir no navegador
railway open
```

### 4. Deploy via GitHub Actions

O deploy automático está configurado no workflow `.github/workflows/ci-cd.yml`.

**Secrets necessários no GitHub:**
- `RAILWAY_TOKEN`: Token do Railway (a9861d54-80c6-4ca5-b119-ea2a64b8541d)

## Estrutura de Arquivos

```
backend/
├── railway.json          # Configuração Railway
├── nixpacks.toml         # Configuração de build
├── Procfile             # Comando de inicialização
├── Dockerfile           # Container Docker
├── .dockerignore        # Arquivos ignorados no Docker
├── railway.toml         # Configuração adicional
└── RAILWAY_DEPLOY.md    # Esta documentação
```

## Monitoramento

### Health Check
- **Endpoint**: `/health`
- **Timeout**: 300s
- **Intervalo**: 30s

### Logs
```bash
# Ver logs em tempo real
railway logs --follow

# Ver logs de um serviço específico
railway logs --service agrotm-backend
```

### Métricas
- CPU e memória no dashboard do Railway
- Logs estruturados com Winston
- Métricas de performance

## Troubleshooting

### Problemas Comuns

1. **Build falha**
   ```bash
   # Verificar logs de build
   railway logs --build
   ```

2. **Aplicação não inicia**
   ```bash
   # Verificar variáveis de ambiente
   railway variables

   # Verificar logs de inicialização
   railway logs
   ```

3. **Timeout no health check**
   - Verificar se o endpoint `/health` está respondendo
   - Aumentar `healthcheckTimeout` se necessário

### Comandos Úteis

```bash
# Status do deploy
railway status

# Informações do projeto
railway project

# Listar serviços
railway service list

# Conectar ao shell do container
railway shell

# Reiniciar serviço
railway service restart
```

## Segurança

- ✅ **HTTPS automático** no Railway
- ✅ **Rate limiting** configurado
- ✅ **CORS** configurado
- ✅ **Helmet** para headers de segurança
- ✅ **Validação de entrada** com Zod
- ✅ **Auditoria** de todas as operações

## Performance

- ✅ **Compressão** com gzip
- ✅ **Cache** com Redis
- ✅ **Connection pooling** MongoDB
- ✅ **Logs estruturados** para análise
- ✅ **Health checks** automáticos

## Suporte

Para suporte técnico:
- 📧 Email: support@agrotm.com
- 📖 Documentação: https://docs.agrotm.com
- 🐛 Issues: https://github.com/agrotm/agrotm-solana/issues
