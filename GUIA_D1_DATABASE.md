# 🗄️ GUIA D1 DATABASE - AGROISYNC
## Cloudflare D1: Banco de Dados SQL Serverless

---

## 📋 INFORMAÇÕES DO DATABASE

**Database Configurado:**
- **Nome:** `agroisync-db`
- **ID:** `a3eb1069-9c36-4689-9ee9-971245cb2d12`
- **Tipo:** Cloudflare D1 (SQLite serverless)
- **Região:** Global (edge locations)

---

## 🚀 INICIALIZAÇÃO RÁPIDA

### 1. **Instalar Wrangler CLI**

```bash
# Instalar globalmente
npm install -g wrangler

# Verificar instalação
wrangler --version
```

### 2. **Autenticar no Cloudflare**

```bash
# Login na sua conta Cloudflare
wrangler login
```

### 3. **Inicializar Database**

**Windows (PowerShell):**
```powershell
cd backend
.\init-d1-database.ps1
```

**Linux/Mac:**
```bash
cd backend
chmod +x init-d1-database.sh
./init-d1-database.sh
```

**OU Manualmente:**
```bash
cd backend
wrangler d1 execute agroisync-db --file=schema.sql
```

---

## 📊 ESTRUTURA DO DATABASE

### Tabelas Criadas

1. **users** - Usuários do sistema
2. **products** - Produtos à venda
3. **freights** - Fretes disponíveis
4. **messages** - Mensagens entre usuários
5. **transactions** - Transações e pagamentos
6. **notifications** - Notificações do sistema
7. **sessions** - Sessões de usuário
8. **audit_logs** - Logs de auditoria

### Usuário Admin Padrão

```
Email: admin@agroisync.com
Senha: AgroSync2024!@#SecureAdmin
```

**⚠️ IMPORTANTE:** Altere a senha do admin após primeiro login!

---

## 🔧 COMANDOS ÚTEIS

### Listar Databases
```bash
wrangler d1 list
```

### Informações do Database
```bash
wrangler d1 info agroisync-db
```

### Executar Query SQL
```bash
wrangler d1 execute agroisync-db --command="SELECT * FROM users LIMIT 5"
```

### Backup do Database
```bash
wrangler d1 export agroisync-db --output=backup.sql
```

### Restore do Database
```bash
wrangler d1 execute agroisync-db --file=backup.sql
```

### Ver Logs
```bash
wrangler tail
```

---

## 💻 DESENVOLVIMENTO LOCAL

### Iniciar Worker Localmente
```bash
cd backend
wrangler dev
```

Isso inicia o worker em: `http://localhost:8787`

### Testar Endpoints

**Health Check:**
```bash
curl http://localhost:8787/api/health
```

**Criar Usuário:**
```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "Senha123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@agroisync.com",
    "password": "AgroSync2024!@#SecureAdmin"
  }'
```

---

## 🌐 DEPLOY PARA PRODUÇÃO

### 1. Verificar Configuração
```bash
cat wrangler.toml
```

Deve conter:
```toml
[[d1_databases]]
binding = "DB"
database_name = "agroisync-db"
database_id = "a3eb1069-9c36-4689-9ee9-971245cb2d12"
```

### 2. Fazer Deploy
```bash
cd backend
wrangler publish
```

### 3. Verificar Deploy
```bash
# Ver workers ativos
wrangler deployments list

# Testar produção
curl https://agroisync.com/api/health
```

---

## 📝 USANDO D1 NO CÓDIGO

### Exemplo: Buscar Usuário

```javascript
// No Cloudflare Worker
export default {
  async fetch(request, env) {
    const { DB } = env; // D1 Database binding

    // Query simples
    const user = await DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    )
      .bind('admin@agroisync.com')
      .first();

    return Response.json({ user });
  }
};
```

### Usando Helper D1

```javascript
import { findUserByEmail } from './utils/d1-helper.js';

export default {
  async fetch(request, env) {
    const { DB } = env;

    const result = await findUserByEmail(DB, 'admin@agroisync.com');

    if (result.success) {
      return Response.json({ user: result.result });
    }

    return Response.json({ error: 'User not found' }, { status: 404 });
  }
};
```

---

## 🔐 SEGURANÇA

### Boas Práticas

1. **Prepared Statements** - Sempre usar `.bind()` para evitar SQL injection
2. **Validação** - Validar todos os inputs antes de queries
3. **Sanitização** - Remover dados sensíveis antes de retornar
4. **Logs** - Registrar todas as operações importantes
5. **Rate Limiting** - Implementar limites de requisições

### Exemplo Seguro

```javascript
// ❌ ERRADO - SQL Injection
const email = request.url.searchParams.get('email');
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ CORRETO - Prepared Statement
const email = request.url.searchParams.get('email');
const result = await DB.prepare('SELECT * FROM users WHERE email = ?')
  .bind(email)
  .first();
```

---

## 📈 MONITORAMENTO

### Ver Métricas no Dashboard

1. Acesse: https://dash.cloudflare.com
2. Workers & Pages > agroisync-backend
3. Metrics tab

### Logs em Tempo Real

```bash
wrangler tail --format pretty
```

### Alertas

Configure alertas no Cloudflare Dashboard:
- Erros 5xx
- Alta latência
- Uso de recursos

---

## 🐛 TROUBLESHOOTING

### Erro: "Database not found"

```bash
# Verificar se database existe
wrangler d1 list

# Verificar ID no wrangler.toml
grep database_id wrangler.toml
```

### Erro: "Authentication required"

```bash
# Fazer login novamente
wrangler login

# Verificar autenticação
wrangler whoami
```

### Erro: "Table already exists"

O schema tem `CREATE TABLE IF NOT EXISTS`, mas se precisar resetar:

```bash
# Dropar todas as tabelas
wrangler d1 execute agroisync-db --command="DROP TABLE IF EXISTS users"
# Repetir para todas as tabelas

# Executar schema novamente
wrangler d1 execute agroisync-db --file=schema.sql
```

### Performance Lenta

- D1 tem limites de 100k leituras/dia no plano free
- Considere adicionar índices:

```sql
CREATE INDEX idx_products_category ON products(category);
```

---

## 📚 RECURSOS

- **Documentação D1:** https://developers.cloudflare.com/d1/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **SQL Reference:** https://www.sqlite.org/lang.html
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/

---

## ✅ CHECKLIST FINAL

Antes de ir para produção:

- [ ] Database inicializado
- [ ] Schema aplicado
- [ ] Usuário admin criado
- [ ] Senha admin alterada
- [ ] Wrangler.toml configurado
- [ ] Deploy testado em dev
- [ ] Endpoints funcionando
- [ ] Logs configurados
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

**Status:** ✅ Database Configurado e Pronto!  
**Última Atualização:** 29/09/2025
