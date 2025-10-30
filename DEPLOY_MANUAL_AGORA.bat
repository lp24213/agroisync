@echo off
echo ========================================
echo  DEPLOY MANUAL AGROISYNC
echo ========================================
echo.

echo 1. LIMPANDO TOKENS ANTIGOS...
set CF_API_TOKEN=
set CLOUDFLARE_API_TOKEN=

echo 2. FAZENDO LOGOUT...
call npx wrangler logout

echo 3. FAZENDO LOGIN (vai abrir o navegador)...
call npx wrangler login

echo.
echo ========================================
echo  Pressione qualquer tecla apos autorizar no navegador
echo ========================================
pause

echo.
echo 4. FAZENDO DEPLOY DO BACKEND...
cd backend
call npx wrangler deploy --config wrangler.toml

echo.
echo 5. FAZENDO DEPLOY DO FRONTEND...
cd ..\frontend
call npx wrangler pages deploy build --project-name=agroisync

echo.
echo ========================================
echo  DEPLOY CONCLUIDO!
echo ========================================
pause

