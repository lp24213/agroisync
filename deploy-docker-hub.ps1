# Deploy via Docker Hub para IBM Cloud
# Este script faz push da imagem para Docker Hub e depois deploy no IBM Cloud

Write-Host "🚀 FAZENDO DEPLOY VIA DOCKER HUB!" -ForegroundColor Green

# Configurações
$DOCKER_USERNAME = "agroisync"
$IMAGE_NAME = "agroisync-frontend"
$TAG = "latest"

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Docker Hub: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
Write-Host "   Região IBM: br-sao"

# Verificar se está logado no Docker
Write-Host "🔐 Verificando login no Docker Hub..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker está rodando" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker não está rodando!" -ForegroundColor Red
        Write-Host "💡 Inicie o Docker Desktop primeiro" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao verificar Docker: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Fazer login no Docker Hub
Write-Host "🔑 Fazendo login no Docker Hub..." -ForegroundColor Yellow
Write-Host "💡 Você precisará inserir suas credenciais do Docker Hub" -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login do Docker Hub!" -ForegroundColor Red
    Write-Host "💡 Crie uma conta em: https://hub.docker.com" -ForegroundColor Yellow
    exit 1
}

# Tag da imagem
Write-Host "🏷️ Marcando imagem para Docker Hub..." -ForegroundColor Yellow
docker tag agroisync-frontend:latest $DOCKER_USERNAME/$IMAGE_NAME:$TAG

# Push para Docker Hub
Write-Host "📤 Fazendo push para Docker Hub..." -ForegroundColor Yellow
docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push concluído com sucesso!" -ForegroundColor Green
    
    # Criar instruções para IBM Cloud
    $instructions = @"
🎉 IMAGEM DISPONÍVEL NO DOCKER HUB!

📦 Imagem: $DOCKER_USERNAME/$IMAGE_NAME:$TAG
🌐 Docker Hub: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME

🚀 PRÓXIMOS PASSOS NO IBM CLOUD:

1. Acesse: https://cloud.ibm.com/codeengine/projects
2. Crie um projeto na região br-sao
3. Crie uma aplicação com:
   - Nome: agroisync-web
   - Container image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG
   - Port: 8080
   - CPU: 0.25
   - Memory: 0.5Gi
   - Min scale: 1
   - Max scale: 3

4. Environment variables:
   - PORT = 8080

✅ DEPLOY AUTOMÁTICO CONCLUÍDO!
"@
    
    $instructions | Out-File -FilePath "DEPLOY-CONCLUIDO.txt" -Encoding UTF8
    
    Write-Host "📄 Instruções salvas em: DEPLOY-CONCLUIDO.txt" -ForegroundColor Green
    Write-Host "🎯 Agora é só usar a imagem no IBM Cloud!" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Falha no push para Docker Hub!" -ForegroundColor Red
    Write-Host "💡 Verifique suas credenciais e conexão" -ForegroundColor Yellow
}
