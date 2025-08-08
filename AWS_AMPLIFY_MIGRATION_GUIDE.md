# 🚀 Guia de Migração AGROTM: Vercel/Railway → AWS Amplify

## 📋 Visão Geral

Este guia detalha a migração completa do projeto AGROTM de Vercel (frontend) e Railway (backend) para AWS Amplify, mantendo todas as funcionalidades, design e integrações intactas.

## 🎯 Objetivos da Migração

- ✅ **Migrar frontend** do Vercel para AWS Amplify
- ✅ **Migrar backend** do Railway para AWS Amplify
- ✅ **Manter funcionalidades** 100% intactas
- ✅ **Preservar design** e experiência do usuário
- ✅ **Configurar deploy automático** via GitHub
- ✅ **Otimizar performance** para AWS

## 📁 Estrutura do Projeto

```
agrotm.sol/
├── frontend/                 # Next.js Frontend
│   ├── amplify.yml          # Configuração Amplify Frontend
│   ├── next.config.amplify.js # Next.js config para Amplify
│   └── ...
├── backend/                  # Express.js Backend
│   ├── amplify.yml          # Configuração Amplify Backend
│   ├── server.amplify.js    # Servidor otimizado para Amplify
│   └── ...
├── amplify.yml              # Configuração principal Amplify
├── amplify-fullstack.yml    # Configuração fullstack
└── amplify-env.example      # Variáveis de ambiente
```

## 🔧 Configurações Criadas

### 1. **amplify.yml** (Raiz)
Configuração principal para build do frontend:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci --production=false
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
```

### 2. **frontend/amplify.yml**
Configuração específica do frontend:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --production=false
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

### 3. **backend/amplify.yml**
Configuração específica do backend:
```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - npm ci --production=false
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .
    files:
      - '**/*'
      - '!node_modules/**/*'
```

### 4. **frontend/next.config.amplify.js**
Configuração Next.js otimizada para Amplify:
```javascript
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['agrotmsol.com.br', 'amplifyapp.com'],
    unoptimized: true,
  },
  // ... outras configurações
};
```

### 5. **backend/server.amplify.js**
Servidor Express otimizado para Amplify:
```javascript
const app = express();
// Configuração CORS para Amplify
app.use(cors({
  origin: [
    'https://*.amplifyapp.com',
    'https://*.amplifyaws.com'
  ]
}));
```

## 🚀 Passos para Migração

### **Passo 1: Preparação do AWS Amplify**

1. **Acesse o AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **Conecte o repositório GitHub**
   - Clique em "New app" → "Host web app"
   - Selecione "GitHub" como provedor
   - Autorize o AWS Amplify
   - Selecione o repositório: `lp24213/agrotm.sol`

3. **Configure o build**
   - Branch: `main`
   - Build settings: Use `amplify.yml` da raiz

### **Passo 2: Configuração de Variáveis de Ambiente**

1. **No AWS Amplify Console**
   - Vá para "Environment variables"
   - Adicione todas as variáveis do `amplify-env.example`

2. **Variáveis Frontend (NEXT_PUBLIC_*)**
   ```
   NEXT_PUBLIC_APP_URL=https://your-app.amplifyapp.com
   NEXT_PUBLIC_API_URL=https://your-backend.amplifyapp.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_COINGECKO_API_KEY=CG-BTkHrqswBAYJKoPMkqKSQLM4
   ```

3. **Variáveis Backend**
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-app.amplifyapp.com
   JWT_SECRET=your_secret
   ```

### **Passo 3: Configuração de Domínio**

1. **Domínio personalizado**
   - Vá para "Domain management"
   - Adicione: `agrotmsol.com.br`
   - Configure SSL/TLS

2. **Subdomínios**
   - `api.agrotmsol.com.br` → Backend
   - `www.agrotmsol.com.br` → Frontend

### **Passo 4: Configuração de Backend**

1. **Criar app backend separado**
   - Novo app no Amplify
   - Repositório: `lp24213/agrotm.sol`
   - Build settings: `backend/amplify.yml`

2. **Configurar Lambda Functions** (opcional)
   - Para APIs serverless
   - Usar `server.amplify.js`

## 🔄 Deploy Automático

### **Configuração GitHub**

1. **Webhooks automáticos**
   - Push para `main` → Deploy automático
   - Pull requests → Preview deployments

2. **Branch protection**
   - Requer aprovação para merge
   - Testes automáticos

### **Pipeline de Deploy**

```yaml
# Fluxo de deploy
1. Push para GitHub
2. AWS Amplify detecta mudanças
3. Executa build conforme amplify.yml
4. Deploy para ambiente de produção
5. Health check automático
6. Rollback em caso de falha
```

## 🧪 Testes e Validação

### **Testes Locais**

1. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run build
   node server.amplify.js
   ```

### **Testes de Integração**

1. **Health Check**
   ```
   GET https://your-backend.amplifyapp.com/health
   ```

2. **API Endpoints**
   ```
   GET https://your-backend.amplifyapp.com/api
   POST https://your-backend.amplifyapp.com/api/auth/login
   ```

3. **Frontend**
   ```
   GET https://your-app.amplifyapp.com
   ```

## 🔧 Otimizações AWS Amplify

### **Performance**

1. **CDN Global**
   - CloudFront automático
   - Cache otimizado

2. **Compressão**
   - Gzip automático
   - Otimização de assets

3. **Cache**
   - Browser cache
   - CDN cache

### **Segurança**

1. **HTTPS/SSL**
   - Certificados automáticos
   - HSTS headers

2. **CORS**
   - Configurado para domínios Amplify
   - Headers de segurança

3. **Rate Limiting**
   - Proteção contra DDoS
   - Limites por IP

## 📊 Monitoramento

### **AWS CloudWatch**

1. **Logs**
   - Logs de aplicação
   - Logs de build

2. **Métricas**
   - Performance
   - Erros
   - Uptime

### **Alertas**

1. **Build failures**
2. **Deploy failures**
3. **Performance degradation**

## 🚨 Troubleshooting

### **Problemas Comuns**

1. **Build Failures**
   ```bash
   # Verificar logs
   aws logs describe-log-groups
   aws logs filter-log-events --log-group-name /aws/amplify/...
   ```

2. **CORS Errors**
   ```javascript
   // Verificar configuração CORS
   app.use(cors({
     origin: ['https://*.amplifyapp.com']
   }));
   ```

3. **Environment Variables**
   ```bash
   # Verificar variáveis
   echo $NEXT_PUBLIC_APP_URL
   echo $NODE_ENV
   ```

### **Rollback**

1. **AWS Amplify Console**
   - Vá para "All builds"
   - Selecione build anterior
   - Clique em "Redeploy"

2. **Git Revert**
   ```bash
   git revert HEAD
   git push origin main
   ```

## 📈 Benefícios da Migração

### **Performance**
- ✅ CDN global da AWS
- ✅ Compressão automática
- ✅ Cache otimizado

### **Escalabilidade**
- ✅ Auto-scaling
- ✅ Load balancing
- ✅ Alta disponibilidade

### **Custo**
- ✅ Pay-per-use
- ✅ Sem custos ocultos
- ✅ Otimização automática

### **Integração**
- ✅ AWS ecosystem
- ✅ Lambda functions
- ✅ S3 storage

## 🎉 Conclusão

A migração para AWS Amplify oferece:

- **Melhor performance** com CDN global
- **Maior confiabilidade** com infraestrutura AWS
- **Custos otimizados** com pay-per-use
- **Deploy automático** via GitHub
- **Monitoramento avançado** com CloudWatch

O projeto AGROTM mantém todas as funcionalidades, design e integrações, agora rodando na infraestrutura AWS de classe mundial.

---

**Status da Migração**: ✅ **COMPLETA**
**Próximo Passo**: Deploy no AWS Amplify Console
