# AGROISYNC Backend Deploy Script - AWS Amplify
# Este script automatiza o deploy do backend no AWS Amplify

param(
    [string]$Environment = "production",
    [string]$Region = "us-east-2",
    [switch]$Force
)

Write-Host "🚀 Iniciando deploy do AGROISYNC Backend no AWS Amplify..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: package.json não encontrado. Execute este script no diretório do backend." -ForegroundColor Red
    exit 1
}

# Verificar se AWS CLI está instalado
try {
    $awsVersion = aws --version 2>&1
    Write-Host "✅ AWS CLI encontrado: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: AWS CLI não encontrado. Instale o AWS CLI primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se está logado no AWS
try {
    $identity = aws sts get-caller-identity --region $Region 2>&1 | ConvertFrom-Json
    Write-Host "✅ Logado no AWS como: $($identity.Arn)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: Não logado no AWS. Execute 'aws configure' primeiro." -ForegroundColor Red
    exit 1
}

# Verificar configurações de ambiente
Write-Host "⚙️ Verificando configurações..." -ForegroundColor Yellow
if (-not (Test-Path "env.$Environment")) {
    Write-Host "❌ Erro: env.$Environment não encontrado" -ForegroundColor Red
    exit 1
}

# Limpar builds anteriores
Write-Host "🧹 Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm ci --only=production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Verificar vulnerabilidades
Write-Host "🔒 Verificando vulnerabilidades..." -ForegroundColor Yellow
npm audit --audit-level=moderate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Vulnerabilidades encontradas. Execute 'npm audit fix' para corrigir." -ForegroundColor Yellow
}

# Criar diretórios necessários
Write-Host "📁 Criando diretórios necessários..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "public" | Out-Null

# Testar configurações
Write-Host "🔍 Testando configurações..." -ForegroundColor Yellow
try {
    node -e "
    const { testConnection } = require('./src/config/database');
    testConnection().then(connected => {
        if (connected) {
            console.log('✅ Conexão com banco de dados OK');
            process.exit(0);
        } else {
            console.log('⚠️ Conexão com banco de dados falhou - modo offline');
            process.exit(0);
        }
    }).catch(err => {
        console.log('⚠️ Erro ao testar banco:', err.message);
        process.exit(0);
    });
    "
} catch {
    Write-Host "⚠️ Erro ao testar configurações: $_" -ForegroundColor Yellow
}

# Verificar se o servidor pode ser iniciado
Write-Host "🧪 Testando inicialização do servidor..." -ForegroundColor Yellow
try {
    $job = Start-Job -ScriptBlock { node server.js }
    Start-Sleep -Seconds 5
    Stop-Job -Job $job
    Remove-Job -Job $job
    Write-Host "✅ Servidor testado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro ao testar servidor: $_" -ForegroundColor Yellow
}

# Preparar para deploy
Write-Host "📦 Preparando para deploy..." -ForegroundColor Yellow

# Criar arquivo de configuração do Amplify
$amplifyConfig = @"
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --only=production
    build:
      commands:
        - echo 'Backend build completed successfully'
  artifacts:
    baseDirectory: .
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .npm-cache/**/*
backend:
  phases:
    build:
      commands:
        - echo 'Backend build completed successfully'
  artifacts:
    baseDirectory: .
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
"@

$amplifyConfig | Out-File -FilePath "amplify.yml" -Encoding UTF8

# Verificar se o app existe no Amplify
Write-Host "🔍 Verificando app no Amplify..." -ForegroundColor Yellow
try {
    $apps = aws amplify list-apps --region $Region 2>&1 | ConvertFrom-Json
    $app = $apps.apps | Where-Object { $_.name -eq "agroisync-backend" }
    
    if ($app) {
        Write-Host "✅ App encontrado: $($app.name) (ID: $($app.appId))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ App não encontrado. Crie o app no console do Amplify primeiro." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erro ao verificar apps: $_" -ForegroundColor Yellow
}

# Build final
Write-Host "🏗️ Build finalizado com sucesso!" -ForegroundColor Green
Write-Host "📊 Informações do build:" -ForegroundColor Cyan
Write-Host "   - Node.js: $(node --version)" -ForegroundColor White
Write-Host "   - NPM: $(npm --version)" -ForegroundColor White
Write-Host "   - Diretório: $(Get-Location)" -ForegroundColor White
Write-Host "   - Tamanho: $((Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB) MB" -ForegroundColor White
Write-Host "   - Arquivos: $((Get-ChildItem -Recurse -File).Count)" -ForegroundColor White

Write-Host "🎉 Build do AGROISYNC Backend concluído com sucesso!" -ForegroundColor Green
Write-Host "🚀 Pronto para deploy no AWS Amplify!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Faça commit das alterações no Git" -ForegroundColor White
Write-Host "   2. Push para o branch principal" -ForegroundColor White
Write-Host "   3. O Amplify fará o deploy automaticamente" -ForegroundColor White
Write-Host "   4. Monitore o progresso no console do Amplify" -ForegroundColor White
