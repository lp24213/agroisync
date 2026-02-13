# Script para fazer build COMPLETO do Android
# Garante que TODOS os assets sejam incluídos

Write-Host "🚀 INICIANDO BUILD COMPLETO DO ANDROID..." -ForegroundColor Green
Write-Host ""

# 1. Limpar builds anteriores
Write-Host "📦 Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "✅ Build do frontend limpo" -ForegroundColor Green
}
if (Test-Path "android\app\build") {
    Remove-Item -Recurse -Force "android\app\build"
    Write-Host "✅ Build do Android limpo" -ForegroundColor Green
}

# 2. Fazer build do frontend
Write-Host ""
Write-Host "🔨 Fazendo build do frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Build do frontend falhou!" -ForegroundColor Red
    exit 1
}

# Verificar tamanho do build
$buildSize = (Get-ChildItem "build" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "✅ Build do frontend concluído: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Green

# 3. Sincronizar com Capacitor
Write-Host ""
Write-Host "🔄 Sincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Sincronização do Capacitor falhou!" -ForegroundColor Red
    exit 1
}

# Verificar tamanho dos assets
$assetsSize = (Get-ChildItem "android\app\src\main\assets" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "✅ Assets sincronizados: $([math]::Round($assetsSize, 2)) MB" -ForegroundColor Green

if ($assetsSize -lt 30) {
    Write-Host "⚠️ AVISO: Assets muito pequenos ($([math]::Round($assetsSize, 2)) MB). Deveria ter pelo menos 35 MB!" -ForegroundColor Yellow
}

# 4. Fazer build do Android
Write-Host ""
Write-Host "🔨 Fazendo build do Android (Release)..." -ForegroundColor Yellow
Set-Location android
.\gradlew clean
.\gradlew assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Build do Android falhou!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# 5. Verificar APK gerado
Write-Host ""
Write-Host "📱 Verificando APK gerado..." -ForegroundColor Yellow
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "✅ APK gerado com sucesso!" -ForegroundColor Green
    Write-Host "   📍 Localização: $apkPath" -ForegroundColor Cyan
    Write-Host "   📦 Tamanho: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    
    if ($apkSize -lt 40) {
        Write-Host "⚠️ AVISO: APK muito pequeno ($([math]::Round($apkSize, 2)) MB). Deveria ter pelo menos 40-50 MB!" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Tamanho do APK está OK!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ ERRO: APK não foi gerado!" -ForegroundColor Red
    exit 1
}

# 6. Verificar AAB (se existir)
$aabPath = "android\app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $aabPath) {
    $aabSize = (Get-Item $aabPath).Length / 1MB
    Write-Host ""
    Write-Host "✅ AAB gerado com sucesso!" -ForegroundColor Green
    Write-Host "   📍 Localização: $aabPath" -ForegroundColor Cyan
    Write-Host "   📦 Tamanho: $([math]::Round($aabSize, 2)) MB" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 BUILD COMPLETO FINALIZADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 RESUMO:" -ForegroundColor Cyan
Write-Host "   • Build do frontend: $([math]::Round($buildSize, 2)) MB" -ForegroundColor White
Write-Host "   • Assets sincronizados: $([math]::Round($assetsSize, 2)) MB" -ForegroundColor White
Write-Host "   • APK gerado: $([math]::Round($apkSize, 2)) MB" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Instalar o APK no dispositivo: adb install $apkPath" -ForegroundColor White
Write-Host "   2. Testar o app" -ForegroundColor White
Write-Host "   3. Verificar se todas as funcionalidades estão funcionando" -ForegroundColor White
Write-Host ""

