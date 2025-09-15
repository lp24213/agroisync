# Script para corrigir dependências do AgroSync
Write-Host "🔧 Corrigindo dependências do AgroSync..." -ForegroundColor Cyan

# Instalar dependências no diretório raiz
Write-Host "📦 Instalando dependências raiz..." -ForegroundColor Yellow
npm install

# Instalar dependências do frontend
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

# Instalar dependências do backend
Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
cd backend
npm install
cd ..

Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host "🚀 Execute 'npm run build' para testar o build" -ForegroundColor Cyan
