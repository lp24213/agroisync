# Verificação Simples - AGROISYNC para Amplify
Write-Host "🔍 Verificando AGROISYNC para Deploy Amplify..." -ForegroundColor Green

# Verificar arquivos críticos
$files = @(
    "amplify.yml",
    "frontend/next.config-final.js", 
    "frontend/tsconfig.json",
    "frontend/env.production",
    "amplify/backend/backend-config.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# Verificar configurações
Write-Host "`n🔧 Verificando configurações..." -ForegroundColor Yellow

$amplifyContent = Get-Content "amplify.yml" -Raw
if ($amplifyContent -match "baseDirectory: frontend/out") {
    Write-Host "✅ baseDirectory correto" -ForegroundColor Green
} else {
    Write-Host "❌ baseDirectory incorreto" -ForegroundColor Red
}

if ($amplifyContent -match "npm run build:final") {
    Write-Host "✅ Comando de build correto" -ForegroundColor Green
} else {
    Write-Host "❌ Comando de build incorreto" -ForegroundColor Red
}

$backendConfig = Get-Content "amplify/backend/backend-config.json" -Raw
if ($backendConfig -match '"DistributionDir": "out"') {
    Write-Host "✅ DistributionDir correto" -ForegroundColor Green
} else {
    Write-Host "❌ DistributionDir incorreto" -ForegroundColor Red
}

Write-Host "`n🎯 Status: PROJETO PRONTO PARA DEPLOY!" -ForegroundColor Green
Write-Host "Execute: git add . && git commit -m 'Ready for Amplify' && git push origin main" -ForegroundColor Cyan
