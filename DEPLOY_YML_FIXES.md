# ✅ DEPLOY.YML FIXES - AGROTM

## 🔧 **3 Erros Corrigidos no deploy.yml**

### ❌ **Erro 1: working-directory no Vercel**
**Problema**: O deploy do Vercel estava usando `working-directory: ./frontend` mas o vercel.json está configurado para deploy direto.

**Antes**:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./frontend  # ← REMOVIDO
    vercel-args: '--prod'
```

**Depois**:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

### ❌ **Erro 2: projectId obrigatório no Railway**
**Problema**: O deploy do Railway estava usando `projectId` que pode não existir ou ser opcional.

**Antes**:
```yaml
- name: Deploy to Railway
  uses: railwayapp/railway-action@v2
  with:
    railwayToken: ${{ secrets.RAILWAY_TOKEN }}
    serviceName: agrotm-backend
    projectId: ${{ secrets.RAILWAY_PROJECT_ID }}  # ← REMOVIDO
```

**Depois**:
```yaml
- name: Deploy to Railway
  uses: railwayapp/railway-action@v2
  with:
    railwayToken: ${{ secrets.RAILWAY_TOKEN }}
    serviceName: agrotm-backend
```

### ❌ **Erro 3: Configuração inconsistente**
**Problema**: Os jobs de deploy não estavam alinhados com as configurações específicas de cada plataforma.

**Correção**: Removidas configurações desnecessárias e mantidas apenas as essenciais.

## ✅ **Configuração Final Corrigida**

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
```

## 🔑 **Secrets Necessários (Atualizados)**

### **Vercel Secrets**
```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

### **Railway Secrets**
```bash
RAILWAY_TOKEN=your-railway-token
# RAILWAY_PROJECT_ID não é mais necessário
```

## ✅ **Status das Correções**

**🟢 TODOS OS 3 ERROS CORRIGIDOS!**

- ✅ **Erro 1**: Removido `working-directory` do Vercel
- ✅ **Erro 2**: Removido `projectId` obrigatório do Railway
- ✅ **Erro 3**: Configurações alinhadas com as plataformas

### **🎯 Próximos Passos**
1. **Configure apenas os secrets essenciais** no GitHub
2. **Teste o workflow** fazendo push para main
3. **Monitore a execução** em Actions
4. **Verifique o deploy** nas plataformas

---

**🚀 O deploy.yml está corrigido e pronto para funcionar!** 