# Teste simples para Cursor em redes domésticas
Write-Host "=== TESTE CURSOR EM REDES DOMESTICAS ===" -ForegroundColor Cyan

# 1. Testar DNS
Write-Host "`n1. Testando DNS..." -ForegroundColor Yellow
$dnsServers = @("8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9")
foreach ($dns in $dnsServers) {
    $result = Test-NetConnection -ComputerName $dns -Port 53 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "OK: $dns" -ForegroundColor Green
    } else {
        Write-Host "FALHOU: $dns" -ForegroundColor Red
    }
}

# 2. Testar sites essenciais
Write-Host "`n2. Testando sites essenciais..." -ForegroundColor Yellow
$sites = @("google.com", "github.com", "npmjs.com", "stackoverflow.com")
foreach ($site in $sites) {
    $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "OK: $site" -ForegroundColor Green
    } else {
        Write-Host "FALHOU: $site" -ForegroundColor Red
    }
}

# 3. Verificar configurações
Write-Host "`n3. Configurações atuais..." -ForegroundColor Yellow
$config = Get-NetIPConfiguration -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
if ($config) {
    Write-Host "IP: $($config.IPv4Address.IPAddress)" -ForegroundColor Cyan
    Write-Host "DNS: $($config.DNSServer.ServerAddresses -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "Configurações não disponíveis" -ForegroundColor Red
}

Write-Host "`nTeste concluído!" -ForegroundColor Green
