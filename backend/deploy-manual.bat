@echo off
echo 🚀 AGROTM.SOL - Deploy Manual
echo ==============================

REM Verificar se estamos no diretório correto
if not exist "frontend\package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    pause
    exit /b 1
)

echo 📦 Instalando dependências do frontend...
cd frontend
npm install

echo 🔨 Fazendo build do frontend...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build realizado com sucesso!
    echo 🚀 Deploy manual concluído!
    echo 🌐 Acesse: https://agrotm-solana.vercel.app
    echo 🌐 Status: https://agrotm-solana.vercel.app/status
    echo 🧪 Teste: https://agrotm-solana.vercel.app/test
) else (
    echo ❌ Erro no build
    pause
    exit /b 1
)

pause 