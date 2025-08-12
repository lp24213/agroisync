# Script PowerShell para configurar domínio personalizado no AWS Amplify
# AGROTM - agrisync.com.br

Write-Host "Configurando domínio personalizado para AGROTM..." -ForegroundColor Green

# Configurar variáveis
$APP_ID = "d2d5j98tau5snm"
$DOMAIN = "agrisync.com.br"
$BRANCH = "main"

# Verificar se o AWS CLI está configurado
try {
    $awsVersion = aws --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "AWS CLI encontrado: $awsVersion" -ForegroundColor Green
    } else {
        throw "AWS CLI não encontrado"
    }
} catch {
    Write-Host "AWS CLI não encontrado. Instale o AWS CLI primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Amplify CLI está configurado
try {
    $amplifyVersion = amplify --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Amplify CLI encontrado: $amplifyVersion" -ForegroundColor Green
    } else {
        throw "Amplify CLI não encontrado"
    }
} catch {
    Write-Host "Amplify CLI não encontrado. Instale o Amplify CLI primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "Configurando domínio personalizado: $DOMAIN" -ForegroundColor Yellow

# Adicionar domínio personalizado
Write-Host "Configurando domínio principal e subdomínio www..." -ForegroundColor Yellow

try {
    # Configurar domínio principal
    aws amplify create-domain-association `
        --app-id $APP_ID `
        --domain-name $DOMAIN `
        --sub-domain-settings prefix=www,branchName=$BRANCH

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Domínio personalizado configurado com sucesso!" -ForegroundColor Green
        Write-Host "URL principal: https://$DOMAIN" -ForegroundColor Cyan
        Write-Host "Subdomínio: https://www.$DOMAIN" -ForegroundColor Cyan
    } else {
        throw "Erro ao configurar domínio"
    }
} catch {
    Write-Host "Erro ao configurar domínio personalizado: $_" -ForegroundColor Red
    exit 1
}

# Verificar status da configuração
Write-Host "Verificando status da configuração..." -ForegroundColor Yellow
try {
    aws amplify get-domain-association `
        --app-id $APP_ID `
        --domain-name $DOMAIN
} catch {
    Write-Host "Nao foi possível verificar o status da configuração" -ForegroundColor Yellow
}

Write-Host "Configuração de domínio concluída!" -ForegroundColor Green
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure os nameservers no seu provedor de domínio" -ForegroundColor White
Write-Host "2. Aguarde a propagação DNS (pode levar até 48 horas)" -ForegroundColor White
Write-Host "3. O SSL será configurado automaticamente pela AWS" -ForegroundColor White

Write-Host "Domínio configurado: $DOMAIN" -ForegroundColor Green
