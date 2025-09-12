# Script para forçar atualização do deployment
Write-Host "Forcando atualizacao do deployment..." -ForegroundColor Red

# Build da imagem com nome diferente para forçar update
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$imageName = "agroisync-frontend-$timestamp"

Write-Host "Criando nova imagem: $imageName" -ForegroundColor Yellow
docker build -f Dockerfile.force -t $imageName .

Write-Host "Imagem criada com sucesso!" -ForegroundColor Green
Write-Host "Use esta imagem no IBM Cloud Code Engine: $imageName" -ForegroundColor Cyan
Write-Host "Ou use: agroisync-frontend-$timestamp" -ForegroundColor Cyan

Write-Host "Agora va para o IBM Cloud Console e atualize a aplicacao com esta nova imagem." -ForegroundColor Yellow
