# ⚡ GUIA RÁPIDO DE CORREÇÕES - AGROISYNC
## Comece Aqui: Correções em 1 Hora

---

## 🎯 OBJETIVO

Fazer o AgroSync funcionar localmente em **1 hora** com as configurações mínimas necessárias.

---

## ✅ PASSO 1: CRIAR ARQUIVOS .env (5 minutos)

### Frontend (.env)

```bash
# Navegue até a pasta frontend
cd frontend

# Crie o arquivo .env
# Windows PowerShell:
```

```powershell
Copy-Item env.example .env
```

```bash
# Ou crie manualmente e adicione:
```

```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_ENV=development

# Stripe (use keys de teste por enquanto)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Features (pode deixar desabilitado por enquanto)
REACT_APP_ENABLE_STRIPE=false
REACT_APP_ENABLE_METAMASK=false
REACT_APP_ENABLE_WEBSOCKET=false

# Debug
REACT_APP_DEBUG=true
```

### Backend (.env)

```bash
# Navegue até a pasta backend
cd ../backend

# Crie o arquivo .env
# Windows PowerShell:
```

```powershell
Copy-Item env.example .env
```

```bash
# Ou crie manualmente e adicione:
```

```env
# backend/.env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT (OBRIGATÓRIO - gere uma string aleatória segura)
JWT_SECRET=sua-chave-super-secreta-aqui-minimo-32-caracteres-aleatorios
JWT_EXPIRE=7d

# MongoDB (CONFIGURE DEPOIS - ver Passo 2)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/agroisync

# Stripe (OPCIONAL - pode deixar vazio por enquanto)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (OPCIONAL - pode deixar vazio por enquanto)
RESEND_API_KEY=

# CORS
CORS_ORIGIN=http://localhost:3000

# Debug
DEBUG=agrosync:*
```

**🔐 Gerar JWT_SECRET Seguro:**

```javascript
// Execute no Node.js:
require('crypto').randomBytes(64).toString('hex')
```

Ou online: https://randomkeygen.com/

---

## ✅ PASSO 2: CONFIGURAR MONGODB ATLAS (10 minutos)

### 2.1. Criar Conta (3 min)
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita (M0 - Free Tier)
3. Escolha provedor (AWS recomendado)
4. Região: São Paulo (ou mais próxima)

### 2.2. Criar Cluster (5 min)
1. Clique em "Build a Database"
2. Escolha "Free" (M0)
3. Nome do cluster: `agroisync-cluster`
4. Clique em "Create"

### 2.3. Configurar Acesso (2 min)
1. **Database Access:**
   - Username: `agroisync-admin`
   - Password: `gere-senha-forte-aqui`
   - Role: `Atlas Admin`

2. **Network Access:**
   - Add IP Address: `0.0.0.0/0` (permite qualquer IP)
   - Ou adicione seu IP específico

### 2.4. Obter Connection String
1. Clique em "Connect"
2. Escolha "Connect your application"
3. Driver: Node.js
4. Copie a connection string
5. Cole no `.env` do backend:

```env
MONGODB_URI=mongodb+srv://agroisync-admin:SUA-SENHA-AQUI@agroisync-cluster.xxxxx.mongodb.net/agroisync?retryWrites=true&w=majority
```

---

## ✅ PASSO 3: TESTAR CONEXÃO MONGODB (5 minutos)

Crie um arquivo de teste:

```javascript
// backend/test-mongodb.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI não configurado no .env');
    return;
  }

  console.log('🔄 Tentando conectar ao MongoDB...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB conectado com sucesso!');
    
    // Listar databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('📊 Databases disponíveis:');
    dbs.databases.forEach(db => console.log(`  - ${db.name}`));
    
    await client.close();
    console.log('✅ Conexão fechada');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

testConnection();
```

Execute:

```bash
cd backend
node test-mongodb.js
```

**Resultado Esperado:**
```
✅ MongoDB conectado com sucesso!
📊 Databases disponíveis:
  - admin
  - local
✅ Conexão fechada
```

---

## ✅ PASSO 4: INSTALAR DEPENDÊNCIAS (10 minutos)

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

**Se houver erros:**
- Limpe o cache: `npm cache clean --force`
- Delete `node_modules` e reinstale
- Use `npm install --legacy-peer-deps` se necessário

---

## ✅ PASSO 5: INICIAR APLICAÇÃO (2 minutos)

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

**Resultado Esperado:**
```
🚀 Backend rodando em http://localhost:5000
✅ MongoDB conectado
📝 Rotas disponíveis em /api-docs
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

**Resultado Esperado:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## ✅ PASSO 6: TESTAR APLICAÇÃO (5 minutos)

### 6.1. Testar API
Abra: http://localhost:5000/api/health

**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-29T..."
}
```

### 6.2. Testar Frontend
Abra: http://localhost:3000

**Esperado:**
- ✅ Página inicial carrega
- ✅ Menu funciona
- ✅ Sem erros no console

### 6.3. Testar Registro
1. Vá para: http://localhost:3000/register
2. Preencha formulário
3. **NOTA:** Email não será enviado (Resend não configurado)
4. Mas o usuário deve ser criado no MongoDB

---

## ✅ PASSO 7: VERIFICAR MONGODB (3 minutos)

1. Acesse MongoDB Atlas
2. Vá para "Collections"
3. Deve ver database: `agroisync`
4. Deve ver collections:
   - `users` (com usuário criado)

---

## 🎉 SUCESSO! APLICAÇÃO FUNCIONANDO

Se chegou até aqui, o AgroSync está funcionando localmente! 🚀

---

## 📋 PRÓXIMOS PASSOS (OPCIONAL)

### Configurar Email (Resend) - 10 minutos

1. Acesse: https://resend.com
2. Crie conta gratuita
3. Obtenha API Key
4. Adicione no `.env` do backend:

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM=AgroSync <noreply@agroisync.com>
```

5. Reinicie o backend
6. Teste registro novamente - email deve chegar

### Configurar Stripe (Pagamentos) - 15 minutos

1. Acesse: https://stripe.com
2. Crie conta
3. Ative "Test Mode"
4. Obtenha keys:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

5. Adicione nos `.env`:

**Frontend:**
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_ENABLE_STRIPE=true
```

**Backend:**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

6. Reinicie ambos
7. Teste compra de plano

### Configurar Cloudinary (Upload) - 10 minutos

1. Acesse: https://cloudinary.com
2. Crie conta gratuita
3. Obtenha credenciais no Dashboard
4. Adicione no `.env` do frontend:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=seu-cloud-name
REACT_APP_CLOUDINARY_API_KEY=sua-api-key
```

5. Backend:
```env
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Erro: "Cannot find module"
```bash
npm install
# ou
npm install --legacy-peer-deps
```

### Erro: "EADDRINUSE" (porta em uso)
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### Erro: "MongoDB connection failed"
- Verifique se `MONGODB_URI` está correta
- Confirme IP na whitelist do MongoDB Atlas
- Teste conexão com `test-mongodb.js`

### Frontend não conecta ao Backend
- Verifique se backend está rodando
- Confirme `REACT_APP_API_URL` no `.env` do frontend
- Verifique CORS no backend

### Página em branco
- Abra Console do navegador (F12)
- Veja erros no console
- Verifique Network tab

---

## 📞 CHECKLIST FINAL

Antes de considerar concluído, verifique:

- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3000
- [ ] MongoDB conectado (verificar com test-mongodb.js)
- [ ] Página inicial carrega sem erros
- [ ] Consegue criar usuário (registro)
- [ ] Consegue fazer login
- [ ] Dashboard carrega após login
- [ ] Sem erros críticos no console

---

## 🎯 TEMPO TOTAL: ~50 minutos

- Criar .env: 5 min
- MongoDB Atlas: 10 min
- Testar MongoDB: 5 min
- Instalar deps: 10 min
- Iniciar app: 2 min
- Testar: 5 min
- Verificar: 3 min
- **Extras:** 10 min

**Total Real:** Aproximadamente 1 hora considerando possíveis problemas.

---

## 📚 RECURSOS ÚTEIS

- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Resend:** https://resend.com/docs
- **Stripe:** https://stripe.com/docs/testing
- **Cloudinary:** https://cloudinary.com/documentation
- **Node.js:** https://nodejs.org/docs

---

## ✨ DICAS PROFISSIONAIS

1. **Use .env.local para testes locais**
   - Não comite arquivos `.env`
   - Use `.env.example` como template

2. **Mantenha senhas seguras**
   - Use geradores de senha
   - Nunca compartilhe credenciais

3. **Teste incrementalmente**
   - Não configure tudo de uma vez
   - Teste cada serviço individualmente

4. **Monitore logs**
   - Backend: terminal mostra logs
   - Frontend: console do navegador

5. **Use Git**
   - Faça commits frequentes
   - Branches para features

---

**Boa sorte com o AgroSync! 🚀🌾**
