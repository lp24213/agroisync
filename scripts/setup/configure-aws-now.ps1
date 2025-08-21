# Script para configurar AWS e variáveis de ambiente AGORA MESMO!

Write-Host "CONFIGURANDO AWS E VARIÁVEIS DE AMBIENTE AGORA MESMO!" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "DIGITE SUAS CREDENCIAIS AWS:" -ForegroundColor Red
Write-Host ""

# Solicitar credenciais
$accessKey = Read-Host "AWS Access Key ID"
$secretKey = Read-Host "AWS Secret Access Key"
$region = Read-Host "AWS Region [us-east-2]"

if ([string]::IsNullOrEmpty($region)) {
    $region = "us-east-2"
}

Write-Host ""
Write-Host "Configurando AWS CLI..." -ForegroundColor Cyan

# Configurar AWS CLI
aws configure set aws_access_key_id $accessKey --profile agrotm
aws configure set aws_secret_access_key $secretKey --profile agrotm
aws configure set default.region $region --profile agrotm
aws configure set default.output json --profile agrotm

Write-Host "AWS CLI configurado!" -ForegroundColor Green

Write-Host ""
Write-Host "Testando credenciais..." -ForegroundColor Cyan

# Testar credenciais
$testResult = aws sts get-caller-identity --profile agrotm
if ($LASTEXITCODE -eq 0) {
    Write-Host "Credenciais válidas! Configurando variáveis de ambiente..." -ForegroundColor Green
    Write-Host $testResult -ForegroundColor White
    
    Write-Host ""
    Write-Host "CONFIGURANDO VARIÁVEIS DE AMBIENTE..." -ForegroundColor Yellow
    
    # Configurar NODE_ENV
    Write-Host "1. NODE_ENV = production" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NODE_ENV":"production"}' --region $region --profile agrotm
    
    Start-Sleep -Seconds 2
    
    # Configurar NEXT_PUBLIC_API_URL
    Write-Host "2. NEXT_PUBLIC_API_URL = https://api.agroisync.com" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NEXT_PUBLIC_API_URL":"https://api.agroisync.com"}' --region $region --profile agrotm
    
    Start-Sleep -Seconds 2
    
    # Configurar ALLOWED_ORIGINS
    Write-Host "3. ALLOWED_ORIGINS = https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"ALLOWED_ORIGINS":"https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com"}' --region $region --profile agrotm
    
    Start-Sleep -Seconds 2
    
    # Configurar JWT_SECRET
    Write-Host "4. JWT_SECRET = agrotm-production-secret-key-2024" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"JWT_SECRET":"agrotm-production-secret-key-2024"}' --region $region --profile agrotm
    
    Start-Sleep -Seconds 2
    
    # Configurar MONGO_URI
    Write-Host "5. MONGO_URI = mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"MONGO_URI":"mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority"}' --region $region --profile agrotm
    
    Start-Sleep -Seconds 2
    
    # Configurar NEXT_PUBLIC_APP_URL
    Write-Host "6. NEXT_PUBLIC_APP_URL = https://agroisync.com" -ForegroundColor White
    aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NEXT_PUBLIC_APP_URL":"https://agroisync.com"}' --region $region --profile agrotm
    
    Write-Host ""
    Write-Host "TODAS AS VARIÁVEIS CONFIGURADAS!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "INICIANDO BUILD..." -ForegroundColor Yellow
    aws amplify start-job --app-id d2d5j98tau5snm --branch-name main --job-type RELEASE --region $region --profile agrotm
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "BUILD INICIADO COM SUCESSO!" -ForegroundColor Green
        Write-Host "Seu site agroisync.com deve estar funcionando em 2-3 minutos!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao iniciar build" -ForegroundColor Red
    }
    
} else {
    Write-Host "Credenciais inválidas! Verifique e tente novamente." -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione Enter para sair..."
Read-Host
