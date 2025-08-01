@echo off
echo 🚀 AGROTM.SOL - Deploy Direto para Vercel
echo ==========================================

REM Navegar para o diretório frontend
cd frontend

REM Instalar dependências
echo 📦 Instalando dependências...
npm install

REM Build do projeto
echo 🔨 Fazendo build...
npm run build

REM Deploy para Vercel
echo 🚀 Fazendo deploy...
vercel --prod --yes

echo ✅ Deploy concluído!
pause 