# SCRIPT PARA ADICIONAR DNS DO GOOGLE WORKSPACE NA CLOUDFLARE
$Token = "tfp79lPBfCMx9JdURiC6-us0T30nPrK8KkT45yA7"

# Headers
$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

# 1. Buscar Zone ID do agroisync.com
Write-Host "Buscando Zone ID..." -ForegroundColor Cyan
try {
    $zones = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=agroisync.com" -Headers $Headers -Method Get

    if ($zones.success -and $zones.result.Count -gt 0) {
        $ZoneId = $zones.result[0].id
        Write-Host "Zone ID encontrado: $ZoneId" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Zone nao encontrada" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
    exit 1
}

# 2. Remover MX antigos
Write-Host "`nRemovendo MX antigos..." -ForegroundColor Yellow
try {
    $existingRecords = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?type=MX" -Headers $Headers -Method Get

    foreach ($record in $existingRecords.result) {
        Write-Host "  Removendo: $($record.content)" -ForegroundColor Gray
        Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$($record.id)" -Headers $Headers -Method Delete | Out-Null
    }
    Write-Host "MX antigos removidos!" -ForegroundColor Green
} catch {
    Write-Host "Aviso: Erro ao remover MX antigos (podem nao existir)" -ForegroundColor Gray
}

# 3. Adicionar MX do Google
Write-Host "`nAdicionando registros MX do Google..." -ForegroundColor Cyan

$mxRecords = @(
    @{ priority = 1; content = "ASPMX.L.GOOGLE.COM" },
    @{ priority = 5; content = "ALT1.ASPMX.L.GOOGLE.COM" },
    @{ priority = 5; content = "ALT2.ASPMX.L.GOOGLE.COM" },
    @{ priority = 10; content = "ALT3.ASPMX.L.GOOGLE.COM" },
    @{ priority = 10; content = "ALT4.ASPMX.L.GOOGLE.COM" }
)

foreach ($mx in $mxRecords) {
    $body = @{
        type = "MX"
        name = "@"
        content = $mx.content
        priority = $mx.priority
        ttl = 3600
    } | ConvertTo-Json

    try {
        $result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records" -Headers $Headers -Method Post -Body $body
        
        if ($result.success) {
            Write-Host "  OK: MX $($mx.content) (prioridade $($mx.priority))" -ForegroundColor Green
        } else {
            Write-Host "  ERRO: $($result.errors[0].message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ERRO: $_" -ForegroundColor Red
    }
}

# 4. Adicionar TXT (SPF)
Write-Host "`nAdicionando SPF..." -ForegroundColor Cyan

# Remover SPF antigo se existir
try {
    $existingTxt = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?type=TXT&name=agroisync.com" -Headers $Headers -Method Get
    foreach ($record in $existingTxt.result) {
        if ($record.content -like "v=spf1*") {
            Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$($record.id)" -Headers $Headers -Method Delete | Out-Null
        }
    }
} catch {}

$spfBody = @{
    type = "TXT"
    name = "@"
    content = "v=spf1 include:_spf.google.com ~all"
    ttl = 3600
} | ConvertTo-Json

try {
    $spfResult = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records" -Headers $Headers -Method Post -Body $spfBody

    if ($spfResult.success) {
        Write-Host "  OK: SPF criado!" -ForegroundColor Green
    } else {
        Write-Host "  ERRO: $($spfResult.errors[0].message)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERRO: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PRONTO! Registros DNS adicionados!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nProximo passo:" -ForegroundColor Yellow
Write-Host "1. Volte no Google Workspace" -ForegroundColor White
Write-Host "2. Clique em 'Verificar' ou 'Ativar Gmail'" -ForegroundColor White
Write-Host "3. Aguarde 5-30 minutos para propagacao DNS" -ForegroundColor White
Write-Host "`nPara DKIM: pegue o valor no Google e adicione manualmente" -ForegroundColor Gray
