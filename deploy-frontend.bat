@echo off
cd frontend
npm run build
npx wrangler pages deploy build --project-name agroisync
pause
