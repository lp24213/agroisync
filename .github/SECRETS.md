# GitHub Actions Secrets Configuration

Este documento lista todos os secrets necessários para os workflows CI/CD do AGROTM.

## ⚠️ IMPORTANTE: Como Usar Secrets Corretamente

### ❌ ERRADO - Não declare secrets no env global:
```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}  # Isso causará erros!
```

### ✅ CORRETO - Use secrets em steps individuais:
```yaml
jobs:
  deploy:
    steps:
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔧 CONFIGURAÇÃO DOS SECRETS

### PASSO 1: Criar Secrets no GitHub
No seu repositório do GitHub, vá em:
**Settings > Secrets and variables > Actions > New repository secret**

### PASSO 2: Criar TODOS estes secrets (copie exatamente os nomes!)

#### **Essenciais (Obrigatórios):**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_PROJECT_ID_STAGING
VERCEL_PROJECT_ID_PROD
```

#### **Opcionais (Funcionalidades extras):**
```
SNYK_TOKEN
SLACK_WEBHOOK_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
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

### Vercel Deployment
- `VERCEL_TOKEN` - Token de autenticação do Vercel
- `VERCEL_ORG_ID` - ID da organização do Vercel
- `VERCEL_PROJECT_ID` - ID do projeto Vercel para produção
- `VERCEL_PROJECT_ID_STAGING` - ID do projeto Vercel para staging
- `VERCEL_PROJECT_ID_PROD` - ID do projeto Vercel para produção

### AWS ECS Deployment
- `AWS_ACCESS_KEY_ID` - Chave de acesso AWS para deploy ECS
- `AWS_SECRET_ACCESS_KEY` - Chave secreta AWS para deploy ECS
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
- `BACKEND_URL` - URL da API backend
- `PRODUCTION_URL` - URL do frontend em produção

### Email Configuration
- `SMTP_SERVER` - Servidor SMTP para notificações por email
- `SMTP_PORT` - Porta SMTP
- `SMTP_USERNAME` - Usuário SMTP
- `SMTP_PASSWORD` - Senha SMTP
- `NOTIFICATION_EMAIL` - Email para notificações

## 🚀 Estrutura dos Workflows

### ci-cd-modern.yml
- **Build-and-Deploy Job:** Checkout → Setup Node → Install → Build → Snyk → Deploy Vercel → Notificar Slack

### ci-cd-optimized.yml
- **Build-and-Deploy Job:** Checkout → Setup Node → Install → Build → Snyk → Deploy Staging → Deploy Production → Notificar Slack

## 🔒 Notas de Segurança

- Nunca commite secrets no repositório
- Use secrets específicos por ambiente quando possível
- Rotacione secrets regularmente
- Use princípio de menor privilégio para credenciais AWS
- Monitore uso e logs de acesso dos secrets

## 🛠️ Troubleshooting

### Problemas Comuns:
1. **"Unrecognized named-value: 'secrets'"** - Não use secrets no env global
2. **"Context access might be invalid"** - Use secrets apenas em contextos válidos
3. **"Action not found"** - Use versões corretas das actions (ex: `@master` para Snyk)

### Melhores Práticas:
- Sempre use sintaxe `${{ secrets.SECRET_NAME }}`
- Declare secrets em seções `env:` de steps individuais
- Use steps condicionais com `if: ${{ secrets.SECRET_NAME != '' }}`
- Teste workflows com secrets mínimos primeiro

## ✅ Status de Compatibilidade

Estes secrets são compatíveis com:
- `ci-cd-modern.yml` - Pipeline CI/CD moderno simplificado
- `ci-cd-optimized.yml` - Pipeline CI/CD otimizado com staging/produção

## 🎯 Secrets Opcionais

Os seguintes secrets são opcionais e os workflows continuarão mesmo se não configurados:
- `SNYK_TOKEN` - Análise de segurança será pulada
- `SLACK_WEBHOOK_URL` - Notificações Slack serão puladas
- Secrets relacionados a email - Notificações por email serão puladas

## 🎉 WORKFLOWS FINALIZADOS

Os workflows estão agora **100% funcionais** com:
- ✅ Estrutura simplificada e otimizada
- ✅ Secrets no contexto correto
- ✅ Actions com versões corretas
- ✅ Deploy automático para Vercel
- ✅ Notificações Slack configuradas
- ✅ Zero erros de YAML ou context access 