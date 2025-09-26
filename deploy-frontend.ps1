# Script de Deploy do Frontend AgroSync para Cloudflare Pages
# Este script faz deploy apenas do frontend

Write-Host "🚀 Iniciando deploy do frontend AgroSync..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto agroisync" -ForegroundColor Red
    exit 1
}

# Instalar dependências do frontend
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install

# Build do frontend
Write-Host "🔨 Fazendo build do frontend..." -ForegroundColor Yellow
npm run build

# Verificar se o build foi bem-sucedido
if (-not (Test-Path "build/index.html")) {
    Write-Host "❌ Erro: Build falhou - arquivo index.html não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build do frontend concluído com sucesso!" -ForegroundColor Green
Write-Host "📁 Arquivos de build em: frontend/build/" -ForegroundColor Cyan

# Voltar para o diretório raiz
Set-Location ..

Write-Host "🎯 Frontend pronto para deploy no Cloudflare Pages!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Faça commit das alterações" -ForegroundColor White
Write-Host "   2. Push para o repositório GitHub" -ForegroundColor White
Write-Host "   3. O Cloudflare Pages fará deploy automaticamente" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🌐 URL do frontend: https://agroisync.pages.dev/" -ForegroundColor Magenta
Write-Host "🔗 URL da API: https://agroisync-backend-prod.luispaulooliveira767.workers.dev/api" -ForegroundColor Magenta
