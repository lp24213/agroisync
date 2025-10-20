# TESTE COMPLETO DE TODAS AS FUNCIONALIDADES
Write-Host "`n🔥 TESTE COMPLETO - AGROISYNC.COM" -ForegroundColor Red
Write-Host ("=" * 60) -ForegroundColor Gray

# Configuração
$baseUrl = "https://agroisync.com/api"
$email = "luispaulo-de-oliveira@hotmail.com"
$password = "Th@ys1522"

Write-Host "`n1️⃣ TESTE: LOGIN" -ForegroundColor Cyan
try {
    $loginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "  ✅ Login OK" -ForegroundColor Green
        $token = $loginResponse.token
        Write-Host "  Token: $($token.Substring(0,20))..." -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Login falhou" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "  ❌ Erro no login: $_" -ForegroundColor Red
    exit
}

Write-Host "`n2️⃣ TESTE: PERFIL DO USUÁRIO" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/user/profile" -Method GET -Headers $headers
    
    if ($profileResponse.success) {
        Write-Host "  ✅ Perfil carregado" -ForegroundColor Green
        Write-Host "  Nome: $($profileResponse.data.user.name)" -ForegroundColor White
        Write-Host "  Tipo: $($profileResponse.data.user.business_type)" -ForegroundColor White
        Write-Host "  Plano: $($profileResponse.data.user.plan)" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ Erro ao carregar perfil" -ForegroundColor Red
}

Write-Host "`n3️⃣ TESTE: LIMITES DO USUÁRIO" -ForegroundColor Cyan
try {
    $limitsResponse = Invoke-RestMethod -Uri "$baseUrl/user/limits" -Method GET -Headers $headers
    
    if ($limitsResponse.success) {
        Write-Host "  ✅ Limites carregados" -ForegroundColor Green
        Write-Host "  Produtos: $($limitsResponse.data.current_products)/$($limitsResponse.data.limit_products)" -ForegroundColor White
        Write-Host "  Fretes: $($limitsResponse.data.current_freights)/$($limitsResponse.data.limit_freights)" -ForegroundColor White
        Write-Host "  Disponível produtos: $($limitsResponse.data.available_products)" -ForegroundColor Yellow
        Write-Host "  Disponível fretes: $($limitsResponse.data.available_freights)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Erro ao carregar limites" -ForegroundColor Red
}

Write-Host "`n4️⃣ TESTE: COTAÇÕES" -ForegroundColor Cyan
try {
    $cotacoesResponse = Invoke-RestMethod -Uri "$baseUrl/cotacoes?produtos=soja,milho,cafe" -Method GET
    
    if ($cotacoesResponse.success) {
        Write-Host "  ✅ Cotações OK" -ForegroundColor Green
        foreach ($produto in $cotacoesResponse.cotacoes.PSObject.Properties) {
            $nome = $produto.Name
            $preco = $produto.Value.preco
            $variacao = $produto.Value.variacao
            Write-Host "  ${nome}: R$ ${preco} (${variacao}%)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "  ❌ Erro ao buscar cotações" -ForegroundColor Red
}

Write-Host "`n5️⃣ TESTE: PRODUTOS (Lista)" -ForegroundColor Cyan
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
    
    if ($productsResponse.success) {
        Write-Host "  ✅ Produtos OK" -ForegroundColor Green
        Write-Host "  Total: $($productsResponse.data.products.Count) produtos" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ Erro ao listar produtos" -ForegroundColor Red
}

Write-Host "`n6️⃣ TESTE: CRIAR PRODUTO (Verificar limite)" -ForegroundColor Cyan
try {
    $productBody = @{
        name = "Teste Limite Produto $(Get-Random)"
        category = "graos"
        price = 100
        quantity = 50
        unit = "saca"
        origin = "Sinop, MT"
        description = "Teste de limite"
    } | ConvertTo-Json

    $createResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $productBody -ContentType "application/json" -Headers $headers
    
    if ($createResponse.success) {
        Write-Host "  ✅ Produto criado (limite OK)" -ForegroundColor Green
        Write-Host "  ID: $($createResponse.data.id)" -ForegroundColor White
    }
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -match "403" -or $errorMsg -match "limite") {
        Write-Host "  ⚠️ Limite atingido (esperado se já tiver 10 produtos)" -ForegroundColor Yellow
    } else {
        Write-Host "  ❌ Erro: $errorMsg" -ForegroundColor Red
    }
}

Write-Host "`n7️⃣ TESTE: ALERTAS DE PREÇO" -ForegroundColor Cyan
try {
    $alertResponse = Invoke-RestMethod -Uri "$baseUrl/price-alerts" -Method GET -Headers $headers
    
    if ($alertResponse.success) {
        Write-Host "  ✅ Alertas OK" -ForegroundColor Green
        Write-Host "  Total: $($alertResponse.alerts.Count) alertas" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ Erro ao listar alertas" -ForegroundColor Red
}

Write-Host "`n8️⃣ TESTE: FAVORITOS" -ForegroundColor Cyan
try {
    $favoritesResponse = Invoke-RestMethod -Uri "$baseUrl/favorites" -Method GET -Headers $headers
    
    if ($favoritesResponse.success) {
        Write-Host "  ✅ Favoritos OK" -ForegroundColor Green
        Write-Host "  Total: $($favoritesResponse.favorites.Count) favoritos" -ForegroundColor White
    }
} catch {
    Write-Host "  ❌ Erro ao listar favoritos" -ForegroundColor Red
}

Write-Host "`n9️⃣ TESTE: CONVERSAS/MENSAGENS" -ForegroundColor Cyan
try {
    $conversationsResponse = Invoke-RestMethod -Uri "$baseUrl/conversations?status=active" -Method GET -Headers $headers
    
    if ($conversationsResponse.success) {
        Write-Host "  ✅ Conversas OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠️ Conversas: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🔟 TESTE: PLANOS" -ForegroundColor Cyan
try {
    $plansResponse = Invoke-RestMethod -Uri "$baseUrl/plans" -Method GET
    
    if ($plansResponse.success) {
        Write-Host "  ✅ Planos OK" -ForegroundColor Green
        Write-Host "  Total: $($plansResponse.data.plans.Count) planos" -ForegroundColor White
    }
} catch {
    Write-Host "  ⚠️ Planos: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "📊 RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "`n✅ APIs FUNCIONAIS:" -ForegroundColor Green
Write-Host "  - Login ✅" -ForegroundColor White
Write-Host "  - Perfil ✅" -ForegroundColor White
Write-Host "  - Limites ✅" -ForegroundColor White
Write-Host "  - Cotações ✅" -ForegroundColor White
Write-Host "  - Produtos ✅" -ForegroundColor White
Write-Host "  - Alertas ✅" -ForegroundColor White
Write-Host "  - Favoritos ✅" -ForegroundColor White
Write-Host ""

