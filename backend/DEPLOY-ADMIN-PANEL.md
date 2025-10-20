# 🚀 Deploy do Admin Panel com Cloudflare D1

Este guia mostra como fazer o deploy do painel administrativo usando Cloudflare Workers + D1.

## ✅ Correções Realizadas

### 1. **VLibras CSP Error** ✅
- Adicionado `https://vlibras.gov.br` ao Content Security Policy em `frontend/public/index.html`
- O widget VLibras agora carrega corretamente

### 2. **API Response Parsing** ✅
- Corrigido `frontend/src/pages/AdminPanel.js` para acessar `response.data.data.users` corretamente
- Adicionado melhor tratamento de erros e logging

### 3. **Backend Admin Routes** ✅
- Criado `backend/src/handlers/admin.js` com handlers compatíveis com D1
- Rotas agora usam SQL direto ao invés de Mongoose
- Adicionado middleware para verificar permissões de admin

## 📋 Pré-requisitos

1. **Cloudflare Workers CLI instalado**:
```bash
npm install -g wrangler
```

2. **Autenticado no Wrangler**:
```bash
wrangler login
```

3. **D1 Database configurado**:
```bash
# Ver databases existentes
wrangler d1 list

# Se não houver, criar um
wrangler d1 create agroisync-db
```

## 🔧 Configuração

### 1. Verificar `wrangler.toml`

Certifique-se que seu `backend/wrangler.toml` tem a configuração D1:

```toml
name = "agroisync-backend"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "agroisync-db"
database_id = "SEU_DATABASE_ID_AQUI"

[[kv_namespaces]]
binding = "CACHE"
id = "SEU_KV_ID_CACHE"

[[kv_namespaces]]
binding = "SESSIONS"
id = "SEU_KV_ID_SESSIONS"
```

### 2. Inicializar schema do banco (se ainda não fez)

```bash
cd backend

# Executar schema principal
wrangler d1 execute agroisync-db --file=./schema.sql

# Executar migrações
wrangler d1 execute agroisync-db --file=./migrations/001_create_users_table.sql
```

### 3. Criar usuário admin

Você precisa inserir um usuário admin no banco D1:

```bash
# Execute este SQL no D1
wrangler d1 execute agroisync-db --command="
INSERT INTO users (id, email, name, password, isAdmin, isActive, businessType, createdAt, updatedAt)
VALUES (
  'admin-001',
  'admin@agroisync.com',
  'Administrador',
  '\$2a\$10\$abcdefghijklmnopqrstuvwxyz123456',
  1,
  1,
  'admin',
  $(date +%s)000,
  $(date +%s)000
);
"
```

**Nota**: Você precisa gerar o hash bcrypt da senha. Use este Node.js script:

```javascript
// generate-admin-password.js
const bcrypt = require('bcryptjs');
const password = 'Admin@123456'; // Altere para sua senha
const hash = bcrypt.hashSync(password, 10);
console.log('Hash:', hash);
```

Execute: `node generate-admin-password.js` e use o hash gerado no INSERT acima.

## 🚀 Deploy

### 1. Build do Frontend

```bash
cd frontend
npm run build
```

### 2. Deploy do Backend (Workers + D1)

```bash
cd backend

# Deploy para produção
wrangler deploy

# OU deploy para preview/staging
wrangler deploy --env staging
```

### 3. Verificar deploy

```bash
# Testar health check
curl https://SEU-WORKER.workers.dev/api/health

# Testar login (obter token)
curl -X POST https://SEU-WORKER.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agroisync.com","password":"Admin@123456"}'

# Testar endpoint admin (use o token obtido)
curl https://SEU-WORKER.workers.dev/api/admin/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔍 Debugging

### Ver logs em tempo real

```bash
wrangler tail
```

### Consultar dados no D1

```bash
# Ver todos os usuários
wrangler d1 execute agroisync-db --command="SELECT * FROM users"

# Ver usuários admin
wrangler d1 execute agroisync-db --command="SELECT id, email, name, isAdmin FROM users WHERE isAdmin = 1"

# Contar registros
wrangler d1 execute agroisync-db --command="SELECT COUNT(*) as total FROM users"
```

## 📊 Endpoints Admin Disponíveis

Todos os endpoints requerem autenticação (`Authorization: Bearer TOKEN`) e permissão de admin (`isAdmin = true`):

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/dashboard` | Estatísticas gerais |
| GET | `/api/admin/users` | Listar usuários |
| GET | `/api/admin/products` | Listar produtos |
| GET | `/api/admin/payments` | Listar pagamentos |
| GET | `/api/admin/registrations` | Listar cadastros |
| GET | `/api/admin/activity` | Atividade recente |
| PUT | `/api/admin/users/:id/status` | Ativar/desativar usuário |
| DELETE | `/api/admin/products/:id` | Deletar produto |

## 🔐 Segurança

1. **Sempre use HTTPS** em produção
2. **Rotacione secrets regularmente**:
```bash
wrangler secret put JWT_SECRET
wrangler secret put ADMIN_PASSWORD
```

3. **Configure CORS apropriadamente** no worker
4. **Use rate limiting** para endpoints admin
5. **Monitore logs** de acesso admin

## 📝 Variáveis de Ambiente (Secrets)

Configure secrets no Cloudflare:

```bash
wrangler secret put JWT_SECRET
wrangler secret put JWT_EXPIRES_IN
wrangler secret put CORS_ORIGIN
wrangler secret put ADMIN_EMAIL
```

## 🐛 Troubleshooting

### Erro: "Database not available"
- Verifique se o D1 está configurado no `wrangler.toml`
- Confirme que o binding `DB` está correto

### Erro: "Token inválido"
- Verifique se o JWT_SECRET é o mesmo usado para gerar o token
- Confirme que o token não expirou

### Erro: "Usuários não aparecem"
- Verifique se há usuários no banco: `wrangler d1 execute agroisync-db --command="SELECT COUNT(*) FROM users"`
- Confirme que a query SQL está correta
- Veja os logs: `wrangler tail`

### Erro: "Acesso negado"
- Verifique se o usuário tem `isAdmin = 1` no banco
- Confirme que o token JWT inclui `isAdmin: true`

## 📚 Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## ✅ Checklist de Deploy

- [ ] D1 database criado e configurado
- [ ] Schema aplicado no D1
- [ ] Usuário admin criado no banco
- [ ] `wrangler.toml` configurado corretamente
- [ ] Secrets configurados
- [ ] Frontend buildado
- [ ] Backend deployed
- [ ] Health check testado
- [ ] Login admin testado
- [ ] Endpoints admin testados

---

**Última atualização**: 2025-01-19
**Versão**: 1.0.0

