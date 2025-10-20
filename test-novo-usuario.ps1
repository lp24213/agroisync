$ErrorActionPreference = "Continue"
$baseUrl = "https://agroisync.com/api"

Write-Host "`n🧪 TESTE: CRIAR NOVO USUÁRIO E TESTAR AUTH`n" -ForegroundColor Cyan

# 1. Criar novo usuário
$randomEmail = "teste_$(Get-Random)@agroisync.test"
$registerBody = @{
    name = "Teste Usuario"
    email = $randomEmail
    password = "Teste@1234"
    business_type = "anunciante"
    turnstileToken = "XXXXXX.DUMMY._cmHCfTqSy-U.dummy"
} | ConvertTo-Json

Write-Host "1. Criando usuário: $randomEmail" -ForegroundColor Yellow
try {
    $register = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    if ($register.success) {
        Write-Host "   ✅ Usuário criado!" -ForegroundColor Green
        $token = $register.token
        Write-Host "   Token: $($token.Substring(0,50))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Erro: $_" -ForegroundColor Red
    exit
}

# 2. Testar perfil com novo token
Write-Host "`n2. Testando PERFIL com novo token" -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/user/profile" -Headers $headers
    if ($profile.success) {
        Write-Host "   ✅ PERFIL OK!" -ForegroundColor Green
        Write-Host "   Nome: $($profile.data.user.name)" -ForegroundColor White
        Write-Host "   Tipo: $($profile.data.user.business_type)" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ ERRO: $_" -ForegroundColor Red
}

# 3. Testar limites
Write-Host "`n3. Testando LIMITES com novo token" -ForegroundColor Yellow
try {
    $limits = Invoke-RestMethod -Uri "$baseUrl/user/limits" -Headers $headers
    if ($limits.success) {
        Write-Host "   ✅ LIMITES OK!" -ForegroundColor Green
        Write-Host "   Produtos: $($limits.data.limit_products)" -ForegroundColor White
        Write-Host "   Fretes: $($limits.data.limit_freights)" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ ERRO: $_" -ForegroundColor Red
}

Write-Host "`n✅ CONCLUSÃO:" -ForegroundColor Cyan
Write-Host "  Se funcionou, o problema era com tokens antigos!" -ForegroundColor Yellow
Write-Host "  Usuários devem fazer LOGOUT e LOGIN novamente.`n" -ForegroundColor Yellow

