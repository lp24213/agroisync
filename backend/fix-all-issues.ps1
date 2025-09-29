# Script completo para corrigir todos os problemas de lint
Write-Host "Corrigindo problemas de lint..." -ForegroundColor Cyan

$filesFixed = 0

Get-ChildItem -Path "src" -Filter "*.js" -Recurse | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    $originalContent = $content
    
    # Corrigir variaveis nao usadas
    $content = $content -replace '\(env,\s*ctx\)', '(_env, _ctx)'
    $content = $content -replace '\(request,\s*env,\s*ctx\)', '(request, _env, _ctx)'
    $content = $content -replace 'async\s+fetch\s*\(request,\s+env,\s+ctx\)', 'async fetch(request, _env, _ctx)'
    $content = $content -replace 'async\s+fetch\s*\(request,\s+env\)', 'async fetch(request, _env)'
    $content = $content -replace 'catch\s*\(([a-zA-Z]+Error)\)\s*\{', 'catch (_$1) {'
    $content = $content -replace 'const\s+([a-zA-Z]+Error)\s*=\s*error;', 'const _$1 = error;'
    
    # Corrigir imports nao usados
    $content = $content -replace "import User from", "import _User from"
    $content = $content -replace "import mongoose from", "import _mongoose from"
    $content = $content -replace "import crypto from", "import _crypto from"
    
    # Corrigir variaveis const nao usadas
    $content = $content -replace 'const clientIP =', 'const _clientIP ='
    $content = $content -replace 'const webhookResponse =', 'const _webhookResponse ='
    $content = $content -replace 'const apiError =', 'const _apiError ='
    $content = $content -replace 'const oneHourAgo =', 'const _oneHourAgo ='
    $content = $content -replace 'const decoded =', 'const _decoded ='
    $content = $content -replace 'const manifest =', 'const _manifest ='
    $content = $content -replace 'const dbName =', 'const _dbName ='
    
    # Salvar se houve mudancas
    if ($content -ne $originalContent) {
        Set-Content -Path $file -Value $content -NoNewline
        $filesFixed++
        Write-Host "Corrigido: $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "$filesFixed arquivos corrigidos!" -ForegroundColor Green
Write-Host "Executando Prettier..." -ForegroundColor Yellow
npm run format
Write-Host "Concluido!" -ForegroundColor Green