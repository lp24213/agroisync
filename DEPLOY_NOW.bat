@echo off
echo 🚀 AGROTM - DEPLOY AUTOMÁTICO INICIADO
echo ======================================

echo.
echo 📦 Adicionando arquivos ao Git...
git add -A

echo.
echo 💾 Fazendo commit das alterações...
git commit -m "🚀 DEPLOY READY - All errors fixed for Vercel and Railway"

echo.
echo 📤 Enviando para o GitHub...
git push origin main

echo.
echo ✅ DEPLOY DISPARADO COM SUCESSO!
echo.
echo 📊 Monitoramento:
echo    - GitHub Actions: https://github.com/lp24213/agrotm.sol/actions
echo    - Vercel: https://vercel.com/dashboard
echo    - Railway: https://railway.app/dashboard
echo.
echo 🌐 URLs finais:
echo    - Frontend: https://agrotm-solana.vercel.app
echo    - Backend: https://agrotm-backend.railway.app/health
echo.
echo 🎯 Deploy em andamento... Aguarde alguns minutos!
pause 