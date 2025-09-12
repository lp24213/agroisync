# Script para aplicar configuração no IBM Cloud Code Engine
Write-Host "=== AGROSYNC DEPLOYMENT FIX ===" -ForegroundColor Green
Write-Host ""
Write-Host "PROBLEMA: Ainda aparece a página padrão do nginx" -ForegroundColor Red
Write-Host "SOLUÇÃO: Usar configuração YAML para substituir completamente o conteúdo" -ForegroundColor Yellow
Write-Host ""
Write-Host "PASSOS PARA RESOLVER:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse o IBM Cloud Console" -ForegroundColor White
Write-Host "2. Vá para Code Engine > Projetos" -ForegroundColor White
Write-Host "3. Selecione seu projeto" -ForegroundColor White
Write-Host "4. Vá para Applications > agroisync-web" -ForegroundColor White
Write-Host "5. Clique em 'Edit' ou 'Update'" -ForegroundColor White
Write-Host "6. Altere a configuração para:" -ForegroundColor White
Write-Host ""
Write-Host "   Image: nginx:alpine" -ForegroundColor Yellow
Write-Host "   Port: 8080" -ForegroundColor Yellow
Write-Host "   CPU: 0.25" -ForegroundColor Yellow
Write-Host "   Memory: 0.5Gi" -ForegroundColor Yellow
Write-Host ""
Write-Host "7. Adicione estas Environment Variables:" -ForegroundColor White
Write-Host "   PORT=8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "8. Salve e aguarde o redeploy" -ForegroundColor White
Write-Host ""
Write-Host "ALTERNATIVA: Use o arquivo codeengine-config.yaml" -ForegroundColor Green
Write-Host "Este arquivo contém toda a configuração necessária." -ForegroundColor Green
Write-Host ""
Write-Host "URL para testar:" -ForegroundColor Cyan
Write-Host "https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
