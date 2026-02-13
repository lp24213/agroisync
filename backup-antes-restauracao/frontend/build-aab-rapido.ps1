# ========================================
# 🚀 BUILD AAB RÁPIDO - SEM ENROLAÇÃO
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BUILD AAB RÁPIDO - AGROISYNC v2.0.19" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se já tem build
if (Test-Path "build\index.html") {
    Write-Host "✅ Build já existe! Pulando npm run build..." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️  Build não encontrado. Precisa buildar primeiro!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Execute: npm run build" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Sync com Capacitor
Write-Host "🔄 Sincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO ao sincronizar!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Sync concluído!" -ForegroundColor Green
Write-Host ""

# Abrir Android Studio
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PRONTO PRA GERAR O AAB!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 NO ANDROID STUDIO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Build → Clean Project" -ForegroundColor White
Write-Host "2. Build → Rebuild Project" -ForegroundColor White
Write-Host "3. Build → Generate Signed Bundle / APK" -ForegroundColor White
Write-Host "4. Escolher 'Android App Bundle'" -ForegroundColor White
Write-Host "5. Selecionar keystore e senha" -ForegroundColor White
Write-Host "6. Build variant: 'release'" -ForegroundColor White
Write-Host "7. Clicar 'Create'" -ForegroundColor White
Write-Host ""
Write-Host "📦 O AAB será gerado em:" -ForegroundColor Cyan
Write-Host "   android/app/release/app-release.aab" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Deseja abrir o Android Studio agora? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🚀 Abrindo Android Studio..." -ForegroundColor Cyan
    npx cap open android
}

Write-Host ""
Write-Host "✨ Script finalizado!" -ForegroundColor Green
Write-Host ""

