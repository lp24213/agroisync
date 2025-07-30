# 🔐 Configuração de Secrets do GitHub Actions

## 📋 Secrets Necessários

Para que o pipeline CI/CD funcione corretamente, você precisa configurar os seguintes secrets no GitHub:

### 🚀 Vercel (Frontend)
1. **VERCEL_TOKEN**
   - Vá para [Vercel Dashboard](https://vercel.com/account/tokens)
   - Clique em "Create Token"
   - Nome: `AGROTM-GitHub-Actions`
   - Expiration: `No expiration`
   - Copie o token gerado

2. **VERCEL_ORG_ID**
   - Vá para [Vercel Dashboard](https://vercel.com/account)
   - Clique em "Settings" → "General"
   - Copie o "Team ID" (Organization ID)

3. **VERCEL_PROJECT_ID**
   - Vá para o projeto no [Vercel Dashboard](https://vercel.com/dashboard)
   - Clique em "Settings" → "General"
   - Copie o "Project ID"

### 🚂 Railway (Backend)
4. **RAILWAY_TOKEN**
   - Vá para [Railway Dashboard](https://railway.app/account/tokens)
   - Clique em "New Token"
   - Nome: `AGROTM-GitHub-Actions`
   - Copie o token gerado

### 🔔 Discord (Notificações)
5. **DISCORD_WEBHOOK_URL**
   - Vá para o canal do Discord
   - Clique com botão direito → "Edit Channel"
   - Vá para "Integrations" → "Webhooks"
   - Clique em "New Webhook"
   - Nome: `AGROTM-Deployments`
   - Copie a URL do webhook

### 🔒 Segurança
6. **SNYK_TOKEN** (Opcional)
   - Vá para [Snyk Dashboard](https://app.snyk.io/account)
   - Clique em "Account Settings" → "Auth Token"
   - Copie o token

### 🌐 Domínios
7. **DOMAIN_NAMES** (Opcional)
   - `agrotm.com` (produção)
   - `staging.agrotm.com` (staging)
   - `api.agrotm.com` (API)

## ⚙️ Como Configurar

### Método 1: Interface Web do GitHub
1. Vá para o repositório no GitHub
2. Clique em "Settings" → "Secrets and variables" → "Actions"
3. Clique em "New repository secret"
4. Adicione cada secret com o nome e valor correspondente

### Método 2: GitHub CLI
```bash
# Instalar GitHub CLI
gh auth login

# Adicionar secrets
gh secret set VERCEL_TOKEN --body "seu_token_aqui"
gh secret set VERCEL_ORG_ID --body "seu_org_id_aqui"
gh secret set VERCEL_PROJECT_ID --body "seu_project_id_aqui"
gh secret set RAILWAY_TOKEN --body "seu_railway_token_aqui"
gh secret set DISCORD_WEBHOOK_URL --body "sua_webhook_url_aqui"
gh secret set SNYK_TOKEN --body "seu_snyk_token_aqui"
```

## 🧪 Testando a Configuração

### 1. Verificar Secrets
```bash
# Listar secrets (apenas nomes, não valores)
gh secret list
```

### 2. Testar Pipeline
1. Faça um push para a branch `develop`
2. Vá para "Actions" no GitHub
3. Verifique se o pipeline executa sem erros

### 3. Verificar Deploy
- Staging: `https://staging.agrotm.com`
- Produção: `https://agrotm.com`

## 🔧 Troubleshooting

### Erro: "Secret not found"
- Verifique se o nome do secret está correto
- Confirme se foi adicionado no repositório correto

### Erro: "Invalid token"
- Gere um novo token
- Verifique se o token não expirou
- Confirme as permissões do token

### Erro: "Environment not found"
- Crie o ambiente `production` no GitHub
- Ou remova a linha `environment: production` do workflow

## 📝 Checklist

- [ ] VERCEL_TOKEN configurado
- [ ] VERCEL_ORG_ID configurado
- [ ] VERCEL_PROJECT_ID configurado
- [ ] RAILWAY_TOKEN configurado
- [ ] DISCORD_WEBHOOK_URL configurado
- [ ] SNYK_TOKEN configurado (opcional)
- [ ] Ambiente `production` criado no GitHub
- [ ] Pipeline testado com sucesso
- [ ] Deploy funcionando

## 🚨 Segurança

- **Nunca** commite secrets no código
- Use sempre variáveis de ambiente
- Rotacione tokens regularmente
- Monitore logs de acesso
- Use tokens com permissões mínimas necessárias

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do GitHub Actions
2. Confirme se todos os secrets estão configurados
3. Teste cada serviço individualmente
4. Consulte a documentação oficial de cada serviço 