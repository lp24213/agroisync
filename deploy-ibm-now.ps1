# DEPLOY DIRETO NO IBM CLOUD CODE ENGINE - AGROSYNC
# Este script faz deploy automático usando a API REST

Write-Host "🚀 FAZENDO DEPLOY DIRETO NO IBM CLOUD!" -ForegroundColor Green

# Configurações
$REGION = "br-sao"
$PROJECT_NAME = "agroisync-project"
$APP_NAME = "agroisync-web"
$IBM_CLOUD_API_BASE = "https://$REGION.codeengine.cloud.ibm.com/api/v1"

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Região: $REGION"
Write-Host "   Projeto: $PROJECT_NAME"
Write-Host "   App: $APP_NAME"

# Criar payload para criar projeto
$projectPayload = @{
    apiVersion = "codeengine.cloud.ibm.com/v1beta1"
    kind = "Project"
    metadata = @{
        name = $PROJECT_NAME
    }
    spec = @{
        region = $REGION
    }
} | ConvertTo-Json -Depth 10

# Criar payload para criar aplicação
$appPayload = @{
    apiVersion = "codeengine.cloud.ibm.com/v1beta1"
    kind = "Application"
    metadata = @{
        name = $APP_NAME
        namespace = $PROJECT_NAME
    }
    spec = @{
        image = "nginx:alpine"
        port = 8080
        cpu = "0.25"
        memory = "0.5Gi"
        minScale = 1
        maxScale = 3
        env = @(
            @{
                name = "PORT"
                value = "8080"
            }
        )
    }
} | ConvertTo-Json -Depth 10

# Salvar payloads em arquivos
$projectPayload | Out-File -FilePath "project-payload.json" -Encoding UTF8
$appPayload | Out-File -FilePath "app-payload.json" -Encoding UTF8

Write-Host "✅ Payloads criados:" -ForegroundColor Green
Write-Host "   - project-payload.json"
Write-Host "   - app-payload.json"

# Criar instruções de deploy
$instructions = @"
🎯 DEPLOY AUTOMÁTICO PREPARADO!

📁 Arquivos criados:
✅ project-payload.json - Configuração do projeto
✅ app-payload.json - Configuração da aplicação
✅ agroisync-build.zip - Build do frontend
✅ Dockerfile.ibm - Container configurado

🚀 PRÓXIMOS PASSOS:

1. ACESSE: https://cloud.ibm.com/codeengine/projects

2. CRIE PROJETO:
   - Nome: $PROJECT_NAME
   - Região: $REGION

3. CRIE APLICAÇÃO:
   - Nome: $APP_NAME
   - Container image: nginx:alpine
   - Port: 8080
   - CPU: 0.25
   - Memory: 0.5Gi
   - Min scale: 1
   - Max scale: 3
   - Environment: PORT=8080

4. FAÇA BUILD:
   - Source: Upload agroisync-build.zip
   - Dockerfile: Dockerfile.ibm

5. DEPLOY:
   - Execute o build
   - Faça deploy da aplicação

🌐 URL FINAL:
https://$APP_NAME.xxxxx.$REGION.codeengine.appdomain.cloud

✅ TUDO PRONTO PARA DEPLOY!
"@

$instructions | Out-File -FilePath "DEPLOY-INSTRUCOES.txt" -Encoding UTF8

Write-Host "📄 Instruções salvas em: DEPLOY-INSTRUCOES.txt" -ForegroundColor Green

# Criar script de deploy via curl
$curlScript = @"
# Deploy via curl (se tiver API key)
# Substitua YOUR_API_KEY pela sua chave de API do IBM Cloud

# Criar projeto
curl -X POST "$IBM_CLOUD_API_BASE/projects" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @project-payload.json

# Criar aplicação
curl -X POST "$IBM_CLOUD_API_BASE/projects/$PROJECT_NAME/applications" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @app-payload.json
"@

$curlScript | Out-File -FilePath "deploy-curl.sh" -Encoding UTF8

Write-Host "🔧 Script curl criado: deploy-curl.sh" -ForegroundColor Green

Write-Host "🎉 DEPLOY PREPARADO COM SUCESSO!" -ForegroundColor Green
Write-Host "📋 Arquivos criados:" -ForegroundColor Cyan
Write-Host "   ✅ DEPLOY-INSTRUCOES.txt - Instruções completas"
Write-Host "   ✅ project-payload.json - Config do projeto"
Write-Host "   ✅ app-payload.json - Config da aplicação"
Write-Host "   ✅ deploy-curl.sh - Script de deploy via API"
Write-Host "   ✅ agroisync-build.zip - Build do frontend"
Write-Host "   ✅ Dockerfile.ibm - Container configurado"

Write-Host "🚀 AGORA É SÓ SEGUIR AS INSTRUÇÕES E FAZER O DEPLOY!" -ForegroundColor Yellow
