# EXECUTAR COMANDOS NO IBM CLOUD SHELL
Write-Host "=== EXECUTAR NO IBM CLOUD SHELL ===" -ForegroundColor Green
Write-Host ""

Write-Host "PASSO 1: Acesse o IBM Cloud Shell" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com/shell" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 2: Execute estes comandos um por vez:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Comando 1:" -ForegroundColor Green
Write-Host "ibmcloud ce project select --name agroisync" -ForegroundColor White
Write-Host ""

Write-Host "Comando 2:" -ForegroundColor Green
Write-Host "ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80 --cpu 0.25 --memory 0.5Gi" -ForegroundColor White
Write-Host ""

Write-Host "Comando 3 (opcional - para verificar):" -ForegroundColor Green
Write-Host "ibmcloud ce app get --name agroisync-web" -ForegroundColor White
Write-Host ""

Write-Host "=== RESULTADO ESPERADO ===" -ForegroundColor Cyan
Write-Host "Você receberá uma URL como:" -ForegroundColor White
Write-Host "https://agroisync-web.XXXXX.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== ALTERNATIVA: IBM CLOUD CONSOLE ===" -ForegroundColor Cyan
Write-Host "Se preferir interface gráfica:" -ForegroundColor White
Write-Host "1. Acesse: https://cloud.ibm.com/codeengine" -ForegroundColor White
Write-Host "2. Selecione projeto: agroisync" -ForegroundColor White
Write-Host "3. Vá para Applications" -ForegroundColor White
Write-Host "4. Clique em 'Create application'" -ForegroundColor White
Write-Host "5. Configure:" -ForegroundColor White
Write-Host "   - Application name: agroisync-web" -ForegroundColor Cyan
Write-Host "   - Image: nginx:alpine" -ForegroundColor Cyan
Write-Host "   - Port: 80" -ForegroundColor Cyan
Write-Host "   - CPU: 0.25" -ForegroundColor Cyan
Write-Host "   - Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host "6. Clique em 'Create'" -ForegroundColor White
Write-Host ""

Write-Host "🎉 DEPLOY AGROSYNC NO IBM CLOUD!" -ForegroundColor Green
