# ===== SCRIPT DE INICIALIZAÇÃO DO AMBIENTE DE DESENVOLVIMENTO AGROTM (WINDOWS) =====

Write-Host "🚀 Iniciando ambiente de desenvolvimento AGROTM..." -ForegroundColor Green

# Verificar se o Docker está rodando
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker e tente novamente." -ForegroundColor Red
    exit 1
}

# Verificar se o Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não está instalado. Instale o Node.js 18+ e tente novamente." -ForegroundColor Red
    exit 1
}

# Verificar versão do Node.js
$nodeVersion = (node -v) -replace 'v', ''
$majorVersion = [int]($nodeVersion.Split('.')[0])
if ($majorVersion -lt 18) {
    Write-Host "❌ Node.js 18+ é necessário. Versão atual: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node -v) detectado" -ForegroundColor Green

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Remover volumes antigos (opcional)
$removeVolumes = Read-Host "🗑️  Remover volumes antigos? (y/N)"
if ($removeVolumes -eq 'y' -or $removeVolumes -eq 'Y') {
    Write-Host "🗑️  Removendo volumes..." -ForegroundColor Yellow
    docker-compose down -v
}

# Construir e iniciar containers
Write-Host "🏗️  Construindo containers..." -ForegroundColor Yellow
docker-compose build

Write-Host "🚀 Iniciando serviços..." -ForegroundColor Yellow
docker-compose up -d

# Aguardar serviços estarem prontos
Write-Host "⏳ Aguardando serviços estarem prontos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar status dos serviços
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Yellow

# MongoDB
try {
    docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" | Out-Null
    Write-Host "✅ MongoDB: Funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB: Erro" -ForegroundColor Red
}

# Redis
try {
    docker-compose exec -T redis redis-cli ping | Out-Null
    Write-Host "✅ Redis: Funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Redis: Erro" -ForegroundColor Red
}

# Backend
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing | Out-Null
    Write-Host "✅ Backend: Funcionando (http://localhost:5000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Erro" -ForegroundColor Red
}

# Frontend
try {
    Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Out-Null
    Write-Host "✅ Frontend: Funcionando (http://localhost:3000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Erro" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Ambiente de desenvolvimento iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "🗄️  MongoDB:  mongodb://localhost:27017" -ForegroundColor Cyan
Write-Host "🔴 Redis:     redis://localhost:6379" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Comandos úteis:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f backend    # Ver logs do backend" -ForegroundColor White
Write-Host "  docker-compose logs -f frontend   # Ver logs do frontend" -ForegroundColor White
Write-Host "  docker-compose down               # Parar todos os serviços" -ForegroundColor White
Write-Host "  docker-compose restart backend    # Reiniciar backend" -ForegroundColor White
Write-Host "  docker-compose restart frontend   # Reiniciar frontend" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Admin Login:" -ForegroundColor Yellow
Write-Host "  Email: luispaulodeoliveira@agrotm.com.br" -ForegroundColor White
Write-Host "  Senha: Th@ys15221008" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentação: README.md" -ForegroundColor Cyan
Write-Host "🔗 API Docs: backend/API-ROUTES-DOCUMENTATION.md" -ForegroundColor Cyan
