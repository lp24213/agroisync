# Script simplificado para corrigir problemas de rede do Cursor
Write-Host "=== CORRECAO DE REDE DO CURSOR ===" -ForegroundColor Cyan

# 1. Verificar Cursor
Write-Host "`n1. Verificando instalacao do Cursor..." -ForegroundColor Yellow
$cursorPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\cursor\Cursor.exe"
if (Test-Path $cursorPath) {
    Write-Host "Cursor encontrado!" -ForegroundColor Green
} else {
    Write-Host "Cursor nao encontrado!" -ForegroundColor Red
    exit 1
}

# 2. Testar conectividade
Write-Host "`n2. Testando conectividade..." -ForegroundColor Yellow
$sites = @("google.com", "github.com", "api.cursor.sh")
foreach ($site in $sites) {
    $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "OK: $site" -ForegroundColor Green
    } else {
        Write-Host "FALHOU: $site" -ForegroundColor Red
    }
}

# 3. Configurar DNS
Write-Host "`n3. Configurando DNS..." -ForegroundColor Yellow
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
Write-Host "DNS configurado!" -ForegroundColor Green

# 4. Limpar cache
Write-Host "`n4. Limpando cache DNS..." -ForegroundColor Yellow
ipconfig /flushdns
Write-Host "Cache limpo!" -ForegroundColor Green

# 5. Configurar firewall
Write-Host "`n5. Configurando firewall..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="Cursor In" dir=in action=allow program="$cursorPath" enable=yes
netsh advfirewall firewall add rule name="Cursor Out" dir=out action=allow program="$cursorPath" enable=yes
Write-Host "Firewall configurado!" -ForegroundColor Green

# 6. Solucoes
Write-Host "`n=== SOLUCOES ===" -ForegroundColor Cyan
Write-Host "1. Reinicie o Cursor" -ForegroundColor White
Write-Host "2. Configure proxy vazio no Cursor:" -ForegroundColor White
Write-Host "   Settings -> proxy -> http.proxy = vazio" -ForegroundColor White
Write-Host "3. Teste em modo offline" -ForegroundColor White

Write-Host "`nCorrecao concluida!" -ForegroundColor Green
