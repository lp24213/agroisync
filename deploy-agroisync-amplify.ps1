# AGROISYNC.COM - AWS AMPLIFY DEPLOY SCRIPT
# Script otimizado para deploy no agroisync.com
# Execute este script para fazer o deploy automático

Write-Host "🚀 AGROISYNC.COM - DEPLOY AUTOMÁTICO AWS AMPLIFY" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# 1. VERIFICAÇÃO DE PRÉ-REQUISITOS
Write-Host "`n📋 VERIFICANDO PRÉ-REQUISITOS..." -ForegroundColor Yellow

# Verificar se está no diretório correto
if (-not (Test-Path "frontend")) {
    Write-Host "❌ ERRO: Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

# Verificar se o build foi feito
if (-not (Test-Path "frontend\.next")) {
    Write-Host "❌ ERRO: Execute 'npm run build' primeiro na pasta frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pré-requisitos verificados" -ForegroundColor Green

# 2. LIMPEZA E PREPARAÇÃO
Write-Host "`n🧹 LIMPANDO ARQUIVOS DESNECESSÁRIOS..." -ForegroundColor Yellow

# Remover arquivos de build antigos
if (Test-Path "frontend\.next\cache") {
    Remove-Item "frontend\.next\cache" -Recurse -Force
    Write-Host "✅ Cache limpo" -ForegroundColor Green
}

# 3. VERIFICAÇÃO DE CONFIGURAÇÕES
Write-Host "`n⚙️ VERIFICANDO CONFIGURAÇÕES..." -ForegroundColor Yellow

# Verificar amplify.yml
if (Test-Path "amplify.yml") {
    Write-Host "✅ amplify.yml encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO: amplify.yml não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar next.config.js
if (Test-Path "frontend\next.config.js") {
    Write-Host "✅ next.config.js encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO: next.config.js não encontrado" -ForegroundColor Red
    exit 1
}

# 4. PREPARAÇÃO PARA DEPLOY
Write-Host "`n📦 PREPARANDO PARA DEPLOY..." -ForegroundColor Yellow

# Verificar se há mudanças para commit
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Mudanças detectadas, fazendo commit..." -ForegroundColor Yellow
    
    # Adicionar todos os arquivos
    git add .
    
    # Commit com mensagem descritiva
    $commitMessage = "fix: Next.js 15 compatibility and AWS Amplify optimization - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMessage
    
    Write-Host "✅ Commit realizado: $commitMessage" -ForegroundColor Green
} else {
    Write-Host "✅ Nenhuma mudança para commit" -ForegroundColor Green
}

# 5. DEPLOY NO AWS AMPLIFY
Write-Host "`n🚀 INICIANDO DEPLOY NO AWS AMPLIFY..." -ForegroundColor Yellow

# Push para o repositório
Write-Host "📤 Enviando para o repositório..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ DEPLOY INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "`n📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://console.aws.amazon.com/amplify/" -ForegroundColor White
Write-Host "2. Clique em 'agrotm.sol'" -ForegroundColor White
Write-Host "3. Monitore o progresso do build" -ForegroundColor White
Write-Host "4. Verifique o domínio: https://agroisync.com" -ForegroundColor White

Write-Host "`n🔗 LINKS ÚTEIS:" -ForegroundColor Cyan
Write-Host "• AWS Amplify Console: https://console.aws.amazon.com/amplify/" -ForegroundColor White
Write-Host "• AGROISYNC: https://agroisync.com" -ForegroundColor White
Write-Host "• Status do Build: https://console.aws.amazon.com/amplify/home?region=us-east-2#/d2d5j98tau5snm" -ForegroundColor White

Write-Host "`n🎯 DEPLOY CONCLUÍDO! AGROISYNC.COM ESTÁ SENDO ATUALIZADO!" -ForegroundColor Green
