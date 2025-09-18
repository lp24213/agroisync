# Script para testar Cursor em redes domésticas específicas
Write-Host "=== TESTE ESPECIFICO PARA REDES DOMESTICAS ===" -ForegroundColor Cyan

# 1. Testar diferentes tipos de DNS
Write-Host "`n1. Testando diferentes DNS..." -ForegroundColor Yellow
$dnsServers = @(
    @{Name="Google DNS"; Primary="8.8.8.8"; Secondary="8.8.4.4"},
    @{Name="Cloudflare DNS"; Primary="1.1.1.1"; Secondary="1.0.0.1"},
    @{Name="OpenDNS"; Primary="208.67.222.222"; Secondary="208.67.220.220"},
    @{Name="Quad9 DNS"; Primary="9.9.9.9"; Secondary="149.112.112.112"}
)

foreach ($dns in $dnsServers) {
    Write-Host "Testando $($dns.Name)..." -ForegroundColor Cyan
    try {
        $result1 = Test-NetConnection -ComputerName $dns.Primary -Port 53 -WarningAction SilentlyContinue
        $result2 = Test-NetConnection -ComputerName $dns.Secondary -Port 53 -WarningAction SilentlyContinue
        
        if ($result1.TcpTestSucceeded -and $result2.TcpTestSucceeded) {
            Write-Host "✓ $($dns.Name) - OK" -ForegroundColor Green
        } else {
            Write-Host "✗ $($dns.Name) - FALHOU" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $($dns.Name) - ERRO" -ForegroundColor Red
    }
}

# 2. Testar conectividade com sites essenciais
Write-Host "`n2. Testando sites essenciais..." -ForegroundColor Yellow
$essentialSites = @(
    "google.com",
    "github.com", 
    "stackoverflow.com",
    "npmjs.com",
    "nodejs.org",
    "microsoft.com",
    "cloudflare.com"
)

foreach ($site in $essentialSites) {
    try {
        $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "✓ $site - OK" -ForegroundColor Green
        } else {
            Write-Host "✗ $site - FALHOU" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $site - ERRO" -ForegroundColor Red
    }
}

# 3. Testar resolução DNS específica
Write-Host "`n3. Testando resolução DNS..." -ForegroundColor Yellow
$testDomains = @("google.com", "github.com", "npmjs.com")
foreach ($domain in $testDomains) {
    try {
        $result = Resolve-DnsName -Name $domain -ErrorAction Stop
        Write-Host "✓ $domain resolve para: $($result[0].IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Falha ao resolver $domain" -ForegroundColor Red
    }
}

# 4. Verificar configurações de rede atual
Write-Host "`n4. Verificando configurações atuais..." -ForegroundColor Yellow
$networkConfig = Get-NetIPConfiguration -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
if ($networkConfig) {
    Write-Host "IP: $($networkConfig.IPv4Address.IPAddress)" -ForegroundColor Cyan
    Write-Host "Gateway: $($networkConfig.IPv4DefaultGateway.NextHop)" -ForegroundColor Cyan
    Write-Host "DNS: $($networkConfig.DNSServer.ServerAddresses -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "Não foi possível obter configurações de rede" -ForegroundColor Red
}

# 5. Testar velocidade de rede
Write-Host "`n5. Testando velocidade de rede..." -ForegroundColor Yellow
try {
    $pingResult = Test-Connection -ComputerName "google.com" -Count 4 -Quiet
    if ($pingResult) {
        Write-Host "✓ Ping para Google - OK" -ForegroundColor Green
    } else {
        Write-Host "✗ Ping para Google - FALHOU" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Erro no teste de ping" -ForegroundColor Red
}

# 6. Verificar adaptador de rede
Write-Host "`n6. Verificando adaptador de rede..." -ForegroundColor Yellow
$adapter = Get-NetAdapter -Name "Wi-Fi" -ErrorAction SilentlyContinue
if ($adapter) {
    Write-Host "Status: $($adapter.Status)" -ForegroundColor Cyan
    Write-Host "Velocidade: $($adapter.LinkSpeed)" -ForegroundColor Cyan
    Write-Host "Driver: $($adapter.DriverVersion)" -ForegroundColor Cyan
} else {
    Write-Host "Adaptador Wi-Fi não encontrado!" -ForegroundColor Red
}

Write-Host "`n=== TESTE CONCLUIDO ===" -ForegroundColor Green
Write-Host "Se algum teste falhou, execute o script definitivo como administrador!" -ForegroundColor Yellow
