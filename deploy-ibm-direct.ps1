# Deploy direto para IBM Cloud Code Engine
# Este script faz deploy do AgroSync para IBM Cloud

Write-Host "🚀 Iniciando deploy direto para IBM Cloud Code Engine..." -ForegroundColor Green

# Configurações do IBM Cloud
$IBM_CLOUD_REGION = "br-sao"
$PROJECT_NAME = "agroisync-project"
$APP_NAME = "agroisync-web"
$NAMESPACE = "agroisync-namespace"

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Região: $IBM_CLOUD_REGION"
Write-Host "   Projeto: $PROJECT_NAME"
Write-Host "   App: $APP_NAME"
Write-Host "   Namespace: $NAMESPACE"

# Verificar se o build existe
if (!(Test-Path "build")) {
    Write-Host "❌ Pasta build não encontrada! Execute 'npm run build:production' primeiro." -ForegroundColor Red
    exit 1
}

# Criar arquivo de configuração para IBM Cloud Code Engine
$codeEngineConfig = @"
apiVersion: codeengine.cloud.ibm.com/v1beta1
kind: Project
metadata:
  name: $PROJECT_NAME
spec:
  region: $IBM_CLOUD_REGION
---
apiVersion: codeengine.cloud.ibm.com/v1beta1
kind: Application
metadata:
  name: $APP_NAME
  namespace: $PROJECT_NAME
spec:
  image: nginx:alpine
  port: 8080
  cpu: 0.25
  memory: 0.5Gi
  minScale: 1
  maxScale: 3
  env:
    - name: PORT
      value: "8080"
"@

$codeEngineConfig | Out-File -FilePath "codeengine-deploy.yaml" -Encoding UTF8

Write-Host "✅ Arquivo de configuração criado: codeengine-deploy.yaml" -ForegroundColor Green

# Criar Dockerfile otimizado para IBM Cloud
$dockerfileContent = @"
FROM nginx:alpine

# Copiar arquivos do build
COPY build/ /usr/share/nginx/html/

# Configurar nginx para porta 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Expor porta 8080
EXPOSE 8080

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
"@

$dockerfileContent | Out-File -FilePath "Dockerfile.ibm" -Encoding UTF8

Write-Host "✅ Dockerfile criado: Dockerfile.ibm" -ForegroundColor Green

# Criar script de deploy manual
$deployScript = @"
# ===== DEPLOY MANUAL PARA IBM CLOUD =====

1. Acesse: https://cloud.ibm.com/codeengine/projects
2. Crie um novo projeto na região $IBM_CLOUD_REGION
3. Nome do projeto: $PROJECT_NAME
4. Após criar o projeto:
   - Vá em "Applications"
   - Clique em "Create application"
   - Nome: $APP_NAME
   - Container image: nginx:alpine
   - Port: 8080
   - CPU: 0.25
   - Memory: 0.5Gi
   - Min scale: 1
   - Max scale: 3
   - Environment variables:
     * PORT = 8080

5. Após criar a aplicação:
   - Vá em "Builds"
   - Clique em "Create build"
   - Nome: agroisync-build
   - Source: Upload local files
   - Faça upload do arquivo: agroisync-build.zip
   - Dockerfile: Dockerfile.ibm

6. Execute o build e depois faça deploy da aplicação

URL final será: https://$APP_NAME.xxxxx.$IBM_CLOUD_REGION.codeengine.appdomain.cloud
"@

$deployScript | Out-File -FilePath "INSTRUCOES-DEPLOY-MANUAL.txt" -Encoding UTF8

Write-Host "✅ Instruções de deploy criadas: INSTRUCOES-DEPLOY-MANUAL.txt" -ForegroundColor Green

Write-Host "🎯 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects"
Write-Host "2. Siga as instruções em: INSTRUCOES-DEPLOY-MANUAL.txt"
Write-Host "3. Use os arquivos criados:"
Write-Host "   - agroisync-build.zip (build do frontend)"
Write-Host "   - Dockerfile.ibm (configuração do container)"
Write-Host "   - codeengine-deploy.yaml (configuração do projeto)"

Write-Host "✅ Deploy preparado com sucesso!" -ForegroundColor Green
