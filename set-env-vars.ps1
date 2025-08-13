# Script para configurar variáveis de ambiente no AWS Amplify

Write-Host "CONFIGURANDO VARIÁVEIS DE AMBIENTE AGORA MESMO!" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Configurando variáveis uma por uma..." -ForegroundColor Cyan

# Configurar NODE_ENV
Write-Host "1. Configurando NODE_ENV..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NODE_ENV":"production"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ NODE_ENV configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar NODE_ENV" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Configurar NEXT_PUBLIC_API_URL
Write-Host "2. Configurando NEXT_PUBLIC_API_URL..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NEXT_PUBLIC_API_URL":"https://api.agroisync.com"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ NEXT_PUBLIC_API_URL configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar NEXT_PUBLIC_API_URL" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Configurar ALLOWED_ORIGINS
Write-Host "3. Configurando ALLOWED_ORIGINS..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"ALLOWED_ORIGINS":"https://agroisync.com,https://www.agroisync.com,https://api.agroisync.com"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ALLOWED_ORIGINS configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar ALLOWED_ORIGINS" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Configurar JWT_SECRET
Write-Host "4. Configurando JWT_SECRET..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"JWT_SECRET":"agrotm-production-secret-key-2024"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ JWT_SECRET configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar JWT_SECRET" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Configurar MONGO_URI
Write-Host "5. Configurando MONGO_URI..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"MONGO_URI":"mongodb+srv://agrotm:agrotm123@cluster.mongodb.net/agrotm?retryWrites=true&w=majority"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MONGO_URI configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar MONGO_URI" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Configurar NEXT_PUBLIC_APP_URL
Write-Host "6. Configurando NEXT_PUBLIC_APP_URL..." -ForegroundColor White
aws amplify update-branch --app-id d2d5j98tau5snm --branch-name main --environment-variables '{"NEXT_PUBLIC_APP_URL":"https://agroisync.com"}' --region us-east-2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ NEXT_PUBLIC_APP_URL configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar NEXT_PUBLIC_APP_URL" -ForegroundColor Red
}

Write-Host ""
Write-Host "TODAS AS VARIÁVEIS FORAM CONFIGURADAS!" -ForegroundColor Green
Write-Host ""

Write-Host "Agora iniciando o build..." -ForegroundColor Yellow
aws amplify start-job --app-id d2d5j98tau5snm --branch-name main --job-type RELEASE --region us-east-2

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build iniciado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao iniciar build" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verifique o console AWS Amplify para acompanhar o progresso!" -ForegroundColor Cyan
Write-Host "Console: https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm/main" -ForegroundColor Cyan
