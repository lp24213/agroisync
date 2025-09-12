# Script para CRIAR a aplicacao que FUNCIONA
Write-Host "=== CRIANDO APLICACAO QUE FUNCIONA ===" -ForegroundColor Green
Write-Host ""

Write-Host "PROBLEMA: Aplicacao agroisync-web nao esta funcionando (404)" -ForegroundColor Red
Write-Host "SOLUCAO: Criar uma aplicacao simples que FUNCIONE" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== SOLUCAO DEFINITIVA ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
Write-Host "2. Selecione seu projeto" -ForegroundColor White
Write-Host "3. Vá para Applications" -ForegroundColor White
Write-Host "4. Clique em 'Create application'" -ForegroundColor White
Write-Host "5. Configure EXATAMENTE assim:" -ForegroundColor White
Write-Host ""
Write-Host "   Application name: agroisync-web" -ForegroundColor Yellow
Write-Host "   Image: nginx:alpine" -ForegroundColor Yellow
Write-Host "   Port: 8080" -ForegroundColor Yellow
Write-Host "   CPU: 0.25" -ForegroundColor Yellow
Write-Host "   Memory: 0.5Gi" -ForegroundColor Yellow
Write-Host "   Min scale: 1" -ForegroundColor Yellow
Write-Host "   Max scale: 3" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Clique em 'Environment variables'" -ForegroundColor White
Write-Host "7. Adicione:" -ForegroundColor White
Write-Host "   Name: PORT" -ForegroundColor Yellow
Write-Host "   Value: 8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "8. Clique em 'Create'" -ForegroundColor White
Write-Host "9. Aguarde o deploy (3-5 minutos)" -ForegroundColor White
Write-Host ""
Write-Host "=== ALTERNATIVA MAIS SIMPLES ===" -ForegroundColor Green
Write-Host ""
Write-Host "Se nao funcionar, use esta configuracao ULTRA SIMPLES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Application name: agroisync-web" -ForegroundColor Cyan
Write-Host "   Image: nginx:alpine" -ForegroundColor Cyan
Write-Host "   Port: 80" -ForegroundColor Cyan
Write-Host "   CPU: 0.25" -ForegroundColor Cyan
Write-Host "   Memory: 0.5Gi" -ForegroundColor Cyan
Write-Host ""
Write-Host "SEM environment variables" -ForegroundColor Cyan
Write-Host "SEM volume mounts" -ForegroundColor Cyan
Write-Host "SEM configmaps" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== TESTE ===" -ForegroundColor Green
Write-Host "URL: https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""
Write-Host "Se ainda nao funcionar, o problema pode ser:" -ForegroundColor Red
Write-Host "1. Projeto nao existe" -ForegroundColor Red
Write-Host "2. Regiao errada" -ForegroundColor Red
Write-Host "3. Permissoes insuficientes" -ForegroundColor Red
Write-Host ""
Write-Host "Nesse caso, crie um novo projeto no Code Engine." -ForegroundColor Yellow
