# Script PowerShell para automatizar commit e push para GitHub
# Execute como: .\scripts\github-deploy.ps1

param(
    [string]$CommitMessage = "",
    [switch]$Force,
    [switch]$Help
)

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
Script de Deploy para GitHub - AGROISYNC

Uso:
    .\scripts\github-deploy.ps1 [opções]

Opções:
    -CommitMessage <mensagem>  Mensagem personalizada para o commit
    -Force                     Força o push mesmo se houver conflitos
    -Help                      Exibe esta mensagem de ajuda

Exemplos:
    .\scripts\github-deploy.ps1
    .\scripts\github-deploy.ps1 -CommitMessage "Atualização de segurança"
    .\scripts\github-deploy.ps1 -Force

"@
}

# Exibir ajuda se solicitado
if ($Help) {
    Show-Help
    exit 0
}

Write-Host "🚀 Iniciando deploy para GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Este diretório não é um repositório Git!" -ForegroundColor Red
    Write-Host "   Execute este script a partir da raiz do projeto." -ForegroundColor Yellow
    exit 1
}

# Verificar status do Git
Write-Host "📋 Verificando status do Git..." -ForegroundColor Cyan
$gitStatus = git status --porcelain

if (-not $gitStatus) {
    Write-Host "✅ Nenhuma alteração para commitar." -ForegroundColor Green
    Write-Host "   O repositório está limpo." -ForegroundColor Yellow
    exit 0
}

# Exibir alterações
Write-Host "📝 Alterações detectadas:" -ForegroundColor Cyan
git status --short

Write-Host ""

# Verificar se há arquivos não rastreados
$untrackedFiles = git ls-files --others --exclude-standard
if ($untrackedFiles) {
    Write-Host "📁 Arquivos não rastreados encontrados:" -ForegroundColor Yellow
    $untrackedFiles | ForEach-Object { Write-Host "   + $_" -ForegroundColor Yellow }
    Write-Host ""
}

# Adicionar todos os arquivos
Write-Host "➕ Adicionando arquivos ao staging..." -ForegroundColor Cyan
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar arquivos!" -ForegroundColor Red
    exit 1
}

# Gerar mensagem de commit
if (-not $CommitMessage) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $CommitMessage = "🔄 Deploy automático - $timestamp`n`n" +
                    "• Configuração Stripe atualizada com chaves live" +
                    "• Configuração de ambiente centralizada" +
                    "• Integração frontend/backend otimizada" +
                    "• Scripts de automação criados"
}

Write-Host "💬 Mensagem do commit:" -ForegroundColor Cyan
Write-Host "   $CommitMessage" -ForegroundColor White
Write-Host ""

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m $CommitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green

# Verificar branch atual
$currentBranch = git branch --show-current
Write-Host "🌿 Branch atual: $currentBranch" -ForegroundColor Cyan

# Se não estiver na main, fazer merge
if ($currentBranch -ne "main") {
    Write-Host "🔄 Fazendo merge para main..." -ForegroundColor Cyan
    git checkout main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao trocar para branch main!" -ForegroundColor Red
        exit 1
    }
    
    git merge $currentBranch
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer merge!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Merge realizado com sucesso!" -ForegroundColor Green
}

# Fazer push
Write-Host "🚀 Fazendo push para origin main..." -ForegroundColor Cyan

if ($Force) {
    git push origin main --force
} else {
    git push origin main
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    Write-Host "   Verifique se você tem permissão para fazer push." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy realizado com sucesso!" -ForegroundColor Green
Write-Host "   Repositório atualizado no GitHub." -ForegroundColor White

# Verificar status final
Write-Host ""
Write-Host "📊 Status final:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "🔗 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Verifique o repositório no GitHub" -ForegroundColor White
Write-Host "   2. Configure as variáveis de ambiente no GitHub Actions" -ForegroundColor White
Write-Host "   3. Execute o workflow de deploy automático" -ForegroundColor White
Write-Host "   4. Monitore o deploy na aba Actions" -ForegroundColor White

Write-Host ""
Write-Host "✅ Script concluído com sucesso!" -ForegroundColor Green
