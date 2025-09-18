# Script para corrigir problemas de rede do Cursor
Write-Host "CORRIGINDO PROBLEMAS DE REDE DO CURSOR..." -ForegroundColor Yellow

# 1. Adicionar excecao no Firewall para o Cursor
Write-Host "Adicionando excecao no Firewall para o Cursor..." -ForegroundColor Cyan

$cursorPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\cursor\Cursor.exe"
if (Test-Path $cursorPath) {
    netsh advfirewall firewall add rule name="Cursor Editor" dir=in action=allow program="$cursorPath" enable=yes
    netsh advfirewall firewall add rule name="Cursor Editor Out" dir=out action=allow program="$cursorPath" enable=yes
    Write-Host "Excecoes do Firewall adicionadas!" -ForegroundColor Green
} else {
    Write-Host "Cursor nao encontrado no caminho padrao" -ForegroundColor Yellow
}

# 2. Configurar DNS publico
Write-Host "Configurando DNS publico..." -ForegroundColor Cyan
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
Write-Host "DNS configurado!" -ForegroundColor Green

# 3. Limpar cache DNS
Write-Host "Limpando cache DNS..." -ForegroundColor Cyan
ipconfig /flushdns
Write-Host "Cache DNS limpo!" -ForegroundColor Green

# 4. Verificar conectividade
Write-Host "Testando conectividade..." -ForegroundColor Cyan
Test-NetConnection -ComputerName "google.com" -Port 443
Test-NetConnection -ComputerName "github.com" -Port 443

Write-Host ""
Write-Host "SOLUCOES ADICIONAIS:" -ForegroundColor Yellow
Write-Host "1. Reinicie o Cursor completamente" -ForegroundColor White
Write-Host "2. Se ainda nao funcionar, configure proxy manualmente:" -ForegroundColor White
Write-Host "   - File -> Preferences -> Settings" -ForegroundColor White
Write-Host "   - Procure por 'proxy'" -ForegroundColor White
Write-Host "   - Configure http.proxy como vazio" -ForegroundColor White
Write-Host "3. Teste em modo offline primeiro" -ForegroundColor White

Write-Host ""
Write-Host "Script concluido! Tente usar o Cursor em outras redes agora." -ForegroundColor Green
