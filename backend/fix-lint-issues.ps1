# Script PowerShell para corrigir problemas comuns de ESLint

Write-Host "🔧 Corrigindo problemas de lint..." -ForegroundColor Cyan

# 1. Corrigir parseInt sem radix
Write-Host "📝 Corrigindo parseInt..." -ForegroundColor Yellow
Get-ChildItem -Path "src" -Filter "*.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Corrigir parseInt(x) -> parseInt(x, 10)
    $content = $content -replace 'parseInt\(([^,\)]+)\)', 'parseInt($1, 10)'
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "✅ parseInt corrigido!" -ForegroundColor Green

# 2. Executar Prettier para corrigir formatação
Write-Host "📝 Executando Prettier..." -ForegroundColor Yellow
npm run format

Write-Host "✅ Formatação concluída!" -ForegroundColor Green

# 3. Executar ESLint --fix
Write-Host "📝 Executando ESLint --fix..." -ForegroundColor Yellow
npm run lint:fix

Write-Host "✅ Correções aplicadas!" -ForegroundColor Green
Write-Host "🎉 Processo concluído!" -ForegroundColor Cyan
