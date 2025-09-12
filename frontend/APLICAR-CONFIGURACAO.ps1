# APLICAR CONFIGURAÇÃO FINAL DO AGROSYNC
Write-Host "=== APLICANDO CONFIGURAÇÃO FINAL ===" -ForegroundColor Green
Write-Host ""

Write-Host "✅ CONFIGURAÇÃO CRIADA!" -ForegroundColor Green
Write-Host ""
Write-Host "=== AGORA FAÇA ISSO NO IBM CLOUD ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse: https://cloud.ibm.com/codeengine/projects" -ForegroundColor White
Write-Host "2. Selecione seu projeto" -ForegroundColor White
Write-Host "3. Vá para Applications" -ForegroundColor White
Write-Host "4. Clique em 'Create application'" -ForegroundColor White
Write-Host "5. Configure EXATAMENTE:" -ForegroundColor White
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
Write-Host "8. Clique em 'Volume mounts'" -ForegroundColor White
Write-Host "9. Adicione:" -ForegroundColor White
Write-Host "   Name: html-content" -ForegroundColor Yellow
Write-Host "   Mount path: /usr/share/nginx/html/index.html" -ForegroundColor Yellow
Write-Host "   Sub path: index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "10. Clique em 'ConfigMaps'" -ForegroundColor White
Write-Host "11. Crie um ConfigMap chamado 'agroisync-html'" -ForegroundColor White
Write-Host "12. Adicione a chave 'index.html' com o conteúdo do arquivo CONFIGURACAO-FINAL.yaml" -ForegroundColor White
Write-Host ""
Write-Host "13. Clique em 'Create'" -ForegroundColor White
Write-Host "14. Aguarde 3-5 minutos" -ForegroundColor White
Write-Host ""
Write-Host "=== TESTE ===" -ForegroundColor Green
Write-Host "URL: https://agroisync-web.205skg1rs46a.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== ALTERNATIVA MAIS SIMPLES ===" -ForegroundColor Cyan
Write-Host "Se não conseguir fazer os ConfigMaps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Use apenas:" -ForegroundColor White
Write-Host "   Image: nginx:alpine" -ForegroundColor Yellow
Write-Host "   Port: 8080" -ForegroundColor Yellow
Write-Host "   Environment: PORT=8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Isso vai mostrar a página padrão do nginx, mas vai funcionar!" -ForegroundColor Yellow
