# GitHub Actions Secrets Configuration

Este documento lista todos os secrets necessários para os workflows CI/CD do AGROTM na AWS.

## ⚠️ IMPORTANTE: Como Usar Secrets Corretamente

### ❌ ERRADO - Não declare secrets no env global:
```yaml
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}  # Isso causará erros!
```

### ✅ CORRETO - Use secrets em steps individuais:
```yaml
jobs:
  deploy:
    steps:
      - name: Deploy to AWS
        run: aws deploy --region ${{ secrets.AWS_REGION }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 🔧 CONFIGURAÇÃO DOS SECRETS

### PASSO 1: Criar Secrets no GitHub
No seu repositório do GitHub, vá em:
**Settings > Secrets and variables > Actions > New repository secret**

### PASSO 2: Criar TODOS estes secrets (copie exatamente os nomes!)

#### **Essenciais (Obrigatórios):**
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

#### **Opcionais (Funcionalidades extras):**
```
SNYK_TOKEN
SLACK_WEBHOOK_URL
ANCHOR_PROVIDER_URL
ANCHOR_WALLET
INFURA_URL
PRIVATE_KEY
BACKEND_URL
PRODUCTION_URL
SMTP_SERVER
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
NOTIFICATION_EMAIL
```

## 📋 Lista Completa de Secrets

### AWS Deployment
- `AWS_ACCESS_KEY_ID` - Chave de acesso AWS para deploy
- `AWS_SECRET_ACCESS_KEY` - Chave secreta AWS para deploy
- `AWS_REGION` - Região AWS (ex: us-east-1)

### Security Scanning
- `SNYK_TOKEN` - Token do Snyk para análise de segurança (opcional)

### Notifications
- `SLACK_WEBHOOK_URL` - URL do webhook Slack para notificações (opcional)

### Web3 & Blockchain
- `ANCHOR_PROVIDER_URL` - URL do provider Anchor para Solana
- `ANCHOR_WALLET` - Caminho da wallet Anchor
- `INFURA_URL` - URL do Infura para Ethereum
- `PRIVATE_KEY` - Chave privada para deploy de contratos

### Environment URLs
- `BACKEND_URL` - URL da API backend na AWS
- `PRODUCTION_URL` - URL do frontend em produção na AWS

### Email Configuration
- `SMTP_SERVER` - Servidor SMTP para notificações por email
- `SMTP_PORT` - Porta SMTP
- `SMTP_USERNAME` - Usuário SMTP
- `SMTP_PASSWORD` - Senha SMTP
- `NOTIFICATION_EMAIL` - Email para notificações

## 🚀 Estrutura dos Workflows

### **Build-and-Deploy Job:** Checkout → Setup Node → Install → Build → Snyk → Deploy AWS → Notificar Slack

## 📊 Status dos Secrets

### ✅ **Configurados:**
- `AWS_ACCESS_KEY_ID` ✅
- `AWS_SECRET_ACCESS_KEY` ✅
- `AWS_REGION` ✅

### ⚠️ **Pendentes:**
- `SNYK_TOKEN` (opcional)
- `SLACK_WEBHOOK_URL` (opcional)

## 🔗 Links Úteis

- **AWS Console**: https://aws.amazon.com/console/
- **AWS IAM**: https://console.aws.amazon.com/iam/
- **GitHub Secrets**: https://github.com/lp24213/agrotm.sol/settings/secrets/actions

## 📝 Notas Importantes

1. **AWS Amplify** fará deploy automático do frontend
2. **AWS ECS/Lambda** será configurado separadamente para o backend
3. **GitHub Actions** apenas valida builds e prepara para deploy
4. **Secrets AWS** devem ter permissões mínimas necessárias
5. **Região AWS** deve ser a mesma onde está configurado o Amplify

## 🎯 Próximos Passos

1. ✅ Configurar secrets AWS no GitHub
2. ✅ Configurar AWS Amplify para frontend
3. ✅ Configurar AWS ECS/Lambda para backend
4. ✅ Testar deploy completo na AWS 