# 🚀 AGROISYNC - Script de Limpeza e Build (PowerShell)
# Este script limpa o projeto e faz o build para o Amplify

Write-Host "🧹 AGROISYNC - Limpeza e Build" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Navegar para o diretório frontend
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "🧹 Limpando arquivos de build..." -ForegroundColor Yellow

# Limpar arquivos de build
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Fazendo build..." -ForegroundColor Yellow
npm run build

# Verificar se o build foi bem-sucedido
if (Test-Path "out") {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    
    # Contar arquivos
    $fileCount = (Get-ChildItem -Path "out" -Recurse -File | Measure-Object).Count
    Write-Host "📁 Arquivos gerados em: out/" -ForegroundColor Blue
    Write-Host "📊 Total de arquivos: $fileCount" -ForegroundColor Blue
    Write-Host "🚀 Pronto para deploy no Amplify!" -ForegroundColor Green
} else {
    Write-Host "❌ Build falhou! Verifique os erros acima." -ForegroundColor Red
    exit 1
}
