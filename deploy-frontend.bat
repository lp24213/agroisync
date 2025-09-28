@echo off
cd frontend
npm run build
npx wrangler pages deploy dist --project-name agroisync-pages
pause
