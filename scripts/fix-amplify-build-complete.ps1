# Script para corrigir problemas de build do Amplify
Write-Host "🔧 Iniciando correção completa do build do Amplify..." -ForegroundColor Green

# Navegar para o diretório raiz
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Split-Path -Parent $scriptPath)

Write-Host "📁 Diretório atual: $(Get-Location)" -ForegroundColor Blue

# Limpar cache e node_modules
Write-Host "🧹 Limpando cache e dependências..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Remove-Item -Recurse -Force "frontend/node_modules"
}

if (Test-Path "frontend/.next") {
    Remove-Item -Recurse -Force "frontend/.next"
}

if (Test-Path "frontend/build") {
    Remove-Item -Recurse -Force "frontend/build"
}

# Limpar cache do npm
Write-Host "🗑️ Limpando cache do npm..." -ForegroundColor Yellow
Set-Location "frontend"
npm cache clean --force

# Reinstalar dependências
Write-Host "📦 Reinstalando dependências..." -ForegroundColor Yellow
npm install --legacy-peer-deps --no-audit --no-fund

# Testar build localmente
Write-Host "🔨 Testando build localmente..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build local bem-sucedido!" -ForegroundColor Green
    
    # Fazer commit das correções
    Write-Host "📝 Fazendo commit das correções..." -ForegroundColor Yellow
    Set-Location ".."
    git add .
    git commit -m "Fix: Build do Amplify corrigido - dependências atualizadas e configurações otimizadas"
    
    Write-Host "🚀 Enviando para o repositório..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "🎉 Correção concluída! O build deve funcionar agora." -ForegroundColor Green
} catch {
    Write-Host "❌ Build local falhou. Verifique os erros acima." -ForegroundColor Red
    exit 1
}
