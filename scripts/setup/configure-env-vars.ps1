# Script para configurar variáveis de ambiente no AWS Amplify

Write-Host "CONFIGURANDO VARIÁVEIS DE AMBIENTE NO AWS AMPLIFY" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Método 1: Tentando configurar via AWS CLI..." -ForegroundColor Cyan

# Tentar configurar uma variável por vez
$envVars = @{
    "NEXT_PUBLIC_API_URL" = "https://api.agroisync.com"
    "NEXT_PUBLIC_APP_URL" = "https://agroisync.com"
    "NODE_ENV" = "production"
    "JWT_SECRET" = "agrotm-production-secret-key-2024"
    "ALLOWED_ORIGINS" = "https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com"
    "MONGO_URI" = "mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Configurando $key = $value" -ForegroundColor White
    
    try {
        aws amplify update-branch `
            --app-id d2d5j98tau5snm `
            --branch-name main `
            --environment-variables "{\"$key\":\"$value\"}" `
            --region us-east-2
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "$key configurado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "Erro ao configurar $key" -ForegroundColor Red
        }
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "Erro ao configurar $key`: $errorMsg" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Método 2: Abrindo console AWS Amplify para configuração manual..." -ForegroundColor Cyan

# Abrir o console AWS Amplify
Start-Process "https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main"

Write-Host ""
Write-Host "Console AWS Amplify aberto!" -ForegroundColor Green
Write-Host ""

Write-Host "INSTRUÇÕES PARA CONFIGURAÇÃO MANUAL:" -ForegroundColor Yellow
Write-Host "1. No console, vá em 'Environment variables'" -ForegroundColor White
Write-Host "2. Clique em 'Add environment variable'" -ForegroundColor White
Write-Host "3. Adicione cada variável:" -ForegroundColor White
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "   $key = $value" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "4. Clique em 'Save'" -ForegroundColor White
Write-Host "5. Vá em 'Build settings' e clique em 'Redeploy'" -ForegroundColor White
Write-Host ""

Write-Host "Pressione Enter quando as variáveis estiverem configuradas..."
Read-Host

Write-Host ""
Write-Host "VERIFICANDO STATUS DO BUILD..." -ForegroundColor Yellow

# Aguardar um pouco e verificar o status
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
Write-Host "CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "Verifique o console AWS Amplify para o status do build." -ForegroundColor Cyan
