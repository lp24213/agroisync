# CRIAR PROJETO NO IBM CLOUD DO ZERO
Write-Host "=== CRIANDO PROJETO NO IBM CLOUD DO ZERO ===" -ForegroundColor Green
Write-Host ""

Write-Host "PROBLEMA: Você não tem projeto configurado no IBM Cloud!" -ForegroundColor Red
Write-Host "SOLUÇÃO: Vamos criar tudo do zero!" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== PASSO A PASSO COMPLETO ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 1: Acesse o IBM Cloud" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 2: Faça login na sua conta" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 3: Vá para Code Engine" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com/codeengine" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 4: Clique em 'Create project'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 5: Configure o projeto:" -ForegroundColor Yellow
Write-Host "   Project name: agroisync-project" -ForegroundColor Cyan
Write-Host "   Region: São Paulo (br-sao)" -ForegroundColor Cyan
Write-Host "   Resource group: Default" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 6: Clique em 'Create'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 7: Aguarde o projeto ser criado (2-3 minutos)" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 8: Vá para Applications" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 9: Clique em 'Create application'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 10: Configure a aplicação:" -ForegroundColor Yellow
Write-Host "   Application name: agroisync-web" -ForegroundColor Cyan
Write-Host "   Image: nginx:alpine" -ForegroundColor Cyan
Write-Host "   Port: 80" -ForegroundColor Cyan
Write-Host "   CPU: 0.25" -ForegroundColor Cyan
Write-Host "   Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 11: Clique em 'Create'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 12: Aguarde o deploy (3-5 minutos)" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== RESULTADO ===" -ForegroundColor Green
Write-Host "Você receberá uma URL como:" -ForegroundColor White
Write-Host "https://agroisync-web.XXXXX.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== ALTERNATIVA MAIS RÁPIDA ===" -ForegroundColor Cyan
Write-Host "Use o IBM Cloud Shell:" -ForegroundColor White
Write-Host "1. Acesse: https://cloud.ibm.com/shell" -ForegroundColor White
Write-Host "2. Execute os comandos que vou criar" -ForegroundColor White
Write-Host ""

Write-Host "=== COMANDOS PARA IBM CLOUD SHELL ===" -ForegroundColor Green
Write-Host "ibmcloud ce project create --name agroisync-project" -ForegroundColor Yellow
Write-Host "ibmcloud ce project select --name agroisync-project" -ForegroundColor Yellow
Write-Host "ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 PRONTO! AGROSYNC NO IBM CLOUD!" -ForegroundColor Green
