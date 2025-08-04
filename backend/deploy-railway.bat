@echo off
echo 🚀 Deploying AGROTM Backend to Railway...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
)

REM Login to Railway
echo 🔐 Logging in to Railway...
railway login

REM Link to project
echo 🔗 Linking to Railway project...
railway link

REM Deploy
echo 📦 Deploying to Railway...
railway up

echo ✅ Deployment completed!
echo 🌐 Your backend is now live at: https://agrotm-backend.railway.app
pause 