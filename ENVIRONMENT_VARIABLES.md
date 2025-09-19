# 🔧 Variáveis de Ambiente - AGROISYNC

## 📋 Visão Geral

Este documento lista todas as variáveis de ambiente necessárias para executar o AGROISYNC em diferentes ambientes (desenvolvimento, produção).

## 🔐 Variáveis Obrigatórias

### Backend (.env)

```bash
# Database
MONGO_URI=mongodb://localhost:27017/agroisync
# ou para produção: mongodb+srv://user:password@cluster.mongodb.net/agroisync

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Service (SendGrid/Mailgun/SES)
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=noreply@agroisync.com
EMAIL_SERVICE=sendgrid # ou mailgun, ses

# Cloudflare
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-turnstile-secret-key
CLOUDFLARE_ACCESS_TEAM_DOMAIN=your-team-domain.cloudflareaccess.com
CLOUDFLARE_ACCESS_TOKEN=your-cloudflare-access-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ZONE_ID=your-cloudflare-zone-id

# PII Encryption
PII_ENCRYPTION_KEY=your-super-secret-pii-encryption-key-32-chars
AUDIT_ENCRYPTION_KEY=your-super-secret-audit-encryption-key-32-chars

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Admin Credentials (DEV ONLY)
ADMIN_EMAIL=luispaulodeoliveira@agrotm.com.br
ADMIN_PASSWORD=Th@ys15221008
```

### Frontend (.env)

```bash
# API
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000

# Cloudflare Turnstile
REACT_APP_TURNSTILE_SITE_KEY=your-turnstile-site-key

# Admin Credentials (DEV ONLY)
REACT_APP_ADMIN_EMAIL=luispaulodeoliveira@agrotm.com.br
REACT_APP_ADMIN_PASSWORD=Th@ys15221008

# OpenAI (opcional para frontend)
REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 🚀 Configuração por Ambiente

### Desenvolvimento

```bash
# Backend
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/agroisync-dev
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Produção

```bash
# Backend
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/agroisync-prod
FRONTEND_URL=https://agroisync.com

# Frontend
REACT_APP_API_URL=https://api.agroisync.com
REACT_APP_FRONTEND_URL=https://agroisync.com
```

## 🔒 Segurança

### ⚠️ IMPORTANTE

1. **NUNCA** commite arquivos `.env` no repositório
2. **NUNCA** use credenciais de produção em desenvolvimento
3. **SEMPRE** use variáveis de ambiente para secrets
4. **ROTACIONE** chaves regularmente em produção

### Credenciais de Desenvolvimento

As credenciais abaixo são **APENAS** para desenvolvimento:

```
Email: luispaulodeoliveira@agrotm.com.br
Senha: Th@ys15221008
```

**Em produção, estas credenciais devem ser alteradas!**

## 📝 Checklist de Configuração

### Backend
- [ ] MongoDB configurado e acessível
- [ ] OpenAI API key válida
- [ ] Email service configurado
- [ ] Cloudflare Turnstile configurado
- [ ] JWT secret definido
- [ ] Admin credentials definidas (dev)

### Frontend
- [ ] API URL configurada
- [ ] Cloudflare Turnstile site key
- [ ] Admin credentials (dev)
- [ ] Build configurado para produção

## 🛠️ Serviços Externos

### OpenAI
- Criar conta em: https://platform.openai.com/
- Gerar API key
- Configurar billing

### Cloudflare Turnstile
- Criar conta em: https://dash.cloudflare.com/
- Configurar Turnstile
- Obter site key e secret key

### Email Service
Escolher um dos serviços:
- **SendGrid**: https://sendgrid.com/
- **Mailgun**: https://www.mailgun.com/
- **AWS SES**: https://aws.amazon.com/ses/

### MongoDB
- **Desenvolvimento**: MongoDB local
- **Produção**: MongoDB Atlas (recomendado)

## 🚨 Troubleshooting

### Erro de Conexão com MongoDB
```bash
# Verificar se MongoDB está rodando
mongosh --eval "db.adminCommand('ismaster')"
```

### Erro de OpenAI API
```bash
# Testar API key
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.openai.com/v1/models
```

### Erro de Email
```bash
# Verificar logs do servidor
tail -f logs/app.log
```

## 📞 Suporte

Para dúvidas sobre configuração:
- Email: contato@agroisync.com
- Documentação: https://docs.agroisync.com
