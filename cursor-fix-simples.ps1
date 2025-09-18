# Script SIMPLES e FUNCIONAL para Cursor
# Execute como ADMINISTRADOR

Write-Host "=== CORRECAO SIMPLES DO CURSOR ===" -ForegroundColor Cyan

# Verificar admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERRO: Execute como ADMINISTRADOR!" -ForegroundColor Red
    Write-Host "1. Clique direito no PowerShell" -ForegroundColor Yellow
    Write-Host "2. Selecione 'Executar como administrador'" -ForegroundColor Yellow
    Write-Host "3. Execute novamente este script" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "OK! Executando como administrador..." -ForegroundColor Green

# 1. Configurar DNS
Write-Host "`n1. Configurando DNS..." -ForegroundColor Yellow
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
netsh interface ip add dns "Wi-Fi" 1.1.1.1 index=3
Write-Host "DNS configurado!" -ForegroundColor Green

# 2. Limpar cache
Write-Host "`n2. Limpando cache..." -ForegroundColor Yellow
ipconfig /flushdns
ipconfig /release
ipconfig /renew
Write-Host "Cache limpo!" -ForegroundColor Green

# 3. Configurar firewall
Write-Host "`n3. Configurando firewall..." -ForegroundColor Yellow
$cursorPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\cursor\Cursor.exe"
if (Test-Path $cursorPath) {
    netsh advfirewall firewall add rule name="Cursor In" dir=in action=allow program="$cursorPath" enable=yes
    netsh advfirewall firewall add rule name="Cursor Out" dir=out action=allow program="$cursorPath" enable=yes
    Write-Host "Firewall configurado!" -ForegroundColor Green
} else {
    Write-Host "Cursor nao encontrado!" -ForegroundColor Red
}

# 4. Desabilitar proxy
Write-Host "`n4. Desabilitando proxy..." -ForegroundColor Yellow
$proxyKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
Set-ItemProperty -Path $proxyKey -Name ProxyEnable -Value 0
Set-ItemProperty -Path $proxyKey -Name ProxyServer -Value ""
Write-Host "Proxy desabilitado!" -ForegroundColor Green

# 5. Testar conectividade
Write-Host "`n5. Testando conectividade..." -ForegroundColor Yellow
$sites = @("google.com", "github.com")
foreach ($site in $sites) {
    $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "OK: $site" -ForegroundColor Green
    } else {
        Write-Host "FALHOU: $site" -ForegroundColor Red
    }
}

# 6. Reiniciar servicos
Write-Host "`n6. Reiniciando servicos..." -ForegroundColor Yellow
Restart-Service -Name "Dnscache" -Force
Write-Host "Servicos reiniciados!" -ForegroundColor Green

Write-Host "`n=== CORRECAO CONCLUIDA ===" -ForegroundColor Green
Write-Host "1. REINICIE O COMPUTADOR" -ForegroundColor White
Write-Host "2. Abra o Cursor" -ForegroundColor White
Write-Host "3. Teste em outras redes Wi-Fi" -ForegroundColor White

Write-Host "`nO CURSOR DEVE FUNCIONAR AGORA!" -ForegroundColor Green
pause
