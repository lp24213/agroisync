# Deploy simples para Cloudflare Pages
Write-Host "Iniciando deploy para Cloudflare Pages..."

# Build do frontend
Write-Host "Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# Verificar se o build foi criado
if (Test-Path "frontend/build") {
    Write-Host "Build criado com sucesso!"
    Write-Host "Diretorio: frontend/build"
    Write-Host "O Cloudflare Pages deve fazer deploy automaticamente"
    Write-Host "URL esperada: https://agroisync.pages.dev"
} else {
    Write-Host "Erro: Build nao foi criado"
}

Write-Host "Deploy concluido!"