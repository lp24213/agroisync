# Script de Restauração Automática - AGROISYNC
# Execute: .\restaurar-agrosync.ps1

param(
    [string]$GitHubRepo = "https://github.com/seu-usuario/agroisync.git",
    [string]$RootPath = "C:\Users\luisp\OneDrive\Área de Trabalho\agroisync",
    [switch]$HardReset = $false,
    [switch]$SkipBackup = $false,
    [switch]$SkipBuild = $false,
    [switch]$SkipDeploy = $false
)

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "    RESTAURAÇÃO DO AGROISYNC DO GITHUB      " -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Função para validar comandos
function Test-Command {
    param([string]$Command)
    try { if (Get-Command $Command -ErrorAction Stop) { return $true } }
    catch { return $false }
}

# Verificar Git
if (!(Test-Command "git")) {
    Write-Host "❌ Git não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "   Instale Git de: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Verificar Node.js
if (!(Test-Command "npm")) {
    Write-Host "❌ Node.js/npm não está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git encontrado" -ForegroundColor Green
Write-Host "✅ Node.js encontrado" -ForegroundColor Green
Write-Host ""

# PASSO 1: Backup das features atuais
if (!$SkipBackup) {
    Write-Host "PASSO 1: Fazendo backup das features atuais..." -ForegroundColor Yellow
    
    if (Test-Path "$RootPath\backup_features") {
        Remove-Item "$RootPath\backup_features" -Recurse -Force
    }
    
    New-Item -ItemType Directory -Path "$RootPath\backup_features" -Force | Out-Null
    
    $files = @(
        "frontend\src\pages\ClimaInsumos.js",
        "frontend\src\services\weatherService.js",
        "frontend\src\services\newsService.js",
        "frontend\src\components\EmailMarketingConsent.js",
        "frontend\src\components\ConsentBanner.js"
    )
    
    foreach ($file in $files) {
        $fullPath = Join-Path $RootPath $file
        if (Test-Path $fullPath) {
            Copy-Item $fullPath -Destination "$RootPath\backup_features\" -Force
            Write-Host "  ✓ Backed up: $file"
        }
    }
    
    Write-Host "✅ Backup concluído em: backup_features/" -ForegroundColor Green
    Write-Host ""
}

# PASSO 2: Restaurar do GitHub
Write-Host "PASSO 2: Restaurando do GitHub..." -ForegroundColor Yellow

Push-Location $RootPath

if ($HardReset) {
    Write-Host "  Executando: git fetch origin main && git reset --hard origin/main"
    git fetch origin main 2>&1 | Write-Host
    git reset --hard origin/main 2>&1 | Write-Host
} else {
    Write-Host "  Executando: git checkout -- ."
    git checkout -- . 2>&1 | Write-Host
    git fetch origin main 2>&1 | Write-Host
    git reset --soft origin/main 2>&1 | Write-Host
}

Write-Host "✅ Restauração concluída" -ForegroundColor Green
Write-Host ""

# PASSO 3: Restaurar componentes novos
Write-Host "PASSO 3: Restaurando componentes novos..." -ForegroundColor Yellow

$restoreMap = @{
    "backup_features\ClimaInsumos.js" = "frontend\src\pages\"
    "backup_features\weatherService.js" = "frontend\src\services\"
    "backup_features\newsService.js" = "frontend\src\services\"
    "backup_features\EmailMarketingConsent.js" = "frontend\src\components\"
    "backup_features\ConsentBanner.js" = "frontend\src\components\"
}

foreach ($src in $restoreMap.Keys) {
    $dest = $restoreMap[$src]
    $srcPath = Join-Path $RootPath $src
    $destPath = Join-Path $RootPath $dest
    
    if (Test-Path $srcPath) {
        if (!(Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        Copy-Item $srcPath -Destination $destPath -Force
        Write-Host "  ✓ Restaurado: $src"
    } else {
        Write-Host "  ⚠️  Não encontrado: $src" -ForegroundColor Yellow
    }
}

Write-Host "✅ Componentes restaurados" -ForegroundColor Green
Write-Host ""

# PASSO 4: Instalar dependências
Write-Host "PASSO 4: Instalando dependências..." -ForegroundColor Yellow

Push-Location "$RootPath\frontend"
Write-Host "  Frontend: npm install"
npm install 2>&1 | Select-Object -Last 3 | Write-Host
Pop-Location

Push-Location "$RootPath\backend"
Write-Host "  Backend: npm install"
npm install 2>&1 | Select-Object -Last 3 | Write-Host
Pop-Location

Write-Host "✅ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# PASSO 5: Build
if (!$SkipBuild) {
    Write-Host "PASSO 5: Buildando frontend..." -ForegroundColor Yellow
    
    Push-Location "$RootPath\frontend"
    npm run build 2>&1 | Select-Object -Last 5 | Write-Host
    Pop-Location
    
    Write-Host "✅ Build concluído" -ForegroundColor Green
    Write-Host ""
}

# PASSO 6: Deploy
if (!$SkipDeploy) {
    Write-Host "PASSO 6: Deploy..." -ForegroundColor Yellow
    
    Write-Host "  ⚠️  Verificar se está autenticado no Cloudflare:" -ForegroundColor Yellow
    Write-Host "     npx wrangler login" -ForegroundColor Cyan
    
    Push-Location "$RootPath\frontend"
    Write-Host "  Frontend: npm run deploy"
    npm run deploy 2>&1 | Select-Object -Last 3 | Write-Host
    Pop-Location
    
    Push-Location "$RootPath\backend"
    Write-Host "  Backend: npx wrangler deploy"
    npx wrangler deploy 2>&1 | Select-Object -Last 3 | Write-Host
    Pop-Location
    
    Write-Host "✅ Deploy concluído" -ForegroundColor Green
    Write-Host ""
}

Pop-Location

# RESUMO
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "          RESTAURAÇÃO CONCLUÍDA ✅          " -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configurar variáveis de ambiente:"
Write-Host "   - frontend\.env (REACT_APP_NEWS_API_KEY, etc)"
Write-Host "   - backend\wrangler.toml (D1 database bindings)"
Write-Host ""
Write-Host "2. Verificar se tudo funciona:"
Write-Host "   - Abrir: https://agroisync.com"
Write-Host "   - Testar: Clima, Notícias, Marketplace"
Write-Host "   - Verificar console (F12) para erros"
Write-Host ""
Write-Host "3. Se algo quebrar:"
Write-Host "   - Ver RESTAURACAO_GUIA.md"
Write-Host "   - Ver FEATURES_TO_PRESERVE.md"
Write-Host ""

Write-Host "🎉 Agroisync restaurado com sucesso!" -ForegroundColor Green
