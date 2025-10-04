# ENV CHECKLIST — Agroisync

Este arquivo lista as variáveis de ambiente essenciais para rodar localmente o frontend e backend.
Preencha `.env` em cada diretório conforme necessário (não commite `.env`).

## Frontend (frontend/.env)
- REACT_APP_API_URL - URL da API backend (ex: http://localhost:3001/api)
- REACT_APP_WS_URL - WebSocket URL (ex: ws://localhost:3001)
- REACT_APP_SUPABASE_URL - (se usar Supabase)
- REACT_APP_SUPABASE_ANON_KEY - (se usar Supabase)
- REACT_APP_STRIPE_PUBLISHABLE_KEY - Chave pública Stripe (pk_...)
- REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY - Turnstile site key pública
- REACT_APP_NEWS_API_KEY - (opcional) para serviços de notícias
- REACT_APP_ALPHA_VANTAGE_API_KEY - (opcional) para dados financeiros
- REACT_APP_API_TIMEOUT - (opcional) timeout em ms

> Nota: o frontend usa `process.env.REACT_APP_*` (CRA). Não use nomes `NEXT_PUBLIC_*` aqui a menos que esteja usando Next.js.

## Backend (backend/.env)
- NODE_ENV - development|production
- PORT - porta do servidor (ex: 3001)
- JWT_SECRET - segredo JWT (min 32 chars)
- JWT_EXPIRES_IN - tempo de expiração (ex: 7d)
- JWT_REFRESH_SECRET - segredo para refresh tokens
- JWT_REFRESH_EXPIRES_IN - tempo expiração do refresh token (ex: 30d)
- RESEND_API_KEY - chave da API Resend para envio de emails
- RESEND_FROM - endereço "From" padrão
- CLOUDFLARE_TURNSTILE_SECRET_KEY - secret do Turnstile (usado no backend para validar)
- STRIPE_SECRET_KEY - chave secreta Stripe (sk_...)
- STRIPE_WEBHOOK_SECRET - secret do webhook do Stripe
- CLOUDFLARE_D1_DATABASE_ID - (se usar D1)
- CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET - para uploads
- OPENWEATHER_API_KEY - (opcional) serviços meteorológicos
- LOG_LEVEL - info|debug|error
- CORS_ORIGIN - origem permitida para CORS (ex: http://localhost:3000)

## Notas de padronização
- JWT expirations: padronize nomes entre root/envs e backend (`JWT_EXPIRES_IN` e `JWT_REFRESH_EXPIRES_IN` são recomendados).
- Turnstile: frontend recebe a `REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY` (pública). O backend valida com `CLOUDFLARE_TURNSTILE_SECRET_KEY`.

## Como usar localmente (exemplo PowerShell)
```powershell
# frontend
cd .\frontend
copy ..\env.example .env
# editar .env e colocar REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY e REACT_APP_API_URL
npm install
npm start

# backend
cd ..\backend
copy ..\env.example .env
# editar .env e colocar JWT_SECRET, RESEND_API_KEY, STRIPE_SECRET_KEY, CLOUDFLARE_TURNSTILE_SECRET_KEY
npm install
npm run dev
```

Se quiser, eu posso gerar automaticamente `.env` com placeholders em cada pasta (somente local) ou rodar lints/tests/build para expor erros concretos.
