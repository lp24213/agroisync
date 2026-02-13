# ========================================
# 🗑️ DELETAR PÁGINAS NÃO UTILIZADAS
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DELETANDO PÁGINAS NÃO UTILIZADAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$paginasParaDeletar = @(
    # DUPLICADAS
    "src\pages\Home.js",                      # Duplicata de AgroisyncHome
    "src\pages\AgroisyncHomePrompt.js",       # Não utilizada
    "src\pages\ProductDetailNew.js",          # Duplicata de ProductDetail
    "src\pages\SignupType.js",                # Não utilizada (signup unificado)
    "src\pages\SignupGeneral.js",             # Não utilizada (signup unificado)
    "src\pages\UsuarioGeral.js",              # Não utilizada
    "src\pages\AgroisyncRegister.js",         # Não utilizada (tem SignupUnified)
    
    # NEM IMPORTADAS
    "src\pages\AdminEmailLogs.js",            # Não importada
    "src\pages\Onboarding.js",                # Não importada
    "src\pages\_document.js"                  # Não importada (Next.js)
)

$deletadas = 0
$naoEncontradas = 0

foreach ($pagina in $paginasParaDeletar) {
    if (Test-Path $pagina) {
        try {
            Remove-Item $pagina -Force
            Write-Host "✅ Deletada: $pagina" -ForegroundColor Green
            $deletadas++
        } catch {
            Write-Host "❌ Erro ao deletar: $pagina" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Não encontrada: $pagina" -ForegroundColor Yellow
        $naoEncontradas++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Deletadas: $deletadas páginas" -ForegroundColor Green
Write-Host "⚠️  Não encontradas: $naoEncontradas páginas" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

