# Script para build do iOS - Agroisync
# Versão: 1.0.0
# Data: 2025-11-14

Write-Host "🚀 Iniciando build do iOS - Agroisync" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Yellow

# Verificar se estamos no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto (frontend/)" -ForegroundColor Red
    exit 1
}

# Verificar se o Capacitor CLI está instalado
if (!(Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erro: npx não encontrado. Instale o Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Fazendo build do projeto..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do projeto" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Sincronizando arquivos para iOS..." -ForegroundColor Cyan
npx cap sync ios

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na sincronização do iOS" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build do iOS concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Para abrir no Xcode:" -ForegroundColor Cyan
Write-Host "   npx cap open ios" -ForegroundColor White
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Abra o projeto no Xcode" -ForegroundColor White
Write-Host "   2. Configure o signing (code signing)" -ForegroundColor White
Write-Host "   3. Selecione um dispositivo/simulador" -ForegroundColor White
Write-Host "   4. Execute o build (Cmd+R)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Configurações aplicadas:" -ForegroundColor Cyan
Write-Host "   ✅ Permissões de rede configuradas" -ForegroundColor White
Write-Host "   ✅ Splash screen com logo correta" -ForegroundColor White
Write-Host "   ✅ Navegação para agroisync.com" -ForegroundColor White
Write-Host "   ✅ Compatibilidade com HTTPS" -ForegroundColor White
