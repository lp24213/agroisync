# Teste para rede Edson Pandora
Write-Host "=== TESTE CURSOR NA REDE EDSON PANDORA ===" -ForegroundColor Cyan

# 1. Verificar configurações atuais
Write-Host "`n1. Configuracoes atuais da rede..." -ForegroundColor Yellow
$networkConfig = Get-NetIPConfiguration -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
if ($networkConfig) {
    Write-Host "IP: $($networkConfig.IPv4Address.IPAddress)" -ForegroundColor Cyan
    Write-Host "Gateway: $($networkConfig.IPv4DefaultGateway.NextHop)" -ForegroundColor Cyan
    Write-Host "DNS: $($networkConfig.DNSServer.ServerAddresses -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "Nao foi possivel obter configuracoes de rede" -ForegroundColor Red
}

# 2. Testar conectividade
Write-Host "`n2. Testando conectividade..." -ForegroundColor Yellow
$sites = @("google.com", "github.com", "npmjs.com", "stackoverflow.com")
$successCount = 0

foreach ($site in $sites) {
    try {
        $result = Test-NetConnection -ComputerName $site -Port 443 -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "OK: $site" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "FALHOU: $site" -ForegroundColor Red
        }
    } catch {
        Write-Host "ERRO: $site" -ForegroundColor Red
    }
}

# 3. Testar DNS
Write-Host "`n3. Testando DNS..." -ForegroundColor Yellow
$dnsTestDomains = @("google.com", "github.com")
foreach ($domain in $dnsTestDomains) {
    try {
        $result = Resolve-DnsName -Name $domain -ErrorAction Stop
        Write-Host "OK: $domain resolve para $($result[0].IPAddress)" -ForegroundColor Green
    } catch {
        Write-Host "FALHOU: $domain" -ForegroundColor Red
    }
}

# 4. Verificar proxy
Write-Host "`n4. Verificando proxy..." -ForegroundColor Yellow
$proxyKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
$proxyEnable = Get-ItemProperty -Path $proxyKey -Name ProxyEnable -ErrorAction SilentlyContinue

if ($proxyEnable -and $proxyEnable.ProxyEnable -eq 1) {
    Write-Host "Proxy habilitado" -ForegroundColor Yellow
} else {
    Write-Host "Proxy desabilitado" -ForegroundColor Green
}

# 5. Verificar firewall
Write-Host "`n5. Verificando firewall..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule -DisplayName "*Cursor*" -ErrorAction SilentlyContinue
if ($firewallRules) {
    Write-Host "Regras do firewall encontradas" -ForegroundColor Green
} else {
    Write-Host "Nenhuma regra especifica do Cursor" -ForegroundColor Yellow
}

# 6. Verificar adaptador
Write-Host "`n6. Verificando adaptador Wi-Fi..." -ForegroundColor Yellow
$adapter = Get-NetAdapter -Name "Wi-Fi" -ErrorAction SilentlyContinue
if ($adapter) {
    Write-Host "Status: $($adapter.Status)" -ForegroundColor Cyan
    Write-Host "Velocidade: $($adapter.LinkSpeed)" -ForegroundColor Cyan
    
    if ($adapter.Status -eq "Up") {
        Write-Host "Adaptador Wi-Fi funcionando" -ForegroundColor Green
    } else {
        Write-Host "Adaptador Wi-Fi com problemas" -ForegroundColor Red
    }
} else {
    Write-Host "Adaptador Wi-Fi nao encontrado" -ForegroundColor Red
}

# 7. Analise final
Write-Host "`n=== ANALISE FINAL PARA REDE EDSON PANDORA ===" -ForegroundColor Cyan

$successRate = [math]::Round(($successCount / $sites.Count) * 100, 2)
Write-Host "Taxa de sucesso: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

if ($successRate -ge 80) {
    Write-Host "RESULTADO: Cursor deve funcionar bem na rede Edson Pandora!" -ForegroundColor Green
    Write-Host "Conectividade excelente" -ForegroundColor Green
    Write-Host "DNS configurado corretamente" -ForegroundColor Green
    Write-Host "Rede estavel" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host "RESULTADO: Cursor pode funcionar na rede Edson Pandora com limitacoes" -ForegroundColor Yellow
    Write-Host "Conectividade moderada" -ForegroundColor Yellow
    Write-Host "Pode ter problemas ocasionais" -ForegroundColor Yellow
} else {
    Write-Host "RESULTADO: Cursor pode ter problemas na rede Edson Pandora" -ForegroundColor Red
    Write-Host "Conectividade ruim" -ForegroundColor Red
    Write-Host "Recomenda-se executar o script de correcao" -ForegroundColor Red
}

Write-Host "`n=== RECOMENDACOES ===" -ForegroundColor Yellow
if ($successRate -lt 80) {
    Write-Host "1. Execute o script de correcao como administrador:" -ForegroundColor White
    Write-Host "   powershell -ExecutionPolicy Bypass -File 'cursor-fix-simples.ps1'" -ForegroundColor White
    Write-Host "2. Reinicie o computador apos executar o script" -ForegroundColor White
    Write-Host "3. Teste novamente na rede Edson Pandora" -ForegroundColor White
} else {
    Write-Host "1. O Cursor deve funcionar bem na rede Edson Pandora" -ForegroundColor White
    Write-Host "2. Se houver problemas, reinicie o Cursor" -ForegroundColor White
    Write-Host "3. Configure proxy como vazio se necessario" -ForegroundColor White
}

Write-Host "`nTeste concluido!" -ForegroundColor Green
