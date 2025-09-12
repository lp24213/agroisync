# USAR PROJETO AGROSYNC EXISTENTE
Write-Host "=== USANDO PROJETO AGROSYNC EXISTENTE ===" -ForegroundColor Green
Write-Host ""

Write-Host "PROBLEMA: Você já tem projeto 'agroisync' criado!" -ForegroundColor Yellow
Write-Host "SOLUÇÃO: Vamos usar o projeto existente!" -ForegroundColor Green
Write-Host ""

Write-Host "=== PASSO A PASSO ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 1: Acesse o IBM Cloud" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 2: Vá para Code Engine" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com/codeengine" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 3: Selecione o projeto 'agroisync'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 4: Vá para Applications" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 5: Clique em 'Create application'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 6: Configure a aplicação:" -ForegroundColor Yellow
Write-Host "   Application name: agroisync-web" -ForegroundColor Cyan
Write-Host "   Image: nginx:alpine" -ForegroundColor Cyan
Write-Host "   Port: 80" -ForegroundColor Cyan
Write-Host "   CPU: 0.25" -ForegroundColor Cyan
Write-Host "   Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 7: Clique em 'Create'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 8: Aguarde o deploy (3-5 minutos)" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== COMANDOS PARA IBM CLOUD SHELL ===" -ForegroundColor Green
Write-Host "ibmcloud ce project select --name agroisync" -ForegroundColor Yellow
Write-Host "ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80 --cpu 0.25 --memory 0.5Gi" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== RESULTADO ===" -ForegroundColor Green
Write-Host "Você receberá uma URL como:" -ForegroundColor White
Write-Host "https://agroisync-web.XXXXX.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 AGROSYNC NO PROJETO EXISTENTE!" -ForegroundColor Green
