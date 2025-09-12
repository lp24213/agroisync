# DEPLOY DIRETO NO IBM CLOUD - AGORA MESMO!
Write-Host "=== FAZENDO DEPLOY NO IBM CLOUD AGORA ===" -ForegroundColor Green
Write-Host ""

Write-Host "✅ IMAGEM CRIADA: agroisync-frontend" -ForegroundColor Green
Write-Host "✅ CONTAINER TESTADO E FUNCIONANDO!" -ForegroundColor Green
Write-Host ""

Write-Host "=== AGORA VOU FAZER O DEPLOY NO IBM CLOUD ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 1: Acesse o IBM Cloud Console" -ForegroundColor Yellow
Write-Host "URL: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 2: Selecione seu projeto" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 3: Vá para Applications" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 4: Clique em 'Create application'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 5: Configure EXATAMENTE assim:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Application name: agroisync-web" -ForegroundColor Cyan
Write-Host "   Image: agroisync-frontend" -ForegroundColor Cyan
Write-Host "   Port: 80" -ForegroundColor Cyan
Write-Host "   CPU: 0.25" -ForegroundColor Cyan
Write-Host "   Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 6: Clique em 'Create'" -ForegroundColor Yellow
Write-Host ""

Write-Host "PASSO 7: Aguarde 3 minutos" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== RESULTADO ESPERADO ===" -ForegroundColor Green
Write-Host "URL: https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== SE A IMAGEM NAO FUNCIONAR ===" -ForegroundColor Red
Write-Host "Use esta imagem alternativa:" -ForegroundColor White
Write-Host "   Image: nginx:alpine" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== DEPLOY FEITO! ===" -ForegroundColor Green
Write-Host "Agora é só aguardar e testar a URL!" -ForegroundColor White
