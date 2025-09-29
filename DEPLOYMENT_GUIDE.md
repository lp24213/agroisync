# 🚀 GUIA DE DEPLOYMENT - AGROISYNC

**Versão:** 2.4.0  
**Data:** 29/09/2025  
**Plataformas:** AWS Amplify (Frontend) | AWS Lambda (Backend)

---

## 📋 **ÍNDICE**

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Deploy do Backend](#deploy-do-backend)
4. [Deploy do Frontend](#deploy-do-frontend)
5. [Configuração de Domínio](#configuração-de-domínio)
6. [Monitoramento](#monitoramento)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 **PRÉ-REQUISITOS**

### **Contas Necessárias:**
- [x] AWS Account (Amplify + Lambda)
- [x] MongoDB Atlas Account
- [x] GitHub Account (para CI/CD)
- [x] Cloudflare Account (Turnstile)
- [x] Stripe Account (pagamentos)

### **Ferramentas Locais:**
```bash
# Node.js 18+
node --version  # v18.0.0 ou superior

# NPM 8+
npm --version   # 8.0.0 ou superior

# Git
git --version

# AWS CLI (opcional)
aws --version
```

### **Chaves e Credenciais:**
- [ ] MongoDB Atlas Connection String
- [ ] JWT Secret Keys
- [ ] Stripe Keys (test e production)
- [ ] Cloudflare Turnstile Keys
- [ ] OpenWeather API Key
- [ ] Outras APIs externas

---

## ⚙️ **CONFIGURAÇÃO INICIAL**

### **1. Clone do Repositório**
```bash
git clone https://github.com/seu-usuario/agroisync.git
cd agroisync
```

### **2. Setup Automático**
```bash
# Executar script de setup
node setup.js

# Ou manualmente:
# Frontend
cp frontend/env.example frontend/.env
cd frontend && npm install

# Backend
cp backend/env.example backend/.env
cd backend && npm install
```

### **3. Configurar Variáveis de Ambiente**

#### **Frontend (.env):**
```bash
# API
REACT_APP_API_URL=https://sua-api.execute-api.us-east-1.amazonaws.com/prod/api

# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_SUAS_CHAVES_AQUI

# Web3
REACT_APP_WEB3_PROVIDER=https://mainnet.infura.io/v3/SEU_PROJECT_ID

# Cloudflare
REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAB3pdjs4jRKvAtaA

# APIs Externas
REACT_APP_WEATHER_API_KEY=SUA_CHAVE_OPENWEATHER
REACT_APP_ALPHA_VANTAGE_API_KEY=SUA_CHAVE_ALPHA_VANTAGE
```

#### **Backend (.env):**
```bash
# Environment
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/agroisync?retryWrites=true

# JWT
JWT_SECRET=SUA_CHAVE_SUPER_SECRETA_64_CARACTERES
JWT_REFRESH_SECRET=OUTRA_CHAVE_SUPER_SECRETA_64_CARACTERES

# Stripe
STRIPE_SECRET_KEY=sk_live_SUAS_CHAVES_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SUA_CHAVE_WEBHOOK

# Cloudflare
CLOUDFLARE_TURNSTILE_SECRET_KEY=SUA_CHAVE_SECRETA

# Resend (Email)
RESEND_API_KEY=re_SUA_CHAVE_RESEND
RESEND_FROM=noreply@seudominio.com

# CORS
CORS_ORIGIN=https://seudominio.com,https://www.seudominio.com

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## 🔙 **DEPLOY DO BACKEND (AWS Lambda)**

### **Opção 1: Deploy via GitHub Actions (Recomendado)**

#### **1. Configurar Secrets no GitHub:**

Vá em: `Settings > Secrets and variables > Actions > New repository secret`

```
AWS_ACCESS_KEY_ID: sua_aws_access_key
AWS_SECRET_ACCESS_KEY: sua_aws_secret_key
AWS_REGION: us-east-1
```

#### **2. Criar `.github/workflows/deploy-backend.yml`:**

```yaml
name: Deploy Backend to AWS Lambda

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci --production
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_REGION }}
    
    - name: Deploy to Lambda
      run: |
        cd backend
        zip -r function.zip .
        aws lambda update-function-code \
          --function-name agroisync-backend \
          --zip-file fileb://function.zip
```

#### **3. Push para GitHub:**
```bash
git add .
git commit -m "Configure backend deployment"
git push origin main
```

---

### **Opção 2: Deploy Manual via AWS CLI**

```bash
# 1. Navegar para o backend
cd backend

# 2. Instalar dependências de produção
npm ci --production

# 3. Criar ZIP do Lambda
zip -r function.zip . -x "*.git*" "node_modules/.bin/*"

# 4. Upload para Lambda
aws lambda update-function-code \
  --function-name agroisync-backend \
  --zip-file fileb://function.zip

# 5. Atualizar variáveis de ambiente
aws lambda update-function-configuration \
  --function-name agroisync-backend \
  --environment Variables="{
    NODE_ENV=production,
    MONGODB_URI=mongodb+srv://...,
    JWT_SECRET=...,
    CORS_ORIGIN=https://seudominio.com
  }"
```

---

## 🎨 **DEPLOY DO FRONTEND (AWS Amplify)**

### **Opção 1: Deploy via AWS Amplify Console (Recomendado)**

#### **1. Conectar Repositório:**
1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Clique em "New app" > "Host web app"
3. Conecte seu repositório GitHub
4. Selecione o repositório `agroisync`
5. Selecione a branch `main`

#### **2. Configurar Build Settings:**

Crie `amplify.yml` na raiz do projeto:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

#### **3. Configurar Variáveis de Ambiente:**

No Amplify Console: `Environment variables`:

```
REACT_APP_API_URL=https://sua-api.execute-api.us-east-1.amazonaws.com/prod/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAB...
REACT_APP_WEATHER_API_KEY=...
```

#### **4. Deploy:**
```bash
git push origin main
```
O Amplify detecta automaticamente e faz o deploy!

---

### **Opção 2: Deploy Manual via AWS CLI**

```bash
# 1. Build do frontend
cd frontend
npm run build

# 2. Deploy para S3 + CloudFront (via Amplify CLI)
amplify publish
```

---

## 🌐 **CONFIGURAÇÃO DE DOMÍNIO**

### **1. Configurar DNS no Amplify:**

1. No Amplify Console, vá em: `Domain management`
2. Clique em "Add domain"
3. Digite: `agroisync.com`
4. Configure subdomínios:
   - `www.agroisync.com` → Main site
   - `agroisync.com` → Redirect to www

### **2. Configurar DNS no seu provedor:**

Adicione os registros CNAME fornecidos pelo Amplify:

```
Type    Name    Value
CNAME   www     xxxxxx.amplifyapp.com
CNAME   @       xxxxxx.amplifyapp.com
```

### **3. Aguardar Propagação:**
- DNS: 1-48 horas
- SSL: Automático via AWS Certificate Manager

---

## 📊 **MONITORAMENTO**

### **1. CloudWatch Logs:**

```bash
# Ver logs do Lambda
aws logs tail /aws/lambda/agroisync-backend --follow

# Ver logs do Amplify
# Acesse Amplify Console > Logs
```

### **2. Health Checks:**

#### **Backend:**
```bash
curl https://sua-api.execute-api.us-east-1.amazonaws.com/prod/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-09-29T...",
  "service": "AGROISYNC Backend",
  "version": "2.4.0"
}
```

#### **Frontend:**
```bash
curl https://agroisync.com
```

### **3. Configurar Alarmes:**

```bash
# Criar alarme para erros do Lambda
aws cloudwatch put-metric-alarm \
  --alarm-name agroisync-backend-errors \
  --alarm-description "Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

---

## 🔍 **TROUBLESHOOTING**

### **Problema: "CORS blocked"**

**Solução:**
```bash
# Verificar CORS_ORIGIN no backend
aws lambda get-function-configuration \
  --function-name agroisync-backend \
  | grep CORS_ORIGIN

# Atualizar se necessário
aws lambda update-function-configuration \
  --function-name agroisync-backend \
  --environment Variables="{CORS_ORIGIN=https://seudominio.com,https://www.seudominio.com}"
```

---

### **Problema: "MongoDB connection failed"**

**Solução:**
1. Verificar MONGODB_URI
2. Whitelist IP do Lambda:
   - MongoDB Atlas > Network Access
   - Add IP: `0.0.0.0/0` (ou IPs específicos do Lambda)

---

### **Problema: "Build failed on Amplify"**

**Solução:**
```bash
# Verificar logs no Amplify Console
# Verificar node_modules
cd frontend
rm -rf node_modules
npm install

# Testar build local
npm run build
```

---

### **Problema: "Environment variables not working"**

**Solução Frontend:**
- Variáveis devem começar com `REACT_APP_`
- Rebuild necessário após mudanças
- Verificar no Amplify Console: Environment variables

**Solução Backend:**
- Verificar no Lambda Console: Configuration > Environment variables
- Redeploy após mudanças

---

## ✅ **CHECKLIST DE DEPLOY**

### **Pré-Deploy:**
- [ ] Todos os testes passando
- [ ] Variáveis de ambiente configuradas
- [ ] Chaves de produção (não test)
- [ ] CORS configurado corretamente
- [ ] MongoDB whitelist atualizado
- [ ] Backup do banco de dados

### **Deploy:**
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Health checks OK
- [ ] DNS configurado
- [ ] SSL ativo

### **Pós-Deploy:**
- [ ] Testar login/registro
- [ ] Testar pagamentos
- [ ] Testar APIs externas
- [ ] Configurar monitoramento
- [ ] Documentar versão

---

## 📈 **ROLLBACK**

### **Backend (Lambda):**
```bash
# Listar versões
aws lambda list-versions-by-function \
  --function-name agroisync-backend

# Rollback para versão anterior
aws lambda update-alias \
  --function-name agroisync-backend \
  --name production \
  --function-version $PREVIOUS_VERSION
```

### **Frontend (Amplify):**
1. Amplify Console > App > History
2. Selecionar versão anterior
3. Clicar em "Redeploy this version"

---

## 🎯 **PRÓXIMOS PASSOS**

1. **Monitoramento Avançado:**
   - Integrar Sentry
   - Configurar New Relic
   - Alertas via SNS

2. **Performance:**
   - CDN para assets
   - Cache de API
   - Lazy loading

3. **Segurança:**
   - WAF (Web Application Firewall)
   - Rate limiting
   - DDoS protection

4. **Scaling:**
   - Auto-scaling do Lambda
   - Read replicas do MongoDB
   - Load balancer

---

## 📞 **SUPORTE**

**Documentação:**
- [IMPROVEMENTS_GUIDE.md](IMPROVEMENTS_GUIDE.md)
- [EXECUTION_REPORT.md](EXECUTION_REPORT.md)
- [IMPROVEMENTS_CHECKLIST.md](IMPROVEMENTS_CHECKLIST.md)

**Recursos AWS:**
- [AWS Amplify Docs](https://docs.amplify.aws)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda)
- [CloudWatch Docs](https://docs.aws.amazon.com/cloudwatch)

---

**Última atualização:** 29/09/2025  
**Versão do Guia:** 1.0  
**Status:** ✅ Pronto para produção
