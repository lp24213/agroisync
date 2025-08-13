# Script para abrir diretamente a página de variáveis de ambiente

Write-Host "ABRINDO DIRETAMENTE AS VARIÁVEIS DE AMBIENTE!" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Tentando diferentes URLs para encontrar as variáveis de ambiente..." -ForegroundColor Cyan

# Tentar diferentes URLs possíveis
$urls = @(
    "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main/build-settings",
    "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main/app-settings",
    "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main/branch-settings",
    "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main/environment-variables"
)

foreach ($url in $urls) {
    Write-Host "Abrindo: $url" -ForegroundColor White
    Start-Process $url
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "INSTRUÇÕES ALTERNATIVAS:" -ForegroundColor Green
Write-Host "1. No console AWS Amplify, procure por:" -ForegroundColor White
Write-Host "   - 'Build settings' ou 'Build settings'" -ForegroundColor Cyan
Write-Host "   - 'App settings'" -ForegroundColor Cyan
Write-Host "   - 'Branch settings'" -ForegroundColor Cyan
Write-Host "   - 'Environment variables' ou 'Variables'" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Se não encontrar, use o menu de busca (lupa) e digite:" -ForegroundColor White
Write-Host "   - 'environment variables'" -ForegroundColor Cyan
Write-Host "   - 'variables'" -ForegroundColor Cyan
Write-Host "   - 'env'" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Ou vá diretamente em:" -ForegroundColor White
Write-Host "   - Menu lateral → 'Build settings' → 'Environment variables'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pressione Enter quando encontrar as variáveis de ambiente..."
Read-Host

Write-Host ""
Write-Host "VARIÁVEIS PARA ADICIONAR:" -ForegroundColor Yellow
Write-Host "NODE_ENV = production" -ForegroundColor White
Write-Host "NEXT_PUBLIC_API_URL = https://api.agroisync.com" -ForegroundColor White
Write-Host "ALLOWED_ORIGINS = https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com" -ForegroundColor White
Write-Host "JWT_SECRET = agrotm-production-secret-key-2024" -ForegroundColor White
Write-Host "MONGO_URI = mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority" -ForegroundColor White
Write-Host "NEXT_PUBLIC_APP_URL = https://agroisync.com" -ForegroundColor White
