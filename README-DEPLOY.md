Deploy rápido (local)

1) Pré-requisitos
- Instale Node 18+ e npm.
- Instale npx (vem com npm) e wrangler (npm i -g wrangler ou use npx wrangler).

2) Executar deploy interativo (recomendado localmente)
Abra PowerShell no diretório do repositório e execute:

```powershell
scripts\deploy-with-secrets.ps1
```

O script pedirá os valores dos secrets (CF_TURNSTILE_SECRET_KEY, RESEND_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET, STRIPE_WEBHOOK_SECRET). Ele aplicará os secrets com `npx wrangler secret put` e fará deploy do Worker e do Pages.

3) Alternativa: usar GitHub Actions
- Adicione `CLOUDFLARE_API_TOKEN` nos GitHub Secrets.
- O workflow `.github/workflows/deploy.yml` fará build e deploy automaticamente em pushes para as branches `main`, `master` ou `fix/front-ssr-fallback-1`.

4) Segurança
- NÃO cole secrets em chats.
- NÃO comite segredos no repositório.

5) Pós-deploy
- Verifique o dashboard do Cloudflare Pages e Workers para logs e configurações.
- Configure o domínio `agroisync.com` no Pages e a rota `agroisync.com/api/*` no Worker (o `wrangler.toml` já configura esta rota se o domínio estiver na conta).
