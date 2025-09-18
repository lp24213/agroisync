# Script para executar como ADMINISTRADOR
# Execute: powershell -ExecutionPolicy Bypass -File "cursor-network-admin.ps1"

Write-Host "=== CORRECAO COMPLETA DE REDE DO CURSOR (ADMIN) ===" -ForegroundColor Cyan

# Verificar se esta executando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERRO: Execute este script como ADMINISTRADOR!" -ForegroundColor Red
    Write-Host "Clique com botao direito no PowerShell e selecione 'Executar como administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Executando como administrador - OK!" -ForegroundColor Green

# 1. Encontrar Cursor
Write-Host "`n1. Localizando Cursor..." -ForegroundColor Yellow
$cursorPaths = @(
    "C:\Users\$env:USERNAME\AppData\Local\Programs\cursor\Cursor.exe",
    "C:\Program Files\Cursor\Cursor.exe",
    "C:\Program Files (x86)\Cursor\Cursor.exe"
)

$cursorPath = $null
foreach ($path in $cursorPaths) {
    if (Test-Path $path) {
        $cursorPath = $path
        Write-Host "Cursor encontrado: $path" -ForegroundColor Green
        break
    }
}

if (-not $cursorPath) {
    Write-Host "Cursor nao encontrado!" -ForegroundColor Red
    pause
    exit 1
}

# 2. Configurar DNS otimizado
Write-Host "`n2. Configurando DNS otimizado..." -ForegroundColor Yellow
try {
    netsh interface ip set dns "Wi-Fi" static 8.8.8.8
    netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
    netsh interface ip add dns "Wi-Fi" 1.1.1.1 index=3
    Write-Host "DNS configurado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar DNS: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Limpar todos os caches
Write-Host "`n3. Limpando caches de rede..." -ForegroundColor Yellow
ipconfig /flushdns
ipconfig /release
ipconfig /renew
arp -d *
Write-Host "Caches limpos!" -ForegroundColor Green

# 4. Configurar firewall completo
Write-Host "`n4. Configurando firewall..." -ForegroundColor Yellow
try {
    # Remover regras antigas se existirem
    netsh advfirewall firewall delete rule name="Cursor Editor" 2>$null
    netsh advfirewall firewall delete rule name="Cursor Editor Out" 2>$null
    netsh advfirewall firewall delete rule name="Cursor In" 2>$null
    netsh advfirewall firewall delete rule name="Cursor Out" 2>$null
    
    # Adicionar novas regras
    netsh advfirewall firewall add rule name="Cursor Editor Inbound" dir=in action=allow program="$cursorPath" enable=yes
    netsh advfirewall firewall add rule name="Cursor Editor Outbound" dir=out action=allow program="$cursorPath" enable=yes
    
    # Permitir portas comuns
    netsh advfirewall firewall add rule name="Cursor HTTPS" dir=out action=allow protocol=TCP localport=443
    netsh advfirewall firewall add rule name="Cursor HTTP" dir=out action=allow protocol=TCP localport=80
    
    Write-Host "Firewall configurado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar firewall: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Verificar conectividade
Write-Host "`n5. Testando conectividade..." -ForegroundColor Yellow
$testSites = @("google.com", "github.com", "api.cursor.sh", "cursor.com")
foreach ($site in $testSites) {
    $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "OK: $site" -ForegroundColor Green
    } else {
        Write-Host "FALHOU: $site" -ForegroundColor Red
    }
}

# 6. Configurar proxy do Windows (se necessario)
Write-Host "`n6. Verificando configuracoes de proxy..." -ForegroundColor Yellow
$proxyKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
$proxyEnable = Get-ItemProperty -Path $proxyKey -Name ProxyEnable -ErrorAction SilentlyContinue

if ($proxyEnable -and $proxyEnable.ProxyEnable -eq 1) {
    Write-Host "Proxy detectado! Desabilitando..." -ForegroundColor Yellow
    Set-ItemProperty -Path $proxyKey -Name ProxyEnable -Value 0
    Write-Host "Proxy desabilitado!" -ForegroundColor Green
} else {
    Write-Host "Nenhum proxy detectado." -ForegroundColor Green
}

# 7. Reiniciar servicos de rede
Write-Host "`n7. Reiniciando servicos de rede..." -ForegroundColor Yellow
try {
    Restart-Service -Name "Dnscache" -Force
    Restart-Service -Name "Dhcp" -Force
    Write-Host "Servicos reiniciados!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao reiniciar servicos: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Solucoes finais
Write-Host "`n=== SOLUCOES FINAIS ===" -ForegroundColor Cyan
Write-Host "1. REINICIE O CURSOR COMPLETAMENTE" -ForegroundColor White
Write-Host "2. Se ainda nao funcionar:" -ForegroundColor White
Write-Host "   - Abra Cursor" -ForegroundColor White
Write-Host "   - Ctrl+Shift+P" -ForegroundColor White
Write-Host "   - Digite: 'Preferences: Open Settings'" -ForegroundColor White
Write-Host "   - Procure por 'proxy'" -ForegroundColor White
Write-Host "   - Configure http.proxy como vazio" -ForegroundColor White
Write-Host "3. Teste em modo offline primeiro" -ForegroundColor White
Write-Host "4. Reinicie o computador se necessario" -ForegroundColor White

Write-Host "`n=== CORRECAO CONCLUIDA ===" -ForegroundColor Green
Write-Host "O Cursor deve funcionar em outras redes agora!" -ForegroundColor Green

pause
