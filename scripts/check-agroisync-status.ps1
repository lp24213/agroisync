# 🔍 AGROISYNC - Verificação de Status (PowerShell)
Write-Host "🔍 AGROISYNC - Verificação de Status" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verificar estrutura do projeto
Write-Host "📁 Verificando estrutura do projeto..." -ForegroundColor Yellow

if (Test-Path "frontend") {
    Write-Host "   ✅ Diretório frontend encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Diretório frontend não encontrado" -ForegroundColor Red
}

if (Test-Path "amplify") {
    Write-Host "   ✅ Diretório amplify encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Diretório amplify não encontrado" -ForegroundColor Red
}

if (Test-Path "backend") {
    Write-Host "   ✅ Diretório backend encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Diretório backend não encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar arquivos de configuração
Write-Host "⚙️  Verificando arquivos de configuração..." -ForegroundColor Yellow

if (Test-Path "amplify.yml") {
    Write-Host "   ✅ amplify.yml encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ amplify.yml não encontrado" -ForegroundColor Red
}

if (Test-Path "frontend/next.config.js") {
    Write-Host "   ✅ next.config.js encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ next.config.js não encontrado" -ForegroundColor Red
}

if (Test-Path "frontend/env.production") {
    Write-Host "   ✅ env.production encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ env.production não encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar build
Write-Host "🔨 Verificando build..." -ForegroundColor Yellow

if (Test-Path "frontend/.next") {
    Write-Host "   ✅ Build encontrado em .next/" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Build não encontrado" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "✅ Verificação de status concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Blue
Write-Host "   1. Executar deploy: .\scripts\deploy-agroisync-complete.ps1" -ForegroundColor Yellow
Write-Host ""
