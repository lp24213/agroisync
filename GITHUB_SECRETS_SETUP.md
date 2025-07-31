# Configuração de Secrets do GitHub para AGROTM

## Secrets Obrigatórios

### Vercel (Frontend)
- `VERCEL_TOKEN`: Token de API da Vercel
- `VERCEL_ORG_ID`: ID da organização da Vercel
- `VERCEL_PROJECT_ID`: ID do projeto da Vercel

### Railway (Backend)
- `RAILWAY_TOKEN`: Token de API da Railway

## Secrets Opcionais (Recomendados)

### Notificações e Monitoramento
- `DISCORD_WEBHOOK_URL`: Webhook do Discord para notificações de deploy/rollback
- `BACKEND_URL`: URL do backend para health checks (ex: https://agrotm-backend.railway.app)
- `HEALTH_LOG_WEBHOOK`: Webhook opcional para logs de saúde (pode ser o mesmo do Discord)

## Como Configurar

1. Vá para seu repositório no GitHub
2. Clique em Settings > Secrets and variables > Actions
3. Clique em "New repository secret"
4. Adicione cada secret com o nome e valor correspondente

## Como Obter os Tokens

### Vercel Token
1. Acesse https://vercel.com/account/tokens
2. Clique em "Create Token"
3. Dê um nome (ex: "AGROTM Deploy")
4. Copie o token gerado

### Vercel Org/Project ID
1. Vá para o projeto na Vercel
2. Clique em Settings > General
3. Copie o "Project ID"
4. Para Org ID, vá em Settings > General da organização

### Railway Token
1. Acesse https://railway.app/account/tokens
2. Clique em "New Token"
3. Dê um nome (ex: "AGROTM Backend")
4. Copie o token gerado

### Discord Webhook
1. Vá para o canal do Discord
2. Clique com botão direito > Edit Channel > Integrations > Webhooks
3. Clique em "New Webhook"
4. Copie a URL do webhook

## Testando a Configuração

Após configurar os secrets:

1. Faça um push para a branch main
2. Vá para Actions no GitHub
3. Verifique se o workflow CI/CD executa sem erros
4. Teste o rollback manual: Actions > Manual Rollback > Run workflow
5. Teste o monitoramento: Actions > Production Monitoring > Run workflow

## Segurança

- Nunca compartilhe os tokens
- Use tokens com permissões mínimas necessárias
- Revogue tokens antigos regularmente
- Monitore o uso dos tokens
