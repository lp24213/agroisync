@echo off
echo Deploying AgroSync Backend...
cd backend
npx wrangler deploy --config wrangler-api.toml
echo.
echo Deploying AgroSync Frontend...
cd ..\frontend
npm run build
npx wrangler pages deploy dist --project-name agroisync-pages
echo.
echo Deploy completed!
pause
