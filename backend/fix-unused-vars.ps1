# Script para corrigir variáveis não utilizadas

Write-Host "🔧 Corrigindo variáveis não utilizadas..." -ForegroundColor Cyan

$patterns = @(
    # Parâmetros de função não usados
    @{ Pattern = '\(([a-zA-Z]+),\s*res\)'; Replacement = '(_$1, res)' },
    @{ Pattern = '\(req,\s*([a-zA-Z]+)\)'; Replacement = '(req, _$1)' },
    @{ Pattern = '\(([a-zA-Z]+),\s*([a-zA-Z]+),\s*next\)'; Replacement = '(_$1, _$2, next)' },
    
    # Variáveis específicas conhecidas
    @{ Pattern = '\benv\b(?=\s*,)'; Replacement = '_env' },
    @{ Pattern = '\bctx\b(?=\s*\))'; Replacement = '_ctx' },
    @{ Pattern = 'catch\s*\(([a-zA-Z]+Error)\)'; Replacement = 'catch (_$1)' },
    @{ Pattern = 'const\s+([a-zA-Z]+Error)\s*='; Replacement = 'const _$1 =' },
    @{ Pattern = 'const\s+\{([^}]+)\}\s*=.*?;\s*//.*?never used'; Replacement = 'const { _$1 } =' }
)

Get-ChildItem -Path "src" -Filter "*.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    foreach ($p in $patterns) {
        if ($content -match $p.Pattern) {
            $content = $content -replace $p.Pattern, $p.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content -NoNewline
        Write-Host "✓ $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "✅ Variáveis corrigidas!" -ForegroundColor Green
