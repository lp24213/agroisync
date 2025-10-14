# ===== SCRIPT DE INICIALIZAÇÃO D1 DATABASE (PowerShell) =====
# Inicializa o Cloudflare D1 Database com o schema

Write-Host "🚀 Inicializando D1 Database - AgroSync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se wrangler está instalado
$wranglerExists = Get-Command wrangler -ErrorAction SilentlyContinue

if (-not $wranglerExists) {
    Write-Host "❌ Wrangler CLI não encontrado!" -ForegroundColor Red
    Write-Host "📦 Instale com: npm install -g wrangler" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Wrangler CLI encontrado" -ForegroundColor Green
Write-Host ""

# Database info
$DATABASE_NAME = "agroisync-db"
$DATABASE_ID = "a3eb1069-9c36-4689-9ee9-971245cb2d12"

Write-Host "📋 Database Info:" -ForegroundColor Cyan
Write-Host "   Nome: $DATABASE_NAME"
Write-Host "   ID: $DATABASE_ID"
Write-Host ""

# Executar schema.sql
Write-Host "📊 Executando schema.sql..." -ForegroundColor Cyan
Write-Host ""

# Executar comando
wrangler d1 execute $DATABASE_NAME --file=schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Database inicializado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Tabelas criadas:" -ForegroundColor Cyan
    Write-Host "   ✓ users"
    Write-Host "   ✓ products"
    Write-Host "   ✓ freights"
    Write-Host "   ✓ messages"
    Write-Host "   ✓ transactions"
    Write-Host "   ✓ notifications"
    Write-Host "   ✓ sessions"
    Write-Host "   ✓ audit_logs"
    Write-Host ""
    Write-Host "👤 Usuário admin criado:" -ForegroundColor Yellow
    Write-Host "   Email: admin@agroisync.com"
    Write-Host "   Senha: AgroSync2024!@#SecureAdmin"
    Write-Host ""
    Write-Host "🎉 Pronto! Você pode agora:" -ForegroundColor Green
    Write-Host "   1. Iniciar o worker: wrangler dev"
    Write-Host "   2. Fazer deploy: wrangler publish"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao inicializar database" -ForegroundColor Red
    Write-Host "💡 Verifique se o database existe e se você está autenticado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos úteis:"
    Write-Host "   wrangler login"
    Write-Host "   wrangler d1 list"
    Write-Host "   wrangler d1 info $DATABASE_NAME"
    Write-Host ""
    exit 1
}
