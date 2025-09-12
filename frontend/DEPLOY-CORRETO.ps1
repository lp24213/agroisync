# DEPLOY CORRETO DO AGROSYNC
Write-Host "=== DEPLOY CORRETO DO AGROSYNC ===" -ForegroundColor Green

# Build da imagem
Write-Host "Criando imagem Docker..." -ForegroundColor Yellow
docker build -f Dockerfile.CORRETO -t agroisync-correto .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ IMAGEM CRIADA!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== AGORA FAÇA ISSO NO IBM CLOUD ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
    Write-Host "2. Selecione seu projeto" -ForegroundColor White
    Write-Host "3. Vá para Applications" -ForegroundColor White
    Write-Host "4. Clique em 'Create application'" -ForegroundColor White
    Write-Host "5. Configure:" -ForegroundColor White
    Write-Host "   Name: agroisync-web" -ForegroundColor Yellow
    Write-Host "   Image: agroisync-correto" -ForegroundColor Yellow
    Write-Host "   Port: 8080" -ForegroundColor Yellow
    Write-Host "   CPU: 0.25" -ForegroundColor Yellow
    Write-Host "   Memory: 0.5Gi" -ForegroundColor Yellow
    Write-Host "6. Clique em 'Create'" -ForegroundColor White
    Write-Host "7. Aguarde 3 minutos" -ForegroundColor White
    Write-Host ""
    Write-Host "=== TESTE ===" -ForegroundColor Green
    Write-Host "https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
} else {
    Write-Host "❌ ERRO no Docker!" -ForegroundColor Red
    Write-Host ""
    Write-Host "=== SOLUÇÃO SEM DOCKER ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
    Write-Host "2. Selecione seu projeto" -ForegroundColor White
    Write-Host "3. Vá para Applications" -ForegroundColor White
    Write-Host "4. Clique em 'Create application'" -ForegroundColor White
    Write-Host "5. Configure:" -ForegroundColor White
    Write-Host "   Name: agroisync-web" -ForegroundColor Yellow
    Write-Host "   Image: nginx:alpine" -ForegroundColor Yellow
    Write-Host "   Port: 8080" -ForegroundColor Yellow
    Write-Host "   CPU: 0.25" -ForegroundColor Yellow
    Write-Host "   Memory: 0.5Gi" -ForegroundColor Yellow
    Write-Host "6. Clique em 'Create'" -ForegroundColor White
    Write-Host ""
    Write-Host "Isso vai mostrar a página padrão do nginx, mas vai funcionar!" -ForegroundColor Yellow
}
