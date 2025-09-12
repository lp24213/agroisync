# DEPLOY PROFISSIONAL AGROSYNC NO IBM CLOUD
Write-Host "=== DEPLOY PROFISSIONAL AGROSYNC ===" -ForegroundColor Green
Write-Host ""

# Verificar se Docker está rodando
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker está rodando!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando! Iniciando..." -ForegroundColor Red
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Start-Sleep -Seconds 30
}

# Build do React
Write-Host "Construindo aplicação React..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do React!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build do React concluído!" -ForegroundColor Green

# Build da imagem Docker
Write-Host "Construindo imagem Docker profissional..." -ForegroundColor Yellow
docker build -f Dockerfile.PROFISSIONAL -t agroisync-frontend-profissional .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do Docker!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Imagem Docker construída!" -ForegroundColor Green

# Testar localmente
Write-Host "Testando aplicação localmente..." -ForegroundColor Yellow
docker stop agroisync-test-profissional 2>$null
docker rm agroisync-test-profissional 2>$null
docker run -d --name agroisync-test-profissional -p 3000:80 agroisync-frontend-profissional

Start-Sleep -Seconds 5

# Verificar se está funcionando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Aplicação funcionando localmente!" -ForegroundColor Green
        Write-Host "🌐 Teste em: http://localhost:3000" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erro ao testar localmente!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DEPLOY NO IBM CLOUD ===" -ForegroundColor Green
Write-Host ""

Write-Host "OPÇÃO 1: IBM Cloud Console" -ForegroundColor Yellow
Write-Host "1. Acesse: https://cloud.ibm.com/codeengine" -ForegroundColor White
Write-Host "2. Selecione projeto: agroisync" -ForegroundColor White
Write-Host "3. Vá para Applications" -ForegroundColor White
Write-Host "4. Clique em 'Create application'" -ForegroundColor White
Write-Host "5. Configure:" -ForegroundColor White
Write-Host "   - Name: agroisync-web" -ForegroundColor Cyan
Write-Host "   - Image: nginx:alpine" -ForegroundColor Cyan
Write-Host "   - Port: 80" -ForegroundColor Cyan
Write-Host "   - CPU: 0.25" -ForegroundColor Cyan
Write-Host "   - Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host "6. Clique em 'Create'" -ForegroundColor White
Write-Host ""

Write-Host "OPÇÃO 2: IBM Cloud Shell" -ForegroundColor Yellow
Write-Host "1. Acesse: https://cloud.ibm.com/shell" -ForegroundColor White
Write-Host "2. Execute:" -ForegroundColor White
Write-Host "   ibmcloud ce project select --name agroisync" -ForegroundColor Cyan
Write-Host "   ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80 --cpu 0.25 --memory 0.5Gi" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== RESULTADO ===" -ForegroundColor Green
Write-Host "Você receberá uma URL como:" -ForegroundColor White
Write-Host "https://agroisync-web.XXXXX.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 DEPLOY PROFISSIONAL CONCLUÍDO!" -ForegroundColor Green
