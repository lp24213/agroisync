# 🔑 GITHUB SECRETS SETUP - AGROTM

## 📋 **Secrets Necessários para GitHub Actions**

### ✅ **Vercel Secrets (OBRIGATÓRIOS)**

#### **VERCEL_TOKEN**
- **Descrição**: Token de autenticação do Vercel
- **Como obter**:
  1. Acesse https://vercel.com/account/tokens
  2. Clique em "Create Token"
  3. Dê um nome (ex: "AGROTM Deploy")
  4. Selecione "Full Account" scope
  5. Copie o token gerado

#### **VERCEL_ORG_ID**
- **Descrição**: ID da organização no Vercel
- **Como obter**:
  1. No projeto Vercel, vá em Settings > General
  2. Copie o "Team ID" (é o mesmo que Org ID)

### ✅ **Railway Secrets (OBRIGATÓRIOS)**

#### **RAILWAY_TOKEN**
- **Descrição**: Token de autenticação do Railway
- **Como obter**:
  1. Acesse https://railway.app/account/tokens
  2. Clique em "New Token"
  3. Dê um nome (ex: "AGROTM Deploy")
  4. Copie o token gerado

## 🔧 **Configuração no GitHub**

### **1. Acessar Secrets**
1. Vá para o repositório no GitHub
2. Clique em "Settings"
3. No menu lateral, clique em "Secrets and variables" > "Actions"

### **2. Adicionar Secrets**
Para cada secret listado acima:
1. Clique em "New repository secret"
2. **Name**: Digite o nome exato (ex: `VERCEL_TOKEN`)
3. **Value**: Cole o valor correspondente
4. Clique em "Add secret"

### **3. Secrets Finais**
```bash
# Vercel (OBRIGATÓRIOS)
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id

# Railway (OBRIGATÓRIOS)
RAILWAY_TOKEN=your-railway-token
```

## 📝 **Workflow Atualizado**

### **Vercel Deploy**
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    working-directory: ./frontend
    vercel-args: '--prod'
```

### **Railway Deploy**
```yaml
- name: Deploy to Railway
  uses: railwayapp/railway-action@v1
  with:
    railwayToken: ${{ secrets.RAILWAY_TOKEN }}
    serviceName: agrotm-backend
```

## ⚠️ **Troubleshooting**

### **Warning: Context access might be invalid: VERCEL_PROJECT_ID**
**Solução**: **RESOLVIDO** - Removido do workflow, não é necessário.

### **Railway Action Error**
**Causa**: Action antiga ou configuração incorreta

**Solução**:
1. Use `railwayapp/railway-action@v1` (versão correta)
2. Confirme se `serviceName` está correto
3. Apenas `railwayToken` é necessário

## ✅ **Checklist de Configuração**

- ✅ **VERCEL_TOKEN**: Criado e configurado
- ✅ **VERCEL_ORG_ID**: Criado e configurado
- ✅ **RAILWAY_TOKEN**: Criado e configurado
- ✅ **Workflow**: Atualizado com as configurações corretas
- ✅ **Teste**: Workflow executado com sucesso

## 🚀 **Teste do Workflow**

### **1. Push para Main**
```bash
git add .
git commit -m "feat: update GitHub Actions workflow"
git push origin main
```

### **2. Monitorar Execução**
1. Vá para https://github.com/lp24213/agrotm-solana/actions
2. Verifique se o workflow "Deploy AGROTM" executou
3. Confirme que todos os jobs passaram

### **3. Verificar Deploy**
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard

---

**🔑 Configure apenas os 3 secrets obrigatórios antes de fazer push para main!**
