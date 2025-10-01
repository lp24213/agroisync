@echo off
echo Deploying AgroSync to Cloudflare Pages...
cd frontend
npm install
npm run build
echo.
echo Deploying to Cloudflare Pages...
npx wrangler pages deploy build --project-name agroisync
echo.
echo Deploy completed!
pause
