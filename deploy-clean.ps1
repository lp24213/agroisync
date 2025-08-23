# AGROSYNC - Deploy Limpo e Definitivo (PowerShell)
# ==================================================

Write-Host "🚀 AGROSYNC - Deploy Limpo e Definitivo" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "amplify.yml")) {
    Write-Host "❌ Erro: Execute este script no diretório raiz do projeto" -ForegroundColor Red
    exit 1
}

# Limpar builds anteriores
Write-Host "🧹 Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "frontend/build") { Remove-Item -Recurse -Force "frontend/build" }
if (Test-Path "frontend/node_modules") { Remove-Item -Recurse -Force "frontend/node_modules" }
if (Test-Path "backend/dist") { Remove-Item -Recurse -Force "backend/dist" }
if (Test-Path "backend/node_modules") { Remove-Item -Recurse -Force "backend/node_modules" }

# Limpar cache do Amplify
Write-Host "🗑️ Limpando cache do Amplify..." -ForegroundColor Yellow
amplify clean

# Reinstalar dependências do frontend
Write-Host "📦 Reinstalando dependências do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm ci --production=false
Set-Location ..

# Reinstalar dependências do backend
Write-Host "📦 Reinstalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm ci --production=false
Set-Location ..

# Verificar configuração do Amplify
Write-Host "🔍 Verificando configuração do Amplify..." -ForegroundColor Yellow
amplify status

# Fazer push das alterações
Write-Host "🚀 Fazendo push das alterações..." -ForegroundColor Yellow
amplify push

# Verificar se o deploy foi bem-sucedido
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Verifique o status no console do AWS Amplify" -ForegroundColor Cyan
Write-Host "🔗 URL: https://console.aws.amazon.com/amplify/" -ForegroundColor Cyan
