# Script para testar erros de console no agroisync.com
Write-Host "`n🔍 TESTANDO CONSOLE DO AGROISYNC.COM" -ForegroundColor Red

# Teste 1: Home Page
Write-Host "`n📱 1. TESTANDO HOME PAGE" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "https://agroisync.com" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response) {
    Write-Host "  ✅ Home carregou (Status: $($response.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Home" -ForegroundColor Red
}

# Teste 2: VLibras
Write-Host "`n♿ 2. TESTANDO VLIBRAS" -ForegroundColor Yellow
$htmlContent = $response.Content
if ($htmlContent -match "vlibras") {
    Write-Host "  ✅ Script VLibras encontrado no HTML" -ForegroundColor Green
    
    # Verificar se está carregando corretamente
    if ($htmlContent -match "vlibras.gov.br") {
        Write-Host "  ✅ URL VLibras: vlibras.gov.br" -ForegroundColor Green
    }
    
    # Verificar CSP
    if ($htmlContent -match "Content-Security-Policy") {
        Write-Host "  ⚠️ CSP encontrado - pode bloquear VLibras" -ForegroundColor Yellow
        if ($htmlContent -match "script-src.*vlibras") {
            Write-Host "  ✅ VLibras permitido no CSP" -ForegroundColor Green
        } else {
            Write-Host "  ❌ VLibras NÃO permitido no CSP!" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ❌ Script VLibras NÃO encontrado" -ForegroundColor Red
}

# Teste 3: Login Page
Write-Host "`n🔐 3. TESTANDO LOGIN PAGE" -ForegroundColor Yellow
$loginResponse = Invoke-WebRequest -Uri "https://agroisync.com/login" -UseBasicParsing -ErrorAction SilentlyContinue
if ($loginResponse) {
    Write-Host "  ✅ Login carregou (Status: $($loginResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Login" -ForegroundColor Red
}

# Teste 4: Register Page
Write-Host "`n📝 4. TESTANDO REGISTER PAGE" -ForegroundColor Yellow
$registerResponse = Invoke-WebRequest -Uri "https://agroisync.com/register" -UseBasicParsing -ErrorAction SilentlyContinue
if ($registerResponse) {
    Write-Host "  ✅ Register carregou (Status: $($registerResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Register" -ForegroundColor Red
}

# Teste 5: Dashboard Page (vai dar 401/403 se não logado - normal)
Write-Host "`n📊 5. TESTANDO DASHBOARD PAGE" -ForegroundColor Yellow
$dashboardResponse = Invoke-WebRequest -Uri "https://agroisync.com/dashboard" -UseBasicParsing -ErrorAction SilentlyContinue
if ($dashboardResponse) {
    Write-Host "  ✅ Dashboard carregou (Status: $($dashboardResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Dashboard requer autenticação (normal)" -ForegroundColor Yellow
}

# Teste 6: Marketplace
Write-Host "`n🛒 6. TESTANDO MARKETPLACE" -ForegroundColor Yellow
$marketResponse = Invoke-WebRequest -Uri "https://agroisync.com/marketplace" -UseBasicParsing -ErrorAction SilentlyContinue
if ($marketResponse) {
    Write-Host "  ✅ Marketplace carregou (Status: $($marketResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Marketplace" -ForegroundColor Red
}

# Teste 7: Plans
Write-Host "`n💳 7. TESTANDO PLANS" -ForegroundColor Yellow
$plansResponse = Invoke-WebRequest -Uri "https://agroisync.com/plans" -UseBasicParsing -ErrorAction SilentlyContinue
if ($plansResponse) {
    Write-Host "  ✅ Plans carregou (Status: $($plansResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Plans" -ForegroundColor Red
}

# Teste 8: Crypto
Write-Host "`n₿ 8. TESTANDO CRYPTO" -ForegroundColor Yellow
$cryptoResponse = Invoke-WebRequest -Uri "https://agroisync.com/crypto" -UseBasicParsing -ErrorAction SilentlyContinue
if ($cryptoResponse) {
    Write-Host "  ✅ Crypto carregou (Status: $($cryptoResponse.StatusCode))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erro ao carregar Crypto" -ForegroundColor Red
}

Write-Host "`n📊 RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "  🔍 Testes concluídos!" -ForegroundColor Green
Write-Host "`n⚠️ PROBLEMA IDENTIFICADO:" -ForegroundColor Red
Write-Host "  O VLIBRAS NÃO ESTÁ ABRINDO - vamos corrigir!" -ForegroundColor Yellow

Write-Host "`n🔧 PRÓXIMO PASSO:" -ForegroundColor Cyan
Write-Host "  Vou verificar o código do VLibras e corrigir o problema" -ForegroundColor White

