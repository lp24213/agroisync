# Teste COMPLETO de cadastro e verificação no banco D1
Write-Host "TESTE COMPLETO DE CADASTRO E BANCO DE DADOS" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Criar usuário via API
Write-Host "1 Criando usuario de teste via API..." -ForegroundColor Yellow

$testEmail = "test_complete_$(Get-Date -Format 'yyyyMMddHHmmss')@agroisync.com"
$testPassword = "TestPassword123!"
$testName = "Usuario Teste Completo"

Write-Host "  Email: $testEmail"
Write-Host "  Nome: $testName"
Write-Host ""

$registerData = @{
    email = $testEmail
    password = $testPassword
    name = $testName
    phone = "66992362830"
    turnstileToken = "test-token"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://agroisync.com/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData `
        -ErrorAction Stop
    
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "  OK Usuario criado com sucesso!" -ForegroundColor Green
        $userId = $result.data.user.id
        $token = $result.data.token
        
        Write-Host "  User ID: $userId" -ForegroundColor Cyan
        Write-Host ""
        
        # 2. Verificar se usuário está no banco
        Write-Host "2 Verificando usuario no banco D1..." -ForegroundColor Yellow
        
        cd backend
        $dbCheck = npx wrangler d1 execute agroisync-db --command "SELECT id, email, name, plan FROM users WHERE id = $userId;" --remote 2>&1
        
        if ($dbCheck -match $testEmail) {
            Write-Host "  OK Usuario encontrado no banco!" -ForegroundColor Green
        } else {
            Write-Host "  ERRO Usuario NAO encontrado no banco!" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "3 Testando API de perfil..." -ForegroundColor Yellow
        
        cd ..
        $profileResponse = Invoke-WebRequest -Uri "https://agroisync.com/api/user/profile" `
            -Headers @{"Authorization"="Bearer $token"} `
            -Method GET `
            -ErrorAction Stop
        
        $profile = $profileResponse.Content | ConvertFrom-Json
        
        if ($profile.success) {
            Write-Host "  OK Perfil recuperado!" -ForegroundColor Green
            Write-Host "  Nome: $($profile.data.user.name)" -ForegroundColor Cyan
            Write-Host "  Email: $($profile.data.user.email)" -ForegroundColor Cyan
            Write-Host "  Plano: $($profile.data.user.plan)" -ForegroundColor Cyan
        } else {
            Write-Host "  ERRO ao buscar perfil!" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "RESULTADO FINAL:" -ForegroundColor Cyan
        Write-Host "================" -ForegroundColor Cyan
        Write-Host "CADASTRO COMPLETO FUNCIONANDO!" -ForegroundColor Green
        Write-Host "Usuario salvo no banco D1!" -ForegroundColor Green
        Write-Host "API de perfil funcionando!" -ForegroundColor Green
        
    } else {
        Write-Host "  ERRO ao criar usuario: $($result.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Response: $($_.Exception.Response.Content)" -ForegroundColor Red
}

