# Teste específico para verificar se Cursor funcionará na rede "edson"
Write-Host "=== TESTE CURSOR NA REDE EDSON ===" -ForegroundColor Cyan

# 1. Verificar configurações atuais da rede
Write-Host "`n1. Configurações atuais da rede..." -ForegroundColor Yellow
$networkConfig = Get-NetIPConfiguration -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
if ($networkConfig) {
    Write-Host "IP: $($networkConfig.IPv4Address.IPAddress)" -ForegroundColor Cyan
    Write-Host "Gateway: $($networkConfig.IPv4DefaultGateway.NextHop)" -ForegroundColor Cyan
    Write-Host "DNS: $($networkConfig.DNSServer.ServerAddresses -join ', ')" -ForegroundColor Cyan
    Write-Host "Subnet: $($networkConfig.IPv4Address.PrefixLength)" -ForegroundColor Cyan
} else {
    Write-Host "Não foi possível obter configurações de rede" -ForegroundColor Red
}

# 2. Testar conectividade com sites essenciais para Cursor
Write-Host "`n2. Testando conectividade com sites essenciais..." -ForegroundColor Yellow
$essentialSites = @(
    @{Name="Google"; URL="google.com"; Port=443},
    @{Name="GitHub"; URL="github.com"; Port=443},
    @{Name="NPM"; URL="npmjs.com"; Port=443},
    @{Name="StackOverflow"; URL="stackoverflow.com"; Port=443},
    @{Name="Microsoft"; URL="microsoft.com"; Port=443}
)

$connectivityResults = @()
foreach ($site in $essentialSites) {
    try {
        $result = Test-NetConnection -ComputerName $site.URL -Port $site.Port -WarningAction SilentlyContinue
        $status = if ($result.TcpTestSucceeded) { "OK" } else { "FALHOU" }
        $color = if ($result.TcpTestSucceeded) { "Green" } else { "Red" }
        
        Write-Host "$status: $($site.Name) ($($site.URL))" -ForegroundColor $color
        $connectivityResults += @{Site=$site.Name; Status=$status; Success=$result.TcpTestSucceeded}
    } catch {
        Write-Host "ERRO: $($site.Name) ($($site.URL))" -ForegroundColor Red
        $connectivityResults += @{Site=$site.Name; Status="ERRO"; Success=$false}
    }
}

# 3. Testar resolução DNS
Write-Host "`n3. Testando resolução DNS..." -ForegroundColor Yellow
$dnsTestDomains = @("google.com", "github.com", "npmjs.com")
foreach ($domain in $dnsTestDomains) {
    try {
        $result = Resolve-DnsName -Name $domain -ErrorAction Stop
        Write-Host "✓ $domain resolve para: $($result[0].IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Falha ao resolver $domain" -ForegroundColor Red
    }
}

# 4. Verificar configurações de proxy
Write-Host "`n4. Verificando configurações de proxy..." -ForegroundColor Yellow
$proxyKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
$proxyEnable = Get-ItemProperty -Path $proxyKey -Name ProxyEnable -ErrorAction SilentlyContinue
$proxyServer = Get-ItemProperty -Path $proxyKey -Name ProxyServer -ErrorAction SilentlyContinue

if ($proxyEnable -and $proxyEnable.ProxyEnable -eq 1) {
    Write-Host "⚠️ Proxy habilitado: $($proxyServer.ProxyServer)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Proxy desabilitado" -ForegroundColor Green
}

# 5. Verificar firewall
Write-Host "`n5. Verificando regras do firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule -DisplayName "*Cursor*" -ErrorAction SilentlyContinue
if ($firewallRules) {
    Write-Host "✓ Regras do firewall encontradas:" -ForegroundColor Green
    foreach ($rule in $firewallRules) {
        Write-Host "  - $($rule.DisplayName): $($rule.Enabled)" -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️ Nenhuma regra específica do Cursor encontrada" -ForegroundColor Yellow
}

# 6. Testar velocidade de rede
Write-Host "`n6. Testando velocidade de rede..." -ForegroundColor Yellow
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

# 7. Verificar adaptador de rede
Write-Host "`n7. Verificando adaptador de rede..." -ForegroundColor Yellow
$adapter = Get-NetAdapter -Name "Wi-Fi" -ErrorAction SilentlyContinue
if ($adapter) {
    Write-Host "Status: $($adapter.Status)" -ForegroundColor Cyan
    Write-Host "Velocidade: $($adapter.LinkSpeed)" -ForegroundColor Cyan
    Write-Host "Driver: $($adapter.DriverVersion)" -ForegroundColor Cyan
    
    if ($adapter.Status -eq "Up") {
        Write-Host "✓ Adaptador Wi-Fi funcionando" -ForegroundColor Green
    } else {
        Write-Host "✗ Adaptador Wi-Fi com problemas" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Adaptador Wi-Fi não encontrado!" -ForegroundColor Red
}

# 8. Análise final
Write-Host "`n=== ANÁLISE FINAL PARA REDE EDSON ===" -ForegroundColor Cyan

$successCount = ($connectivityResults | Where-Object { $_.Success -eq $true }).Count
$totalCount = $connectivityResults.Count
$successRate = if ($totalCount -gt 0) { [math]::Round(($successCount / $totalCount) * 100, 2) } else { 0 }

Write-Host "Taxa de sucesso de conectividade: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

if ($successRate -ge 80) {
    Write-Host "🎯 RESULTADO: Cursor deve funcionar bem na rede Edson!" -ForegroundColor Green
    Write-Host "✅ Conectividade excelente" -ForegroundColor Green
    Write-Host "✅ DNS configurado corretamente" -ForegroundColor Green
    Write-Host "✅ Rede estável" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host "⚠️ RESULTADO: Cursor pode funcionar na rede Edson com algumas limitações" -ForegroundColor Yellow
    Write-Host "⚠️ Conectividade moderada" -ForegroundColor Yellow
    Write-Host "⚠️ Pode ter problemas ocasionais" -ForegroundColor Yellow
} else {
    Write-Host "❌ RESULTADO: Cursor pode ter problemas na rede Edson" -ForegroundColor Red
    Write-Host "❌ Conectividade ruim" -ForegroundColor Red
    Write-Host "❌ Recomenda-se executar o script de correção" -ForegroundColor Red
}

Write-Host "`n=== RECOMENDAÇÕES ===" -ForegroundColor Yellow
if ($successRate -lt 80) {
    Write-Host "1. Execute o script de correção como administrador:" -ForegroundColor White
    Write-Host "   powershell -ExecutionPolicy Bypass -File 'cursor-fix-simples.ps1'" -ForegroundColor White
    Write-Host "2. Reinicie o computador após executar o script" -ForegroundColor White
    Write-Host "3. Teste novamente na rede Edson" -ForegroundColor White
} else {
    Write-Host "1. O Cursor deve funcionar bem na rede Edson" -ForegroundColor White
    Write-Host "2. Se houver problemas, reinicie o Cursor" -ForegroundColor White
    Write-Host "3. Configure proxy como vazio se necessário" -ForegroundColor White
}

Write-Host "`nTeste concluído!" -ForegroundColor Green
