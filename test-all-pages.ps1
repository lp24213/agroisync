# Script para testar TODAS as páginas do AgroSync
Write-Host "TESTANDO TODAS AS PAGINAS DO AGROISYNC" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$pages = @(
    @{name="Home"; url="https://agroisync.com/"},
    @{name="Login"; url="https://agroisync.com/login"},
    @{name="Register"; url="https://agroisync.com/register"},
    @{name="Produtos"; url="https://agroisync.com/produtos"},
    @{name="Fretes"; url="https://agroisync.com/frete"},
    @{name="Loja"; url="https://agroisync.com/loja"},
    @{name="Planos"; url="https://agroisync.com/planos"},
    @{name="Sobre"; url="https://agroisync.com/sobre"},
    @{name="Parcerias"; url="https://agroisync.com/partnerships"},
    @{name="Tecnologia"; url="https://agroisync.com/tecnologia"},
    @{name="Dashboard"; url="https://agroisync.com/user-dashboard"},
    @{name="Marketplace"; url="https://agroisync.com/marketplace"},
    @{name="AgroConecta"; url="https://agroisync.com/agroconecta"}
)

$results = @()

foreach ($page in $pages) {
    Write-Host "Testando: $($page.name)..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $page.url -Method GET -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host " OK (200)" -ForegroundColor Green
            $results += @{page=$page.name; status="OK"; code=200}
        } else {
            Write-Host " WARNING ($($response.StatusCode))" -ForegroundColor Yellow
            $results += @{page=$page.name; status="WARNING"; code=$response.StatusCode}
        }
    } catch {
        Write-Host " ERRO" -ForegroundColor Red
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{page=$page.name; status="ERROR"; error=$_.Exception.Message}
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "RESUMO DOS TESTES:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

$ok = ($results | Where-Object {$_.status -eq "OK"}).Count
$warning = ($results | Where-Object {$_.status -eq "WARNING"}).Count
$error = ($results | Where-Object {$_.status -eq "ERROR"}).Count

Write-Host "OK: $ok paginas" -ForegroundColor Green
Write-Host "WARNING: $warning paginas" -ForegroundColor Yellow
Write-Host "ERRO: $error paginas" -ForegroundColor Red

if ($error -gt 0) {
    Write-Host ""
    Write-Host "PAGINAS COM ERRO:" -ForegroundColor Red
    $results | Where-Object {$_.status -eq "ERROR"} | ForEach-Object {
        Write-Host "  - $($_.page)" -ForegroundColor Red
    }
}
