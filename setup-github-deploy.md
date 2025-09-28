# Configuração GitHub + Cloudflare

## Frontend (Cloudflare Pages)
1. Acesse: https://dash.cloudflare.com/pages
2. Clique em "Connect to Git"
3. Selecione seu repositório GitHub
4. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `frontend`

## Backend (Cloudflare Workers)
1. Acesse: https://dash.cloudflare.com/workers
2. Vá em "Settings" → "Integrations"
3. Conecte ao GitHub
4. Configure deploy automático

## Scripts de Deploy Criados:
- `deploy-wrangler.bat` - Deploy só do backend
- `deploy-frontend.bat` - Deploy só do frontend  
- `deploy-all.bat` - Deploy completo (backend + frontend)

Execute qualquer um deles para fazer o deploy!
