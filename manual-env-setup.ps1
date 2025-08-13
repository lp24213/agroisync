# Script para configuração manual das variáveis de ambiente

Write-Host "CONFIGURAÇÃO MANUAL DAS VARIÁVEIS DE AMBIENTE" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Como o AWS CLI não está funcionando, vamos configurar manualmente!" -ForegroundColor Cyan
Write-Host ""

Write-Host "ABRINDO CONSOLE AWS AMPLIFY..." -ForegroundColor Green

# Abrir o console AWS Amplify
Start-Process "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main"

Write-Host ""
Write-Host "Console AWS Amplify aberto!" -ForegroundColor Green
Write-Host ""

Write-Host "PASSO A PASSO PARA CONFIGURAR AS VARIÁVEIS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. NO CONSOLE AWS AMPLIFY:" -ForegroundColor White
Write-Host "   - Clique no seu app: d2d5j98tau5snm" -ForegroundColor Cyan
Write-Host "   - Clique na branch: main" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. PROCURE POR:" -ForegroundColor White
Write-Host "   - Menu lateral → 'Build settings'" -ForegroundColor Cyan
Write-Host "   - OU 'App settings'" -ForegroundColor Cyan
Write-Host "   - OU 'Branch settings'" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. DENTRO DE QUALQUER UM DOS ACIMA, PROCURE POR:" -ForegroundColor White
Write-Host "   - 'Environment variables'" -ForegroundColor Cyan
Write-Host "   - OU 'Variables'" -ForegroundColor Cyan
Write-Host "   - OU 'Environment'" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. CLIQUE EM 'Add environment variable' OU 'Add variable'" -ForegroundColor White
Write-Host ""

Write-Host "5. ADICIONE CADA VARIÁVEL UMA POR UMA:" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEIS PARA ADICIONAR:" -ForegroundColor Yellow
Write-Host ""

Write-Host "VARIÁVEL 1:" -ForegroundColor Green
Write-Host "   Nome: NODE_ENV" -ForegroundColor White
Write-Host "   Valor: production" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEL 2:" -ForegroundColor Green
Write-Host "   Nome: NEXT_PUBLIC_API_URL" -ForegroundColor White
Write-Host "   Valor: https://api.agroisync.com" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEL 3:" -ForegroundColor Green
Write-Host "   Nome: ALLOWED_ORIGINS" -ForegroundColor White
Write-Host "   Valor: https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEL 4:" -ForegroundColor Green
Write-Host "   Nome: JWT_SECRET" -ForegroundColor White
Write-Host "   Valor: agrotm-production-secret-key-2024" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEL 5:" -ForegroundColor Green
Write-Host "   Nome: MONGO_URI" -ForegroundColor White
Write-Host "   Valor: mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority" -ForegroundColor White
Write-Host ""

Write-Host "VARIÁVEL 6:" -ForegroundColor Green
Write-Host "   Nome: NEXT_PUBLIC_APP_URL" -ForegroundColor White
Write-Host "   Valor: https://agroisync.com" -ForegroundColor White
Write-Host ""

Write-Host "6. DEPOIS DE ADICIONAR TODAS:" -ForegroundColor White
Write-Host "   - Clique em 'Save' ou 'Save changes'" -ForegroundColor Cyan
Write-Host ""

Write-Host "7. INICIAR BUILD:" -ForegroundColor White
Write-Host "   - Vá em 'Build settings'" -ForegroundColor Cyan
Write-Host "   - Clique em 'Redeploy' ou 'Start build'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pressione Enter quando terminar de configurar todas as variáveis..."
Read-Host

Write-Host ""
Write-Host "VERIFICANDO STATUS..." -ForegroundColor Yellow

# Aguardar um pouco e verificar
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Testando o site..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "https://agroisync.com" -Method Head -TimeoutSec 10
    Write-Host "Site agroisync.com está respondendo! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Site agroisync.com ainda não está respondendo" -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "https://api.agroisync.com/health" -Method Head -TimeoutSec 10
    Write-Host "API agroisync.com está respondendo! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API agroisync.com ainda não está respondendo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "CONFIGURAÇÃO MANUAL CONCLUÍDA!" -ForegroundColor Green
Write-Host "Verifique o console AWS Amplify para o status do build." -ForegroundColor Cyan
Write-Host "Console: https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main" -ForegroundColor Cyan
