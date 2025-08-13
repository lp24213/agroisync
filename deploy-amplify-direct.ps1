# Script para abrir o console AWS Amplify e fazer deployment manual

Write-Host "AGROISYNC.COM - DEPLOYMENT MANUAL NO AWS AMPLIFY" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Como as credenciais AWS estao invalidas, vamos fazer o deployment manualmente:" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSOS PARA DEPLOYMENT MANUAL:" -ForegroundColor Green
Write-Host "1. Abrir o console AWS Amplify" -ForegroundColor White
Write-Host "2. Selecionar o app: d2d5j98tau5snm" -ForegroundColor White
Write-Host "3. Ir para a branch: main" -ForegroundColor White
Write-Host "4. Clicar em 'Redeploy'" -ForegroundColor White
Write-Host "5. Aguardar o build completar" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEIS DE AMBIENTE PARA CONFIGURAR NO CONSOLE:" -ForegroundColor Green
Write-Host "NEXT_PUBLIC_API_URL = https://api.agroisync.com" -ForegroundColor White
Write-Host "NEXT_PUBLIC_APP_URL = https://agroisync.com" -ForegroundColor White
Write-Host "NODE_ENV = production" -ForegroundColor White
Write-Host "JWT_SECRET = agrotm-production-secret-key-2024" -ForegroundColor White
Write-Host "ALLOWED_ORIGINS = https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com" -ForegroundColor White
Write-Host "MONGO_URI = mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority" -ForegroundColor White
Write-Host ""

Write-Host "ABRINDO CONSOLE AWS AMPLIFY..." -ForegroundColor Yellow

# Abrir o console AWS Amplify no navegador
Start-Process "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main"

Write-Host ""
Write-Host "Console AWS Amplify aberto no navegador!" -ForegroundColor Green
Write-Host ""

Write-Host "INSTRUÇÕES RÁPIDAS:" -ForegroundColor Green
Write-Host "1. No console, vá em 'Environment variables'" -ForegroundColor White
Write-Host "2. Adicione cada variável listada acima" -ForegroundColor White
Write-Host "3. Clique em 'Save'" -ForegroundColor White
Write-Host "4. Vá em 'Build settings' e clique em 'Redeploy'" -ForegroundColor White
Write-Host ""

Write-Host "LINKS IMPORTANTES:" -ForegroundColor Green
Write-Host "Console Amplify: https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main" -ForegroundColor Cyan
Write-Host "Site: https://agroisync.com" -ForegroundColor Cyan
Write-Host "API: https://api.agroisync.com" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pressione Enter quando o deployment estiver completo..."
Read-Host

Write-Host ""
Write-Host "VERIFICANDO STATUS DO SITE..." -ForegroundColor Yellow

# Testar o site após o deployment
try {
    $response = Invoke-WebRequest -Uri "https://agroisync.com" -Method Head -TimeoutSec 10
    Write-Host "Site agroisync.com esta respondendo! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Site agroisync.com ainda nao esta respondendo" -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "https://api.agroisync.com/health" -Method Head -TimeoutSec 10
    Write-Host "API agroisync.com esta respondendo! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API agroisync.com ainda nao esta respondendo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "DEPLOYMENT MANUAL CONCLUÍDO!" -ForegroundColor Green
Write-Host "Verifique o console AWS Amplify para o status do build." -ForegroundColor Cyan
