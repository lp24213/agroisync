# TESTE SIMPLES DAS APIS PRINCIPAIS
$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTE DE FUNCIONALIDADES - AGROISYNC  " -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "https://agroisync.com/api"
$email = "luispaulo-de-oliveira@hotmail.com"
$password = "Th@ys1522"

# 1. LOGIN
Write-Host "1. Testando LOGIN..." -ForegroundColor Cyan
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    if ($login.success) {
        Write-Host "   OK - Login funcionando" -ForegroundColor Green
        $token = $login.token
    } else {
        Write-Host "   ERRO - Login falhou" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
    exit
}

# 2. PERFIL
Write-Host "`n2. Testando PERFIL..." -ForegroundColor Cyan
$headers = @{ "Authorization" = "Bearer $token" }
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/user/profile" -Headers $headers
    Write-Host "   OK - Nome: $($profile.data.user.name)" -ForegroundColor Green
    Write-Host "   OK - Tipo: $($profile.data.user.business_type)" -ForegroundColor Green
    Write-Host "   OK - Plano: $($profile.data.user.plan)" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 3. LIMITES
Write-Host "`n3. Testando LIMITES..." -ForegroundColor Cyan
try {
    $limits = Invoke-RestMethod -Uri "$baseUrl/user/limits" -Headers $headers
    Write-Host "   OK - Produtos: $($limits.data.current_products) / $($limits.data.limit_products)" -ForegroundColor Green
    Write-Host "   OK - Fretes: $($limits.data.current_freights) / $($limits.data.limit_freights)" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 4. COTAÇÕES
Write-Host "`n4. Testando COTAÇÕES..." -ForegroundColor Cyan
try {
    $cotacoes = Invoke-RestMethod -Uri "$baseUrl/cotacoes?produtos=soja,milho"
    if ($cotacoes.success) {
        Write-Host "   OK - Cotações carregadas" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 5. PRODUTOS
Write-Host "`n5. Testando PRODUTOS..." -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products"
    Write-Host "   OK - Total de produtos: $($products.data.products.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 6. ALERTAS
Write-Host "`n6. Testando ALERTAS..." -ForegroundColor Cyan
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/price-alerts" -Headers $headers
    Write-Host "   OK - Alertas funcionando" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 7. FAVORITOS
Write-Host "`n7. Testando FAVORITOS..." -ForegroundColor Cyan
try {
    $favorites = Invoke-RestMethod -Uri "$baseUrl/favorites" -Headers $headers
    Write-Host "   OK - Favoritos funcionando" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

# 8. CONVERSAS
Write-Host "`n8. Testando CONVERSAS..." -ForegroundColor Cyan
try {
    $conversations = Invoke-RestMethod -Uri "$baseUrl/conversations?status=active" -Headers $headers
    Write-Host "   OK - Conversas funcionando" -ForegroundColor Green
} catch {
    Write-Host "   AVISO - Conversas: $_" -ForegroundColor Yellow
}

# 9. PLANOS
Write-Host "`n9. Testando PLANOS..." -ForegroundColor Cyan
try {
    $plans = Invoke-RestMethod -Uri "$baseUrl/plans"
    Write-Host "   OK - Planos carregados" -ForegroundColor Green
} catch {
    Write-Host "   ERRO - $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTES CONCLUÍDOS" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

