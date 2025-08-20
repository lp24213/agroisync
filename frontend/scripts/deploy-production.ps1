# Script de Deploy para Produção - AGROISYNC
# Este script prepara e executa o deploy de produção no Windows

param(
    [switch]$Force
)

# Configurar para parar em caso de erro
$ErrorActionPreference = "Stop"

Write-Host "🚀 AGROISYNC - Deploy de Produção" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório frontend/" -ForegroundColor Red
    exit 1
}

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion - OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: Node.js não está instalado" -ForegroundColor Red
    exit 1
}

# Verificar versão do Node.js (requer 18+)
$nodeMajorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
if ($nodeMajorVersion -lt 18) {
    Write-Host "❌ Erro: Node.js 18+ é necessário. Versão atual: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Verificar se o npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion - OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: npm não está instalado" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo de ambiente de produção existe
if (-not (Test-Path "env.production")) {
    Write-Host "❌ Erro: Arquivo env.production não encontrado" -ForegroundColor Red
    Write-Host "Crie o arquivo com as configurações de produção" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Arquivo de ambiente de produção - OK" -ForegroundColor Green

# Limpar instalações anteriores
Write-Host "🧹 Limpando instalações anteriores..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm ci --only=production

# Verificar se não há vulnerabilidades críticas
Write-Host "🔒 Verificando vulnerabilidades..." -ForegroundColor Yellow
try {
    npm audit --audit-level=moderate
} catch {
    if (-not $Force) {
        Write-Host "⚠️  Aviso: Vulnerabilidades encontradas. Verifique antes do deploy." -ForegroundColor Yellow
        $response = Read-Host "Continuar mesmo assim? (y/N)"
        if ($response -notmatch "^[Yy]$") {
            Write-Host "Deploy cancelado pelo usuário" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Configurar variáveis de ambiente
Write-Host "⚙️  Configurando variáveis de ambiente..." -ForegroundColor Yellow
Copy-Item "env.production" ".env.production"

# Executar build de produção
Write-Host "🔨 Executando build de produção..." -ForegroundColor Yellow
npm run build

# Verificar se o build foi bem-sucedido
if (-not (Test-Path ".next")) {
    Write-Host "❌ Erro: Build falhou - diretório .next não foi criado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build de produção concluído com sucesso!" -ForegroundColor Green

# Verificar tamanho do build
$buildSize = (Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "📊 Tamanho do build: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Green

# Verificar se há arquivos estáticos
if (-not (Test-Path ".next/static")) {
    Write-Host "⚠️  Aviso: Diretório de arquivos estáticos não encontrado" -ForegroundColor Yellow
}

# Preparar para deploy
Write-Host "🚀 Preparando para deploy..." -ForegroundColor Yellow

# Criar arquivo de status do deploy
$deployStatus = @"
Deploy realizado em: $(Get-Date)
Versão: $nodeVersion
Build size: $([math]::Round($buildSize, 2)) MB
"@
$deployStatus | Out-File -FilePath "deploy-status.txt" -Encoding UTF8

Write-Host ""
Write-Host "🎉 Deploy de produção preparado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente no AWS Amplify" -ForegroundColor White
Write-Host "2. Use o arquivo amplify-production.yml para o build" -ForegroundColor White
Write-Host "3. Configure o domínio personalizado se necessário" -ForegroundColor White
Write-Host "4. Monitore os logs de deploy" -ForegroundColor White
Write-Host ""
Write-Host "📁 Arquivos gerados:" -ForegroundColor Cyan
Write-Host "- .next/ (build de produção)" -ForegroundColor White
Write-Host "- deploy-status.txt (status do deploy)" -ForegroundColor White
Write-Host "- amplify-production.yml (configuração do Amplify)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Para fazer o deploy no AWS Amplify:" -ForegroundColor Cyan
Write-Host "1. Faça commit e push das alterações" -ForegroundColor White
Write-Host "2. Configure o arquivo amplify-production.yml no console" -ForegroundColor White
Write-Host "3. Configure as variáveis de ambiente" -ForegroundColor White
Write-Host "4. Execute o deploy" -ForegroundColor White
