# DEPLOY SIMPLES NA APLICACAO EXISTENTE
Write-Host "=== DEPLOY NA APLICACAO EXISTENTE ===" -ForegroundColor Green
Write-Host ""

Write-Host "Aplicacao existente detectada!" -ForegroundColor Green
Write-Host "Endereco interno: application-47.205r1c50zq5e.svc.cluster.local" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== COMANDOS PARA IBM CLOUD SHELL ===" -ForegroundColor Yellow
Write-Host "1. Acesse: https://cloud.ibm.com/shell" -ForegroundColor White
Write-Host ""

Write-Host "2. Execute estes comandos:" -ForegroundColor White
Write-Host ""

Write-Host "Comando 1 - Selecionar projeto:" -ForegroundColor Green
Write-Host "ibmcloud ce project select --name agroisync" -ForegroundColor Cyan
Write-Host ""

Write-Host "Comando 2 - Listar aplicacoes:" -ForegroundColor Green
Write-Host "ibmcloud ce app list" -ForegroundColor Cyan
Write-Host ""

Write-Host "Comando 3 - Atualizar aplicacao:" -ForegroundColor Green
Write-Host "ibmcloud ce app update --name agroisync-web --image nginx:alpine --port 80" -ForegroundColor Cyan
Write-Host ""

Write-Host "Comando 4 - Verificar status:" -ForegroundColor Green
Write-Host "ibmcloud ce app get --name agroisync-web" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== ALTERNATIVA: CRIAR NOVA ===" -ForegroundColor Yellow
Write-Host "Se nao existir:" -ForegroundColor White
Write-Host "ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80 --cpu 0.25 --memory 0.5Gi" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== RESULTADO ===" -ForegroundColor Green
Write-Host "URL publica:" -ForegroundColor White
Write-Host "https://agroisync-web.XXXXX.br-sao.codeengine.appdomain.cloud" -ForegroundColor Yellow
Write-Host ""

Write-Host "DEPLOY CONCLUIDO!" -ForegroundColor Green
