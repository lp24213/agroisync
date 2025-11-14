# ========================================
# 🚀 SCRIPT DE REBUILD DO APP MOBILE
# ========================================
# Este script automatiza o processo completo de rebuild
# após as correções do problema de carregamento remoto
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AGROISYNC - REBUILD APP MOBILE" -ForegroundColor Cyan
Write-Host "   Versão: 2.0.18 (Correção de URLs)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Verificar se está na pasta frontend
$currentPath = Get-Location
if (-not (Test-Path "capacitor.config.ts")) {
    Write-Host "❌ ERRO: Execute este script da pasta frontend!" -ForegroundColor Red
    Write-Host "   Caminho atual: $currentPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Pasta correta detectada!" -ForegroundColor Green
Write-Host ""

# Passo 2: Limpar builds anteriores
Write-Host "🧹 Passo 1: Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Build antigo removido" -ForegroundColor Green
}
if (Test-Path "android\app\build") {
    Remove-Item -Path "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Build Android antigo removido" -ForegroundColor Green
}
Write-Host ""

# Passo 3: Build de Produção
Write-Host "📦 Passo 2: Fazendo build de PRODUÇÃO..." -ForegroundColor Yellow
Write-Host "   (Isso pode demorar alguns minutos)" -ForegroundColor Gray

$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO no build de produção!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ Build concluído com sucesso!" -ForegroundColor Green
Write-Host ""

# Passo 4: Verificar se o build gerou arquivos
Write-Host "🔍 Passo 3: Verificando arquivos do build..." -ForegroundColor Yellow
if (-not (Test-Path "build\index.html")) {
    Write-Host "❌ ERRO: build/index.html não encontrado!" -ForegroundColor Red
    Write-Host "   O build pode ter falho silenciosamente." -ForegroundColor Yellow
    exit 1
}

$buildFiles = (Get-ChildItem -Path "build" -Recurse -File).Count
Write-Host "   ✓ Build gerou $buildFiles arquivos" -ForegroundColor Green
Write-Host ""

# Passo 5: Sincronizar com Capacitor
Write-Host "🔄 Passo 4: Sincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO ao sincronizar com Capacitor!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ Sincronização concluída!" -ForegroundColor Green
Write-Host ""

# Passo 6: Informações finais
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ REBUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Abrir Android Studio:" -ForegroundColor White
Write-Host "    npm run cap:open:android" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  No Android Studio:" -ForegroundColor White
Write-Host "    • Build → Clean Project" -ForegroundColor Gray
Write-Host "    • Build → Rebuild Project" -ForegroundColor Gray
Write-Host "    • Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Testar o APK:" -ForegroundColor White
Write-Host "    • Instalar no telefone" -ForegroundColor Gray
Write-Host "    • DESINSTALAR versão antiga ANTES!" -ForegroundColor Red
Write-Host "    • Testar SEM internet primeiro" -ForegroundColor Gray
Write-Host "    • Depois testar COM internet" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   • Versão atualizada para: 2.0.18" -ForegroundColor Yellow
Write-Host "   • App agora usa arquivos LOCAIS" -ForegroundColor Yellow
Write-Host "   • Funciona OFFLINE!" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📚 Para mais detalhes, veja:" -ForegroundColor White
Write-Host "   CORRECAO_APP_MOBILE.md" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer abrir o Android Studio
$response = Read-Host "Deseja abrir o Android Studio agora? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🚀 Abrindo Android Studio..." -ForegroundColor Cyan
    npm run cap:open:android
}

Write-Host ""
Write-Host "✨ Script finalizado!" -ForegroundColor Green
Write-Host ""

