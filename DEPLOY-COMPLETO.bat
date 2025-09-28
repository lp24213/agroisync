@echo off
echo ===========================================
echo    DEPLOY AGROSYNC - FRONTEND + BACKEND
echo ===========================================
echo.

echo 1. Deploying Backend (Cloudflare Workers)...
cd backend
npx wrangler deploy --config wrangler-api.toml
echo.

echo 2. Deploying Frontend (Cloudflare Pages)...
cd ..\frontend
npm install
npm run build
npx wrangler pages deploy dist --project-name agroisync
echo.

echo ===========================================
echo    DEPLOY COMPLETO!
echo ===========================================
pause

