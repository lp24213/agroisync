# Script simples para configurar credenciais AWS CLI

Write-Host "CONFIGURACAO DE CREDENCIAIS AWS CLI" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host ""

# Verificar se AWS CLI está instalado
try {
    $version = aws --version
    Write-Host "AWS CLI instalado: $version" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI nao esta instalado!" -ForegroundColor Red
    Write-Host "Baixe de: https://aws.amazon.com/cli/" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Digite suas credenciais AWS:" -ForegroundColor Cyan

# Solicitar Access Key ID
$accessKey = Read-Host "AWS Access Key ID"
if ([string]::IsNullOrEmpty($accessKey)) {
    Write-Host "Access Key ID nao pode estar vazio!" -ForegroundColor Red
    exit 1
}

# Solicitar Secret Access Key
$secretKey = Read-Host "AWS Secret Access Key"
if ([string]::IsNullOrEmpty($secretKey)) {
    Write-Host "Secret Access Key nao pode estar vazio!" -ForegroundColor Red
    exit 1
}

# Solicitar região
$region = Read-Host "AWS Region [us-east-2]"
if ([string]::IsNullOrEmpty($region)) {
    $region = "us-east-2"
}

Write-Host ""
Write-Host "Configurando AWS CLI..." -ForegroundColor Yellow

# Configurar AWS CLI
aws configure set aws_access_key_id $accessKey
aws configure set aws_secret_access_key $secretKey
aws configure set default.region $region
aws configure set default.output json

Write-Host "AWS CLI configurado com sucesso!" -ForegroundColor Green

Write-Host ""
Write-Host "Testando configuracao..." -ForegroundColor Yellow

# Testar configuração
try {
    $identity = aws sts get-caller-identity --query 'Arn' --output text
    $account = aws sts get-caller-identity --query 'Account' --output text
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Autenticacao bem-sucedida!" -ForegroundColor Green
        Write-Host "Usuario: $identity" -ForegroundColor Cyan
        Write-Host "Conta: $account" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Agora voce pode executar o script de correcao!" -ForegroundColor Green
    } else {
        Write-Host "Falha na autenticacao AWS!" -ForegroundColor Red
        Write-Host "Verifique suas credenciais e tente novamente." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro ao testar configuracao: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione Enter para sair..."
Read-Host
