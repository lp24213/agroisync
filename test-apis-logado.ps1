# Teste de APIs com usuário logado

Write-Host "`n=== TESTE 2: APIs COM USUÁRIO LOGADO ===`n" -ForegroundColor Cyan

# Buscar token
if (Test-Path "last-auth-response.json") {
    $token = (Get-Content last-auth-response.json | ConvertFrom-Json).data.token
    Write-Host "Token encontrado!" -ForegroundColor Green
} else {
    Write-Host "Arquivo de token não encontrado - criando novo usuário..." -ForegroundColor Yellow
    
    $registerData = @{
        email = "teste_apis_$(Get-Date -Format 'yyyyMMddHHmmss')@agroisync.com"
        password = "SenhaSegura123!"
        name = "Usuario Teste APIs"
        phone = "66992362830"
        turnstileToken = "test-token"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "https://agroisync.com/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 201) {
        $result = $response.Content | ConvertFrom-Json
        $token = $result.data.token
        Write-Host "Usuario criado! Token obtido!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao criar usuário!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nTestando APIs...`n"

$apis = @(
    @{name="User Profile"; method="GET"; url="/api/user/profile"},
    @{name="User Items"; method="GET"; url="/api/user/items?type=products"},
    @{name="Conversations"; method="GET"; url="/api/conversations?status=active"},
    @{name="Crypto Prices"; method="GET"; url="/api/crypto/prices"},
    @{name="Crypto Balances"; method="GET"; url="/api/crypto/balances"},
    @{name="Crypto Transactions"; method="GET"; url="/api/crypto/transactions"}
)

$successCount = 0
$errorCount = 0

foreach ($api in $apis) {
    try {
        $response = Invoke-WebRequest `
            -Uri "https://agroisync.com$($api.url)" `
            -Method $api.method `
            -Headers @{"Authorization"="Bearer $token"} `
            -ErrorAction Stop
        
        Write-Host "OK $($api.name) - $($response.StatusCode)" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "ERRO $($api.name) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n====== RESULTADO ======" -ForegroundColor Cyan
Write-Host "OK: $successCount APIs" -ForegroundColor Green
Write-Host "ERRO: $errorCount APIs" -ForegroundColor Red

if ($errorCount -eq 0) {
    Write-Host "`nPERFEITO! Todas as APIs funcionando!" -ForegroundColor Green
}

