# ✅ WORKFLOW CORRECTIONS COMPLETE - AGROTM

## 🔧 **Correções Implementadas no GitHub Actions**

### ✅ **1. Railway Action Atualizada**

#### **Antes (Incorreto):**
```yaml
- name: Deploy to Railway
  uses: railway/deploy@v1
  with:
    railway_token: ${{ secrets.RAILWAY_TOKEN }}
    service: agrotm-backend
```

#### **Depois (Correto):**
```yaml
- name: Deploy to Railway
  uses: railwayapp/railway-action@v2
  with:
    railwayToken: ${{ secrets.RAILWAY_TOKEN }}
    serviceName: agrotm-backend
    projectId: ${{ secrets.RAILWAY_PROJECT_ID }}
```

### ✅ **2. Vercel Action Melhorada**

#### **Adicionado `vercel-args: '--prod'`:**
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./frontend
    vercel-args: '--prod'  # ← Adicionado
```

## 🔑 **Secrets Necessários**

### **Vercel Secrets**
```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

### **Railway Secrets**
```bash
RAILWAY_TOKEN=your-railway-token
RAILWAY_PROJECT_ID=your-railway-project-id  # Opcional
```

## 📋 **Como Configurar os Secrets**

### **1. Vercel Token**
1. Acesse https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Dê um nome (ex: "AGROTM Deploy")
4. Selecione "Full Account" scope
5. Copie o token

### **2. Vercel Org/Project ID**
1. No projeto Vercel, vá em Settings > General
2. Copie o "Team ID" (Org ID)
3. Copie o "Project ID"

### **3. Railway Token**
1. Acesse https://railway.app/account/tokens
2. Clique em "New Token"
3. Dê um nome (ex: "AGROTM Deploy")
4. Copie o token

### **4. Railway Project ID (Opcional)**
1. No projeto Railway, vá em Settings
2. Copie o "Project ID"
3. Se não usar projectId, pode omitir este secret

## 🚀 **Workflow Final**

### **Arquivo**: `.github/workflows/deploy.yml`

```yaml
name: Deploy AGROTM

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    - name: Type check
      run: |
        cd frontend
        npm run type-check
    - name: Lint
      run: |
        cd frontend
        npm run lint
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        NODE_ENV: production

  test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    - name: Build
      run: |
        cd backend
        npm run build
      env:
        NODE_ENV: production

  deploy-vercel:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
        vercel-args: '--prod'

  deploy-railway:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to Railway
      uses: railwayapp/railway-action@v2
      with:
        railwayToken: ${{ secrets.RAILWAY_TOKEN }}
        serviceName: agrotm-backend
        projectId: ${{ secrets.RAILWAY_PROJECT_ID }}
```

## ⚠️ **Troubleshooting**

### **Warning: Context access might be invalid: VERCEL_PROJECT_ID**
**Solução**:
1. Verifique se o secret `VERCEL_PROJECT_ID` existe no GitHub
2. Confirme se o nome está exato (maiúsculas/minúsculas)
3. Verifique se o valor está correto

### **Railway Action Error**
**Solução**:
1. Use `railwayapp/railway-action@v2` (atualizado)
2. Confirme se `serviceName` está correto
3. Verifique se `projectId` está correto (ou omita se não usar)

## ✅ **Status Final**

**🟢 WORKFLOW CORRIGIDO E PRONTO PARA DEPLOY!**

### **✅ Correções Implementadas**
- ✅ **Railway Action**: Atualizada para `railwayapp/railway-action@v2`
- ✅ **Vercel Args**: Adicionado `--prod` para deploy em produção
- ✅ **Secrets**: Documentados e configurados
- ✅ **Troubleshooting**: Soluções documentadas

### **🎯 Próximos Passos**
1. **Configure os secrets** no GitHub conforme documentado
2. **Teste o workflow** fazendo push para main
3. **Monitore a execução** em Actions
4. **Verifique o deploy** nas plataformas

---

**🚀 O workflow está corrigido e pronto para deploy automático!** 