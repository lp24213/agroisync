# Configuração do Resend para AgroSync

## Passos para Configurar o Resend

### 1. Criar Conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. Verifique seu email

### 2. Obter API Key

1. No painel do Resend, vá em **API Keys**
2. Clique em **Create API Key**
3. Dê um nome (ex: "AgroSync Production")
4. Copie a chave (começa com `re_`)

### 3. Configurar Domínio (Opcional mas Recomendado)

1. No painel do Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Adicione `agroisync.com`
4. Configure os registros DNS conforme instruções

### 4. Configurar Variáveis de Ambiente

#### Para Desenvolvimento Local:

```bash
# No arquivo .env
RESEND_API_KEY=re_sua_chave_aqui
RESEND_FROM=AgroSync <contato@agroisync.com>
```

#### Para Cloudflare Workers:

```bash
# Usar wrangler para configurar secrets
wrangler secret put RESEND_API_KEY
wrangler secret put RESEND_FROM
```

### 5. Testar Configuração

```bash
# No diretório backend/
node test-resend.js
```

## Verificação de Status

### Health Check

```bash
curl https://agroisync.com/api/health
```

A resposta deve incluir:

```json
{
  "status": "ok",
  "resendConfigured": true
}
```

### Teste de Envio

```bash
curl -X POST https://agroisync.com/api/email/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "contato@agroisync.com"}'
```

## Troubleshooting

### Erro: "Invalid API key"

- Verifique se a chave está correta
- Confirme se a chave está ativa no painel do Resend

### Erro: "Domain not verified"

- Configure o domínio no painel do Resend
- Use um domínio de teste temporariamente

### Erro: "Rate limit exceeded"

- Aguarde alguns minutos
- Verifique o plano do Resend

## Limites do Resend

### Plano Gratuito:

- 3.000 emails/mês
- 100 emails/dia
- Domínios verificados: 1

### Plano Pro ($20/mês):

- 50.000 emails/mês
- 1.000 emails/dia
- Domínios verificados: 5

## Monitoramento

### Logs do Resend:

- Acesse o painel do Resend
- Vá em **Logs** para ver o status dos envios
- Configure webhooks para notificações

### Logs da Aplicação:

```bash
# Verificar logs do Cloudflare Workers
wrangler tail agroisync-backend
```

## Segurança

### Boas Práticas:

1. Nunca commite a API key no código
2. Use diferentes chaves para dev/staging/prod
3. Revogue chaves expostas imediatamente
4. Monitore o uso da API

### Rotação de Chaves:

1. Gere nova chave no painel do Resend
2. Atualize as variáveis de ambiente
3. Teste a nova configuração
4. Revogue a chave antiga

## Suporte

### Resend:

- Documentação: [resend.com/docs](https://resend.com/docs)
- Suporte: [resend.com/support](https://resend.com/support)

### AgroSync:

- Email: contato@agroisync.com
- Issues: GitHub Issues
