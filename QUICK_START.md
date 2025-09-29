# ⚡ QUICK START - AGROISYNC

**Configuração rápida em 5 minutos!**

---

## 🚀 **INÍCIO RÁPIDO**

### **1. Setup Automático** (⏱️ ~3 min)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agroisync.git
cd agroisync

# Execute o script de setup
node setup.js

# Siga as instruções na tela
```

O script vai:
- ✅ Verificar estrutura do projeto
- ✅ Copiar arquivos .env.example
- ✅ Instalar dependências
- ✅ Validar configuração

---

### **2. Configurar Chaves** (⏱️ ~2 min)

#### **Frontend (.env):**
```bash
cd frontend
nano .env

# Mínimo necessário para rodar:
REACT_APP_API_URL=http://localhost:3001/api
```

#### **Backend (.env):**
```bash
cd backend
nano .env

# Mínimo necessário para rodar:
MONGODB_URI=mongodb://localhost:27017/agroisync
JWT_SECRET=uma-chave-secreta-qualquer-para-desenvolvimento
```

---

### **3. Iniciar** (⏱️ ~30 seg)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Pronto!** 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🔑 **CHAVES OPCIONAIS**

Para funcionalidades completas, adicione:

### **Frontend (.env):**
```bash
# Stripe (Pagamentos)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave

# OpenWeather (Clima)
REACT_APP_WEATHER_API_KEY=sua_chave

# Cloudflare (Captcha)
REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAB3pdjs4jRKvAtaA
```

### **Backend (.env):**
```bash
# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_sua_chave

# Cloudflare (Captcha)
CLOUDFLARE_TURNSTILE_SECRET_KEY=sua_chave_secreta

# Resend (Email)
RESEND_API_KEY=re_sua_chave
```

**Nota:** Sem essas chaves, o sistema usa **dados simulados** automaticamente!

---

## 📖 **DOCUMENTAÇÃO COMPLETA**

Para mais detalhes, leia:

1. **IMPROVEMENTS_GUIDE.md** - Como usar as melhorias
2. **DEPLOYMENT_GUIDE.md** - Como fazer deploy
3. **FINAL_SUMMARY.md** - Resumo de tudo que foi feito

---

## 💡 **DICAS RÁPIDAS**

### **Atalhos de Desenvolvimento:**
```
Ctrl + Shift + D → Mostrar info de desenvolvimento
Ctrl + Shift + L → Limpar console
Ctrl + Shift + E → Exportar estado
```

### **Testar APIs:**
```bash
# Health check
curl http://localhost:3001/health

# Auth test
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'
```

### **Ver Logs:**
```bash
# Frontend (no navegador)
F12 → Console

# Backend
# Os logs aparecem no terminal onde rodou npm run dev
```

---

## ⚠️ **TROUBLESHOOTING RÁPIDO**

### **"Cannot find module"**
```bash
cd frontend && npm install
cd backend && npm install
```

### **"CORS blocked"**
```bash
# Adicione no backend/.env:
CORS_ORIGIN=http://localhost:3000
```

### **"MongoDB connection failed"**
```bash
# Instalar MongoDB localmente ou usar MongoDB Atlas
# Atlas (cloud grátis): https://www.mongodb.com/cloud/atlas
```

### **"Port already in use"**
```bash
# Matar processo na porta
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Testar login/registro
2. ✅ Explorar páginas
3. ✅ Ler documentação completa
4. ✅ Configurar chaves reais
5. ✅ Fazer deploy (DEPLOYMENT_GUIDE.md)

---

## 📞 **PRECISA DE AJUDA?**

- 📖 Leia: **IMPROVEMENTS_GUIDE.md**
- 🔍 Veja: **EXECUTION_REPORT.md**
- 🚀 Deploy: **DEPLOYMENT_GUIDE.md**
- ✅ Checklist: **IMPROVEMENTS_CHECKLIST.md**

---

**Feito com ❤️ para o AgroSync**  
**Versão:** 2.4.0  
**Status:** ✅ Pronto para usar!
