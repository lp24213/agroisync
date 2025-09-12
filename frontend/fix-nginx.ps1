# Script para RESOLVER DEFINITIVAMENTE o problema do nginx
Write-Host "=== CORRIGINDO O PROBLEMA DO NGINX ===" -ForegroundColor Red

# Gera timestamp único
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$imageName = "agroisync-fixed-$timestamp"

Write-Host "Criando imagem corrigida: $imageName" -ForegroundColor Yellow

# Build da imagem corrigida
docker build -f Dockerfile.final -t $imageName .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ IMAGEM CRIADA COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "AGORA FAÇA ISSO NO IBM CLOUD CONSOLE:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
    Write-Host "2. Selecione seu projeto" -ForegroundColor White
    Write-Host "3. Vá para Applications" -ForegroundColor White
    Write-Host "4. Clique em 'agroisync-web'" -ForegroundColor White
    Write-Host "5. Clique em 'Edit'" -ForegroundColor White
    Write-Host "6. Altere a Image para: $imageName" -ForegroundColor Yellow
    Write-Host "7. Clique em 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "OU use esta imagem: agroisync-fixed-$timestamp" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO no build!" -ForegroundColor Red
}
