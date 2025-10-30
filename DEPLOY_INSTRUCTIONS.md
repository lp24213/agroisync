# 🚀 INSTRUÇÕES DE DEPLOY - AGROISYNC

## ⚠️ Problema de Autenticação Detectado

O token do Cloudflare está inválido ou expirado. Siga os passos abaixo para fazer o deploy:

## 📋 Passos para Deploy

### 1. Fazer Login no Wrangler

```powershell
# Fazer login no Wrangler
npx wrangler login

# Verificar se está autenticado
npx wrangler whoami
```

### 2. Deploy do Backend (Worker)

```powershell
cd backend
npx wrangler deploy src/cloudflare-worker.js

# OU se tiver problemas, use:
npx wrangler deploy
```

**Configuração:** O backend usa `wrangler.toml` que está configurado para:
- Nome: `backend`
- Rota: `agroisync.com/api/*`
- D1 Database: `agroisync-db`
- KV Namespaces configurados

### 3. Deploy do Frontend (Pages)

```powershell
cd frontend

# Fazer build (se ainda não fez)
npm run build

# Deploy para Cloudflare Pages
npx wrangler pages deploy build --project-name=agroisync
```

**Configuração:** O frontend será deployado como:
- Projeto: `agroisync`
- Rota: `agroisync.com/*` e `www.agroisync.com/*`

## 🔐 Configurar Secrets do Backend

Após o deploy do backend, configure os secrets:

```powershell
cd backend

# JWT Secret
npx wrangler secret put JWT_SECRET
# Quando solicitar, cole o secret

# JWT Refresh Secret
npx wrangler secret put JWT_REFRESH_SECRET

# Resend API Key (para emails)
npx wrangler secret put RESEND_API_KEY

# Cloudflare Turnstile Secret
npx wrangler secret put CF_TURNSTILE_SECRET_KEY

# Santander API Key (se usar)
npx wrangler secret put SANTANDER_API_KEY
npx wrangler secret put SANTANDER_CLIENT_ID
npx wrangler secret put SANTANDER_CLIENT_SECRET
```

## ✅ Verificação Pós-Deploy

### Testar Backend
```powershell
# Health check
curl https://agroisync.com/api/health

# Listar planos (deve mostrar o novo plano gratuito)
curl https://agroisync.com/api/plans
```

### Testar Frontend
1. Acesse: https://agroisync.com
2. Verifique:
   - ✅ Animação do foguete aparece sem bugs
   - ✅ VLibras está presente no canto inferior direito
   - ✅ Botão de acessibilidade funciona
   - ✅ Página de planos mostra plano gratuito (2 fretes + 2 produtos)

### Testar Autenticação
1. Acesse: https://agroisync.com/login
2. Login com: `luispaulo-de-oliveira@hotmail.com` / `Th@Ys1522`
3. Verificar dashboard
4. Verificar chat IA
5. Testar marketplace
6. Testar fretes

## 🔧 Troubleshooting

### Erro: "Unable to authenticate request"
```powershell
# Limpar tokens antigos
npx wrangler logout

# Fazer login novamente
npx wrangler login
```

### Erro: "Missing entry-point"
```powershell
# Especificar o arquivo diretamente
npx wrangler deploy src/cloudflare-worker.js --name backend
```

### Build do Frontend Falha
```powershell
cd frontend

# Limpar cache
rm -rf node_modules build

# Reinstalar dependências
npm install

# Build novamente
npm run build
```

## 📊 Monitoramento

Após o deploy, monitore:

1. **Cloudflare Dashboard:**
   - Workers: https://dash.cloudflare.com/workers
   - Pages: https://dash.cloudflare.com/pages
   - D1 Database: Verifique conexões

2. **Logs:**
   ```powershell
   # Ver logs do backend worker
   cd backend
   npx wrangler tail

   # Ver logs do frontend pages
   cd frontend
   npx wrangler pages deployment tail
   ```

3. **Métricas:**
   - Requests por minuto
   - Erros 5xx
   - Latência média
   - D1 queries

## 🎯 Checklist Final

- [ ] Login no Wrangler feito
- [ ] Backend deployado com sucesso
- [ ] Frontend deployado com sucesso
- [ ] Secrets configurados
- [ ] Health check funcionando
- [ ] Planos aparecendo corretamente
- [ ] Animação do foguete sem bugs
- [ ] VLibras funcionando
- [ ] Login testado
- [ ] Dashboard testado
- [ ] APIs testadas

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do Wrangler
2. Verifique o Cloudflare Dashboard
3. Consulte: https://developers.cloudflare.com/workers/

---

**Nota:** Todas as alterações de código já foram aplicadas. Só falta fazer o deploy! 🚀

