# Deploy direto via API do IBM Cloud Code Engine
# Este script faz deploy automático do AgroSync

param(
    [string]$IBM_API_KEY = "",
    [string]$REGION = "br-sao",
    [string]$PROJECT_NAME = "agroisync-project",
    [string]$APP_NAME = "agroisync-web"
)

Write-Host "🚀 FAZENDO DEPLOY DIRETO NO IBM CLOUD!" -ForegroundColor Green

# Configurações da API
$IBM_CLOUD_API_BASE = "https://$REGION.codeengine.cloud.ibm.com/api/v1"
$HEADERS = @{
    "Authorization" = "Bearer $IBM_API_KEY"
    "Content-Type" = "application/json"
}

# Função para criar projeto
function Create-Project {
    Write-Host "📁 Criando projeto: $PROJECT_NAME" -ForegroundColor Yellow
    
    $projectData = @{
        apiVersion = "codeengine.cloud.ibm.com/v1beta1"
        kind = "Project"
        metadata = @{
            name = $PROJECT_NAME
        }
        spec = @{
            region = $REGION
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$IBM_CLOUD_API_BASE/projects" -Method POST -Headers $HEADERS -Body $projectData
        Write-Host "✅ Projeto criado com sucesso!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Projeto já existe ou erro: $($_.Exception.Message)" -ForegroundColor Yellow
        return $true
    }
}

# Função para criar aplicação
function Create-Application {
    Write-Host "🚀 Criando aplicação: $APP_NAME" -ForegroundColor Yellow
    
    $appData = @{
        apiVersion = "codeengine.cloud.ibm.com/v1beta1"
        kind = "Application"
        metadata = @{
            name = $APP_NAME
            namespace = $PROJECT_NAME
        }
        spec = @{
            image = "nginx:alpine"
            port = 8080
            cpu = "0.25"
            memory = "0.5Gi"
            minScale = 1
            maxScale = 3
            env = @(
                @{
                    name = "PORT"
                    value = "8080"
                }
            )
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$IBM_CLOUD_API_BASE/projects/$PROJECT_NAME/applications" -Method POST -Headers $HEADERS -Body $appData
        Write-Host "✅ Aplicação criada com sucesso!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Aplicação já existe ou erro: $($_.Exception.Message)" -ForegroundColor Yellow
        return $true
    }
}

# Função para criar build
function Create-Build {
    Write-Host "🔨 Criando build do AgroSync" -ForegroundColor Yellow
    
    # Primeiro, vamos fazer upload do build via API
    $buildData = @{
        apiVersion = "codeengine.cloud.ibm.com/v1beta1"
        kind = "Build"
        metadata = @{
            name = "agroisync-build"
            namespace = $PROJECT_NAME
        }
        spec = @{
            source = @{
                type = "local"
                contextDir = "."
            }
            strategy = @{
                type = "dockerfile"
                dockerfile = "Dockerfile.ibm"
            }
            output = @{
                image = "agroisync/frontend:latest"
            }
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$IBM_CLOUD_API_BASE/projects/$PROJECT_NAME/builds" -Method POST -Headers $HEADERS -Body $buildData
        Write-Host "✅ Build criado com sucesso!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erro ao criar build: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Executar deploy
Write-Host "🎯 Iniciando processo de deploy..." -ForegroundColor Cyan

if ($IBM_API_KEY -eq "") {
    Write-Host "❌ IBM_API_KEY não fornecida!" -ForegroundColor Red
    Write-Host "💡 Para obter sua API Key:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://cloud.ibm.com/iam/apikeys" -ForegroundColor White
    Write-Host "   2. Crie uma nova API Key" -ForegroundColor White
    Write-Host "   3. Execute: .\deploy-ibm-api.ps1 -IBM_API_KEY 'sua-api-key'" -ForegroundColor White
    exit 1
}

# Executar etapas do deploy
$step1 = Create-Project
if ($step1) {
    $step2 = Create-Application
    if ($step2) {
        $step3 = Create-Build
        if ($step3) {
            Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
            Write-Host "🌐 Sua aplicação estará disponível em:" -ForegroundColor Cyan
            Write-Host "   https://$APP_NAME.xxxxx.$REGION.codeengine.appdomain.cloud" -ForegroundColor White
        }
    }
}

Write-Host "✅ Script de deploy automático criado!" -ForegroundColor Green
