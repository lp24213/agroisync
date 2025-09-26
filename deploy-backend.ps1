# Script de Deploy do Backend AgroSync para Cloudflare Workers
# Este script faz deploy apenas do backend

Write-Host "🚀 Iniciando deploy do backend AgroSync..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "backend/wrangler.toml")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto agroisync" -ForegroundColor Red
    exit 1
}

# Instalar dependências do backend
Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install

# Verificar se o Wrangler está instalado
if (-not (Get-Command "wrangler" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Wrangler CLI..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Fazer login no Cloudflare (se necessário)
Write-Host "🔐 Verificando autenticação do Cloudflare..." -ForegroundColor Yellow
wrangler whoami

# Deploy do backend
Write-Host "🚀 Fazendo deploy do backend..." -ForegroundColor Yellow
wrangler deploy --env production

Write-Host "✅ Deploy do backend concluído com sucesso!" -ForegroundColor Green

# Voltar para o diretório raiz
Set-Location ..

Write-Host "🎯 Backend deployado com sucesso!" -ForegroundColor Green
Write-Host "📋 Informações do deploy:" -ForegroundColor Cyan
Write-Host "   🌐 URL da API: https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api" -ForegroundColor Magenta
Write-Host "   📊 Dashboard: https://dash.cloudflare.com/" -ForegroundColor Magenta
Write-Host "" -ForegroundColor White
Write-Host "💡 Para configurar secrets, use:" -ForegroundColor Yellow
Write-Host "   wrangler secret put MONGODB_URI" -ForegroundColor White
Write-Host "   wrangler secret put JWT_SECRET" -ForegroundColor White
Write-Host "   wrangler secret put STRIPE_SECRET_KEY" -ForegroundColor White
