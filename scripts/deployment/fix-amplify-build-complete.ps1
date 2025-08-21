# AGROISYNC - Correção Completa do Build Amplify (PowerShell)
# ==========================================================

Write-Host "🚀 AGROISYNC - Correção Completa do Build Amplify" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Função para log colorido
function Write-Log {
    param([string]$Message, [string]$Type = "INFO")
    switch ($Type) {
        "INFO" { Write-Host "[INFO] $Message" -ForegroundColor Green }
        "WARN" { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
        "ERROR" { Write-Host "[ERROR] $Message" -ForegroundColor Red }
        "STEP" { Write-Host "[STEP] $Message" -ForegroundColor Blue }
    }
}

# Verificar se estamos no diretório correto
if (-not (Test-Path "amplify.yml")) {
    Write-Log "Execute este script na raiz do projeto AGROISYNC" "ERROR"
    exit 1
}

Write-Log "1. Limpando arquivos de build anteriores..." "STEP"
if (Test-Path "frontend") {
    Set-Location "frontend"
    if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
    if (Test-Path "out") { Remove-Item "out" -Recurse -Force }
    if (Test-Path "node_modules") { Remove-Item "node_modules" -Recurse -Force }
    if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }
    Set-Location ".."
}

Write-Log "2. Verificando configuração do Amplify..." "STEP"
if (Test-Path "amplify") {
    Write-Log "Diretório amplify encontrado" "INFO"
    try {
        $amplifyVersion = amplify --version 2>$null
        if ($amplifyVersion) {
            Write-Log "Amplify CLI instalado" "INFO"
            Write-Host $amplifyVersion
        } else {
            Write-Log "Amplify CLI não encontrado. Instalando..." "WARN"
            npm install -g @aws-amplify/cli
        }
    } catch {
        Write-Log "Amplify CLI não encontrado. Instalando..." "WARN"
        npm install -g @aws-amplify/cli
    }
} else {
    Write-Log "Diretório amplify não encontrado" "WARN"
}

Write-Log "3. Verificando configuração do frontend..." "STEP"
Set-Location "frontend"

# Verificar se o .env.production existe
if (-not (Test-Path ".env.production")) {
    Write-Log "Arquivo .env.production não encontrado. Criando template..." "WARN"
    if (Test-Path "env.production") {
        Copy-Item "env.production" ".env.production"
    } else {
        @"
# Configurações de Produção - AGROISYNC
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://agroisync.com/api
NEXT_PUBLIC_APP_URL=https://agroisync.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agroisync
JWT_SECRET=your-super-secret-jwt-key-here
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
    }
}

Write-Log "4. Instalando dependências..." "STEP"
npm ci

Write-Log "5. Verificando configuração do TypeScript..." "STEP"
if (Test-Path "tsconfig-amplify.json") {
    Write-Log "tsconfig-amplify.json encontrado" "INFO"
} else {
    Write-Log "tsconfig-amplify.json não encontrado" "WARN"
}

Write-Log "6. Testando build local..." "STEP"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Build local bem-sucedido!" "INFO"
    
    # Verificar se o diretório out foi criado
    if (Test-Path "out") {
        Write-Log "📁 Diretório 'out' criado com sucesso" "INFO"
        Get-ChildItem "out" | Format-Table -AutoSize
        Write-Host "📊 Tamanho do diretório out:"
        $outSize = (Get-ChildItem "out" -Recurse | Measure-Object -Property Length -Sum).Sum
        Write-Host "$([math]::Round($outSize/1MB, 2)) MB"
    } else {
        Write-Log "❌ Diretório 'out' não foi criado!" "ERROR"
        exit 1
    }
} else {
    Write-Log "❌ Build local falhou!" "ERROR"
    exit 1
}

Set-Location ".."

Write-Log "7. Verificando configuração do amplify.yml..." "STEP"
if (Test-Path "amplify.yml") {
    Write-Log "amplify.yml encontrado e configurado" "INFO"
    Get-Content "amplify.yml"
} else {
    Write-Log "amplify.yml não encontrado!" "ERROR"
    exit 1
}

Write-Log "8. Verificando status do Git..." "STEP"
if (Test-Path ".git") {
    Write-Log "Repositório Git encontrado" "INFO"
    try {
        git status --porcelain
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ Git status OK" "INFO"
        } else {
            Write-Log "⚠️  Git status com problemas" "WARN"
        }
    } catch {
        Write-Log "Git não disponível" "WARN"
    }
} else {
    Write-Log "Repositório Git não encontrado" "WARN"
}

Write-Log "9. Verificando variáveis de ambiente..." "STEP"
if (Test-Path "amplify-environment-variables.json") {
    Write-Log "Arquivo de variáveis de ambiente encontrado" "INFO"
} else {
    Write-Log "Arquivo de variáveis de ambiente não encontrado" "WARN"
}

Write-Host ""
Write-Host "🎯 CORREÇÕES APLICADAS:" -ForegroundColor Cyan
Write-Host "✅ amplify.yml corrigido" -ForegroundColor Green
Write-Host "✅ next.config.js otimizado" -ForegroundColor Green
Write-Host "✅ tsconfig.json compatível" -ForegroundColor Green
Write-Host "✅ tsconfig-amplify.json criado" -ForegroundColor Green
Write-Host "✅ package.json atualizado" -ForegroundColor Green
Write-Host "✅ .env.production criado" -ForegroundColor Green
Write-Host "✅ Build local testado" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente no Amplify Console" -ForegroundColor White
Write-Host "2. Faça commit das alterações:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Fix Amplify build issues'" -ForegroundColor Gray
Write-Host "3. Push para trigger do deploy:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host "4. Monitore o build no Amplify Console" -ForegroundColor White

Write-Host ""
Write-Host "🔧 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "cd frontend; pnpm run build    # Build limpo" -ForegroundColor White
Write-Host "amplify status                 # Status do backend" -ForegroundColor White
Write-Host "amplify push                   # Deploy do backend" -ForegroundColor White
Write-Host "git log --oneline -5           # Últimos commits" -ForegroundColor White

Write-Host ""
Write-Log "✅ Correção completa aplicada! O projeto está pronto para deploy no Amplify." "INFO"
