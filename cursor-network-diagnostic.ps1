# Script completo de diagnostico e correcao de problemas de rede do Cursor
Write-Host "=== DIAGNOSTICO COMPLETO DE REDE DO CURSOR ===" -ForegroundColor Cyan

# 1. Verificar se o Cursor esta instalado
Write-Host "`n1. VERIFICANDO INSTALACAO DO CURSOR..." -ForegroundColor Yellow
$cursorPaths = @(
    "C:\Users\$env:USERNAME\AppData\Local\Programs\cursor\Cursor.exe",
    "C:\Program Files\Cursor\Cursor.exe",
    "C:\Program Files (x86)\Cursor\Cursor.exe"
)

$cursorFound = $false
foreach ($path in $cursorPaths) {
    if (Test-Path $path) {
        Write-Host "Cursor encontrado em: $path" -ForegroundColor Green
        $cursorFound = $true
        break
    }
}

if (-not $cursorFound) {
    Write-Host "Cursor nao encontrado nos caminhos padrao!" -ForegroundColor Red
    Write-Host "Por favor, instale o Cursor primeiro." -ForegroundColor Red
    exit 1
}

# 2. Verificar conectividade basica
Write-Host "`n2. TESTANDO CONECTIVIDADE BASICA..." -ForegroundColor Yellow
$testSites = @("google.com", "github.com", "api.cursor.sh", "cursor.com")
foreach ($site in $testSites) {
    try {
        $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "✓ $site - OK" -ForegroundColor Green
        } else {
            Write-Host "✗ $site - FALHOU" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $site - ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Verificar configuracoes DNS
Write-Host "`n3. VERIFICANDO CONFIGURACOES DNS..." -ForegroundColor Yellow
$dnsConfig = Get-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4
Write-Host "DNS atual: $($dnsConfig.ServerAddresses -join ', ')" -ForegroundColor Cyan

# 4. Configurar DNS otimizado
Write-Host "`n4. CONFIGURANDO DNS OTIMIZADO..." -ForegroundColor Yellow
try {
    netsh interface ip set dns "Wi-Fi" static 8.8.8.8
    netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
    netsh interface ip add dns "Wi-Fi" 1.1.1.1 index=3
    Write-Host "DNS configurado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar DNS: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Limpar cache DNS e ARP
Write-Host "`n5. LIMPANDO CACHES DE REDE..." -ForegroundColor Yellow
ipconfig /flushdns
arp -d *
Write-Host "Caches limpos!" -ForegroundColor Green

# 6. Configurar firewall (requer admin)
Write-Host "`n6. CONFIGURANDO FIREWALL..." -ForegroundColor Yellow
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if ($isAdmin) {
    try {
        netsh advfirewall firewall add rule name="Cursor Editor Inbound" dir=in action=allow program="$cursorPath" enable=yes
        netsh advfirewall firewall add rule name="Cursor Editor Outbound" dir=out action=allow program="$cursorPath" enable=yes
        Write-Host "Regras do firewall adicionadas!" -ForegroundColor Green
    } catch {
        Write-Host "Erro ao configurar firewall: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Execute como administrador para configurar o firewall automaticamente." -ForegroundColor Yellow
}

# 7. Verificar proxy
Write-Host "`n7. VERIFICANDO CONFIGURACOES DE PROXY..." -ForegroundColor Yellow
$proxySettings = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name ProxyEnable -ErrorAction SilentlyContinue
if ($proxySettings -and $proxySettings.ProxyEnable -eq 1) {
    Write-Host "Proxy habilitado detectado!" -ForegroundColor Yellow
    Write-Host "Considere desabilitar o proxy se estiver causando problemas." -ForegroundColor Yellow
} else {
    Write-Host "Nenhum proxy detectado." -ForegroundColor Green
}

# 8. Testar resolucao DNS
Write-Host "`n8. TESTANDO RESOLUCAO DNS..." -ForegroundColor Yellow
$testDomains = @("google.com", "github.com", "api.cursor.sh")
foreach ($domain in $testDomains) {
    try {
        $result = Resolve-DnsName -Name $domain -ErrorAction Stop
        Write-Host "✓ $domain resolve para: $($result[0].IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Falha ao resolver $domain" -ForegroundColor Red
    }
}

# 9. Verificar configuracoes de rede do Windows
Write-Host "`n9. VERIFICANDO CONFIGURACOES DE REDE..." -ForegroundColor Yellow
$networkAdapter = Get-NetAdapter -Name "Wi-Fi" -ErrorAction SilentlyContinue
if ($networkAdapter) {
    Write-Host "Adaptador Wi-Fi: $($networkAdapter.Status)" -ForegroundColor Cyan
    Write-Host "Velocidade: $($networkAdapter.LinkSpeed)" -ForegroundColor Cyan
} else {
    Write-Host "Adaptador Wi-Fi nao encontrado!" -ForegroundColor Red
}

# 10. Solucoes adicionais
Write-Host "`n=== SOLUCOES ADICIONAIS ===" -ForegroundColor Cyan
Write-Host "1. Reinicie o Cursor completamente" -ForegroundColor White
Write-Host "2. Reinicie o computador se necessario" -ForegroundColor White
Write-Host "3. Configure proxy manualmente no Cursor:" -ForegroundColor White
Write-Host "   - File -> Preferences -> Settings" -ForegroundColor White
Write-Host "   - Procure por 'proxy'" -ForegroundColor White
Write-Host "   - Configure http.proxy como vazio" -ForegroundColor White
Write-Host "4. Teste em modo offline primeiro" -ForegroundColor White
Write-Host "5. Verifique se o antivirus nao esta bloqueando" -ForegroundColor White
Write-Host "6. Tente usar VPN se estiver em rede restritiva" -ForegroundColor White

Write-Host "`n=== DIAGNOSTICO CONCLUIDO ===" -ForegroundColor Green
Write-Host "Tente usar o Cursor em outras redes agora!" -ForegroundColor Green
