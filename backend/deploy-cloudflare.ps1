# ========================================
# Script de Deploy - AgroSync Backend
# Cloudflare Workers + D1 Database
# ========================================

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "AgroSync - Deploy do Backend" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se está logado no Cloudflare
Write-Host "[1/6] Verificando login no Cloudflare..." -ForegroundColor Yellow
try {
    $whoami = npx wrangler whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Não está logado no Cloudflare." -ForegroundColor Red
        Write-Host "Executando login..." -ForegroundColor Yellow
        npx wrangler login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Falha no login. Abortando." -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "✅ Login verificado" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao verificar login: $_" -ForegroundColor Red
    exit 1
}

# 2. Verificar/Criar D1 Database
Write-Host ""
Write-Host "[2/6] Verificando banco de dados D1..." -ForegroundColor Yellow
$dbExists = npx wrangler d1 list | Select-String "agroisync-db"
if (!$dbExists) {
    Write-Host "⚠️  Banco de dados 'agroisync-db' não encontrado." -ForegroundColor Yellow
    Write-Host "Criando banco de dados..." -ForegroundColor Yellow
    npx wrangler d1 create agroisync-db
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Falha ao criar banco de dados. Abortando." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Banco de dados criado" -ForegroundColor Green
} else {
    Write-Host "✅ Banco de dados encontrado" -ForegroundColor Green
}

# 3. Aplicar Schema SQL
Write-Host ""
Write-Host "[3/6] Aplicando schema SQL ao D1..." -ForegroundColor Yellow
if (Test-Path "schema.sql") {
    npx wrangler d1 execute agroisync-db --file=./schema.sql --remote
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema aplicado com sucesso" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Aviso: Possível erro ao aplicar schema (pode ser que já exista)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Arquivo schema.sql não encontrado. Pulando..." -ForegroundColor Yellow
}

# 4. Verificar secrets
Write-Host ""
Write-Host "[4/6] Verificando secrets..." -ForegroundColor Yellow
Write-Host "ℹ️  Secrets devem ser configurados manualmente:" -ForegroundColor Cyan
Write-Host "   - JWT_SECRET" -ForegroundColor White
Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "   - STRIPE_WEBHOOK_SECRET" -ForegroundColor White
Write-Host "   - RESEND_API_KEY" -ForegroundColor White
Write-Host ""
$configureSecrets = Read-Host "Deseja configurar secrets agora? (s/N)"
if ($configureSecrets -eq "s" -or $configureSecrets -eq "S") {
    Write-Host "Configurando JWT_SECRET..." -ForegroundColor Yellow
    npx wrangler secret put JWT_SECRET
    
    Write-Host "Configurando STRIPE_SECRET_KEY..." -ForegroundColor Yellow
    npx wrangler secret put STRIPE_SECRET_KEY
    
    Write-Host "Configurando STRIPE_WEBHOOK_SECRET..." -ForegroundColor Yellow
    npx wrangler secret put STRIPE_WEBHOOK_SECRET
    
    Write-Host "Configurando RESEND_API_KEY..." -ForegroundColor Yellow
    npx wrangler secret put RESEND_API_KEY
    
    Write-Host "✅ Secrets configurados" -ForegroundColor Green
} else {
    Write-Host "⏭️  Pulando configuração de secrets" -ForegroundColor Yellow
}

# 5. Build/Lint do projeto
Write-Host ""
Write-Host "[5/6] Executando lint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lint passou" -ForegroundColor Green
} else {
    Write-Host "⚠️  Avisos no lint. Continuando..." -ForegroundColor Yellow
}

# 6. Deploy do Worker
Write-Host ""
Write-Host "[6/6] Fazendo deploy do Worker..." -ForegroundColor Yellow
npx wrangler deploy --config wrangler-worker.toml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✨ Backend deployado com sucesso!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "URLs disponíveis:" -ForegroundColor Cyan
    Write-Host "  🌐 https://agroisync.com/api/health" -ForegroundColor White
    Write-Host "  🌐 https://www.agroisync.com/api/health" -ForegroundColor White
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Testar health check: curl https://agroisync.com/api/health" -ForegroundColor White
    Write-Host "  2. Verificar logs: npx wrangler tail" -ForegroundColor White
    Write-Host "  3. Ver dashboard: https://dash.cloudflare.com" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Falha no deploy. Verifique os erros acima." -ForegroundColor Red
    exit 1
}

