# Script para gerar IPA do iOS pronto para upload - Agroisync
# Versão: 1.0.0
# Data: 2025-11-14

Write-Host "📦 Preparando IPA para upload na App Store" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Yellow

# Verificar se estamos no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto (frontend/)" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Passos para gerar o IPA:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣ Abra o projeto no Xcode:" -ForegroundColor White
Write-Host "   npx cap open ios" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣ No Xcode, configure:" -ForegroundColor White
Write-Host "   • Code Signing: Selecione seu Apple Developer Account" -ForegroundColor Gray
Write-Host "   • Bundle Identifier: com.agroisync.mobile" -ForegroundColor Gray
Write-Host "   • Provisioning Profile: App Store Distribution" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣ Gere o Archive:" -ForegroundColor White
Write-Host "   • Product → Archive" -ForegroundColor Gray
Write-Host "   • Aguarde o archive ser criado" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣ Exporte para App Store:" -ForegroundColor White
Write-Host "   • Selecione o archive criado" -ForegroundColor Gray
Write-Host "   • Clique em 'Distribute App'" -ForegroundColor Gray
Write-Host "   • Selecione 'App Store Connect'" -ForegroundColor Gray
Write-Host "   • Escolha 'Upload'" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣ O arquivo IPA será enviado automaticamente para o App Store Connect" -ForegroundColor White
Write-Host ""
Write-Host "📱 Arquivos necessários criados:" -ForegroundColor Cyan
Write-Host "   ✅ Configurações de rede (Info.plist)" -ForegroundColor White
Write-Host "   ✅ Splash screen com logo correta" -ForegroundColor White
Write-Host "   ✅ Permissões de câmera, localização, etc." -ForegroundColor White
Write-Host "   ✅ Navegação HTTPS configurada" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Após o upload, você poderá:" -ForegroundColor Cyan
Write-Host "   • TestFlight: Distribuir para testers" -ForegroundColor White
Write-Host "   • App Store: Submeter para revisão" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   • Tenha uma Apple Developer Account ativa" -ForegroundColor White
Write-Host "   • Configure certificados de distribuição" -ForegroundColor White
Write-Host "   • Crie um app no App Store Connect primeiro" -ForegroundColor White
Write-Host ""
Write-Host "📞 Suporte: Precisa de ajuda com algum passo?" -ForegroundColor Green
