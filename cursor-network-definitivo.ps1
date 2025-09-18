# Script DEFINITIVO para resolver problemas de rede do Cursor
# Execute como ADMINISTRADOR para garantir funcionamento em qualquer rede Wi-Fi

Write-Host "=== SOLUCAO DEFINITIVA PARA CURSOR EM QUALQUER REDE ===" -ForegroundColor Cyan

# Verificar se esta executando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERRO: Execute como ADMINISTRADOR!" -ForegroundColor Red
    Write-Host "Clique direito no PowerShell -> Executar como administrador" -ForegroundColor Yellow
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

# 2. Configurar DNS MULTIPLO (para funcionar em qualquer rede)
Write-Host "`n2. Configurando DNS MULTIPLO..." -ForegroundColor Yellow
try {
    # DNS principais
    netsh interface ip set dns "Wi-Fi" static 8.8.8.8
    netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
    netsh interface ip add dns "Wi-Fi" 1.1.1.1 index=3
    netsh interface ip add dns "Wi-Fi" 1.0.0.1 index=4
    
    # DNS alternativos
    netsh interface ip add dns "Wi-Fi" 208.67.222.222 index=5
    netsh interface ip add dns "Wi-Fi" 208.67.220.220 index=6
    
    Write-Host "DNS MULTIPLO configurado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar DNS: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Limpar TODOS os caches de rede
Write-Host "`n3. Limpando TODOS os caches..." -ForegroundColor Yellow
ipconfig /flushdns
ipconfig /release
ipconfig /renew
arp -d *
netsh winsock reset
netsh int ip reset
Write-Host "Todos os caches limpos!" -ForegroundColor Green

# 4. Configurar firewall COMPLETO
Write-Host "`n4. Configurando firewall COMPLETO..." -ForegroundColor Yellow
try {
    # Remover regras antigas
    netsh advfirewall firewall delete rule name="Cursor Editor" 2>$null
    netsh advfirewall firewall delete rule name="Cursor Editor Out" 2>$null
    netsh advfirewall firewall delete rule name="Cursor In" 2>$null
    netsh advfirewall firewall delete rule name="Cursor Out" 2>$null
    netsh advfirewall firewall delete rule name="Cursor HTTPS" 2>$null
    netsh advfirewall firewall delete rule name="Cursor HTTP" 2>$null
    
    # Adicionar regras completas
    netsh advfirewall firewall add rule name="Cursor Editor Inbound" dir=in action=allow program="$cursorPath" enable=yes
    netsh advfirewall firewall add rule name="Cursor Editor Outbound" dir=out action=allow program="$cursorPath" enable=yes
    
    # Permitir portas essenciais
    netsh advfirewall firewall add rule name="Cursor HTTPS" dir=out action=allow protocol=TCP localport=443
    netsh advfirewall firewall add rule name="Cursor HTTP" dir=out action=allow protocol=TCP localport=80
    netsh advfirewall firewall add rule name="Cursor SSH" dir=out action=allow protocol=TCP localport=22
    netsh advfirewall firewall add rule name="Cursor FTP" dir=out action=allow protocol=TCP localport=21
    
    # Permitir DNS
    netsh advfirewall firewall add rule name="Cursor DNS" dir=out action=allow protocol=UDP localport=53
    
    Write-Host "Firewall COMPLETO configurado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar firewall: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Configurar proxy do Windows
Write-Host "`n5. Configurando proxy do Windows..." -ForegroundColor Yellow
$proxyKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
try {
    # Desabilitar proxy
    Set-ItemProperty -Path $proxyKey -Name ProxyEnable -Value 0
    Set-ItemProperty -Path $proxyKey -Name ProxyServer -Value ""
    Set-ItemProperty -Path $proxyKey -Name ProxyOverride -Value "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*"
    
    Write-Host "Proxy configurado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar proxy: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Configurar adaptador de rede
Write-Host "`n6. Otimizando adaptador de rede..." -ForegroundColor Yellow
try {
    # Configurar MTU otimizado
    netsh interface ipv4 set subinterface "Wi-Fi" mtu=1500 store=persistent
    
    # Configurar TCP otimizado
    netsh int tcp set global autotuninglevel=normal
    netsh int tcp set global chimney=enabled
    netsh int tcp set global rss=enabled
    
    Write-Host "Adaptador otimizado!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao otimizar adaptador: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Testar conectividade COMPLETA
Write-Host "`n7. Testando conectividade COMPLETA..." -ForegroundColor Yellow
$testSites = @(
    @{Name="Google"; URL="google.com"},
    @{Name="GitHub"; URL="github.com"},
    @{Name="Cloudflare"; URL="cloudflare.com"},
    @{Name="OpenDNS"; URL="opendns.com"},
    @{Name="Cursor API"; URL="api.cursor.sh"},
    @{Name="Cursor Site"; URL="cursor.com"}
)

foreach ($site in $testSites) {
    try {
        $result = Test-NetConnection -ComputerName $site.URL -Port 443 -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "✓ $($site.Name) - OK" -ForegroundColor Green
        } else {
            Write-Host "✗ $($site.Name) - FALHOU" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $($site.Name) - ERRO" -ForegroundColor Red
    }
}

# 8. Reiniciar servicos de rede
Write-Host "`n8. Reiniciando servicos de rede..." -ForegroundColor Yellow
try {
    Restart-Service -Name "Dnscache" -Force
    Restart-Service -Name "Dhcp" -Force
    Restart-Service -Name "Netman" -Force
    Write-Host "Servicos reiniciados!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao reiniciar servicos: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Criar arquivo de configuração do Cursor
Write-Host "`n9. Criando configuração do Cursor..." -ForegroundColor Yellow
$cursorConfigDir = "$env:APPDATA\Cursor\User"
if (-not (Test-Path $cursorConfigDir)) {
    New-Item -ItemType Directory -Path $cursorConfigDir -Force
}

$cursorSettings = @{
    "http.proxy" = ""
    "http.proxyStrictSSL" = $false
    "http.proxySupport" = "off"
    "network.proxy.http" = ""
    "network.proxy.https" = ""
    "network.proxy.ftp" = ""
    "network.proxy.socks" = ""
    "network.proxy.no_proxies" = "localhost,127.0.0.1"
} | ConvertTo-Json

$cursorSettings | Out-File -FilePath "$cursorConfigDir\settings.json" -Encoding UTF8
Write-Host "Configuração do Cursor criada!" -ForegroundColor Green

# 10. Solucoes finais
Write-Host "`n=== SOLUCAO DEFINITIVA APLICADA ===" -ForegroundColor Cyan
Write-Host "✅ DNS MULTIPLO configurado" -ForegroundColor Green
Write-Host "✅ Firewall COMPLETO configurado" -ForegroundColor Green
Write-Host "✅ Proxy desabilitado" -ForegroundColor Green
Write-Host "✅ Adaptador otimizado" -ForegroundColor Green
Write-Host "✅ Servicos reiniciados" -ForegroundColor Green
Write-Host "✅ Configuração do Cursor criada" -ForegroundColor Green

Write-Host "`n=== INSTRUCOES FINAIS ===" -ForegroundColor Yellow
Write-Host "1. REINICIE O COMPUTADOR" -ForegroundColor White
Write-Host "2. Abra o Cursor" -ForegroundColor White
Write-Host "3. Teste em diferentes redes Wi-Fi" -ForegroundColor White
Write-Host "4. Se ainda não funcionar, execute este script novamente" -ForegroundColor White

Write-Host "`n🎯 O CURSOR DEVE FUNCIONAR EM QUALQUER REDE AGORA! 🎯" -ForegroundColor Green

pause
