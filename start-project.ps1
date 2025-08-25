# 🚀 AGROTM - Script de Inicialização para Windows
# Este script configura e inicia o projeto AGROTM no Windows

Write-Host "🚀 Iniciando AGROTM - Sistema de Inteligência Agrícola" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Verificar se Docker está instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado. Instalando..." -ForegroundColor Red
    Write-Host "📥 Baixe e instale o Docker Desktop de: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "🔄 Após a instalação, reinicie o PowerShell e execute este script novamente" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Docker já está instalado" -ForegroundColor Green
}

# Verificar se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não está instalado. Instalando..." -ForegroundColor Red
    Write-Host "📥 Baixe e instale o Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "🔄 Após a instalação, reinicie o PowerShell e execute este script novamente" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Node.js já está instalado (versão $(node --version))" -ForegroundColor Green
}

# Verificar se npm está instalado
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm não está instalado. Instalando..." -ForegroundColor Red
    Write-Host "📥 npm deve vir com o Node.js. Verifique a instalação" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ npm já está instalado (versão $(npm --version))" -ForegroundColor Green
}

# Iniciar MongoDB com Docker
Write-Host "🐳 Iniciando MongoDB..." -ForegroundColor Cyan
$mongodbContainer = docker ps -q -f name=mongodb
if ($mongodbContainer) {
    Write-Host "✅ MongoDB já está rodando" -ForegroundColor Green
} else {
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    Write-Host "✅ MongoDB iniciado com sucesso!" -ForegroundColor Green
}

# Aguardar MongoDB inicializar
Write-Host "⏳ Aguardando MongoDB inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se MongoDB está respondendo
try {
    docker exec mongodb mongosh --eval "db.runCommand('ping')" | Out-Null
    Write-Host "✅ MongoDB está respondendo" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB não está respondendo. Aguardando mais tempo..." -ForegroundColor Red
    Start-Sleep -Seconds 10
}

# Configurar frontend
Write-Host "⚛️  Configurando Frontend..." -ForegroundColor Cyan
Set-Location frontend

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependências do frontend já estão instaladas" -ForegroundColor Green
}

# Criar arquivo .env.local se não existir
if (!(Test-Path ".env.local")) {
    Write-Host "🔧 Criando arquivo .env.local..." -ForegroundColor Yellow
    @"
# AGROISYNC Frontend Environment Variables - Development
NEXT_PUBLIC_APP_NAME=AGROISYNC
NEXT_PUBLIC_APP_VERSION=2.3.1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Arquivo .env.local criado" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env.local já existe" -ForegroundColor Green
}

Set-Location ..

# Configurar backend
Write-Host "🔧 Configurando Backend..." -ForegroundColor Cyan
Set-Location backend

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependências do backend já estão instaladas" -ForegroundColor Green
}

# Criar arquivo .env se não existir
if (!(Test-Path ".env")) {
    Write-Host "🔧 Criando arquivo .env..." -ForegroundColor Yellow
    @"
# AGROISYNC Backend Environment Variables - Development
NODE_ENV=development
PORT=3001
JWT_SECRET=dev_jwt_secret_key_here_minimum_32_characters
MONGODB_URI=mongodb://localhost:27017/agroisync
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
DEBUG=true
LOG_LEVEL=debug
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

Set-Location ..

# Criar script de inicialização para Windows
Write-Host "📝 Criando script de inicialização para Windows..." -ForegroundColor Yellow
@"
# 🚀 AGROTM - Inicialização de Serviços para Windows
# Execute este script para iniciar todos os serviços

Write-Host "🚀 Iniciando serviços AGROTM..." -ForegroundColor Green

# Terminal 1 - Backend
Write-Host "🔧 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Aguardar backend inicializar
Start-Sleep -Seconds 5

# Terminal 2 - Frontend
Write-Host "⚛️  Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "✅ Serviços iniciados!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "📚 API Docs: http://localhost:3001/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Pressione qualquer tecla para fechar..." -ForegroundColor Cyan
Read-Host
"@ | Out-File -FilePath "start-services.ps1" -Encoding UTF8

Write-Host ""
Write-Host "🎉 Configuração concluída com sucesso!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure suas chaves do Stripe no arquivo backend/.env" -ForegroundColor White
Write-Host "2. Configure suas chaves de blockchain no arquivo backend/.env" -ForegroundColor White
Write-Host "3. Execute: .\start-services.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Credenciais de Admin:" -ForegroundColor Cyan
Write-Host "   Email: luispaulodeoliveira@agrotm.com.br" -ForegroundColor White
Write-Host "   Senha: Th@ys15221008" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentação completa: SETUP-INSTRUCTIONS.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 AGROTM está pronto para uso!" -ForegroundColor Green
