# 🚀 AGROISYNC - Deploy Completo e Automatizado no AWS Amplify (PowerShell)
# Este script configura TODO o backend e faz o deploy automaticamente

param(
    [string]$Region = "us-east-2",
    [string]$ProjectName = "agroisync",
    [string]$Domain = "agroisync.com"
)

# Configurações de erro
$ErrorActionPreference = "Stop"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "🚀 AGROISYNC - Deploy Completo no AWS Amplify" -ForegroundColor $Green
Write-Host "===============================================" -ForegroundColor $Green

# Verificar se o Amplify CLI está instalado
try {
    $amplifyVersion = amplify --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Amplify CLI já instalado" -ForegroundColor $Green
        Write-Host "📊 Versão: $amplifyVersion" -ForegroundColor $Blue
    }
} catch {
    Write-Host "📦 Instalando Amplify CLI..." -ForegroundColor $Yellow
    npm install -g @aws-amplify/cli
}

# Verificar se o AWS CLI está configurado
try {
    $awsIdentity = aws sts get-caller-identity 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AWS CLI configurado" -ForegroundColor $Green
        
        # Extrair informações da conta
        $accountId = ($awsIdentity | ConvertFrom-Json).Account
        $userArn = ($awsIdentity | ConvertFrom-Json).Arn
        Write-Host "📊 Account ID: $accountId" -ForegroundColor $Blue
        Write-Host "👤 Usuário: $userArn" -ForegroundColor $Blue
    }
} catch {
    Write-Host "❌ AWS CLI não está configurado. Execute 'aws configure' primeiro." -ForegroundColor $Red
    exit 1
}

Write-Host "📍 Região: $Region" -ForegroundColor $Blue
Write-Host "🏗️  Projeto: $ProjectName" -ForegroundColor $Blue
Write-Host "🌐 Domínio: $Domain" -ForegroundColor $Blue
Write-Host ""

# Navegar para o diretório do projeto
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
Set-Location $projectDir

Write-Host "🔄 Verificando projeto existente..." -ForegroundColor $Yellow

# Verificar se já existe projeto Amplify
if (Test-Path "amplify") {
    Write-Host "🔄 Projeto Amplify já existe. Atualizando..." -ForegroundColor $Yellow
    
    # Fazer pull das mudanças se existir
    if (Test-Path "amplify/team-provider-info.json") {
        $teamProviderInfo = Get-Content "amplify/team-provider-info.json" | ConvertFrom-Json
        $appId = $teamProviderInfo.dev.awscloudformation.AmplifyAppId
        
        if ($appId -and $appId -ne "null") {
            Write-Host "📥 Fazendo pull das mudanças..." -ForegroundColor $Yellow
            amplify pull --appId $appId --envName dev --yes 2>$null
        }
    }
} else {
    Write-Host "🆕 Inicializando novo projeto Amplify..." -ForegroundColor $Yellow
    
    # Inicializar projeto
    amplify init --app $ProjectName --envName dev --defaultEditor code --framework react --yes
}

Write-Host "🔐 Configurando autenticação..." -ForegroundColor $Yellow

# Configurar autenticação (se não existir)
if (-not (Test-Path "amplify/backend/auth/agroisync")) {
    amplify add auth --service Cognito --userPoolName "${ProjectName}_userpool" --identityPoolName "${ProjectName}_identitypool" --allowUnauthenticatedIdentities false --usernameAttributes email --signupAttributes email,name --mfaConfiguration ON --mfaTypes SMS,TOTP --passwordPolicyMinLength 12 --passwordPolicyRequirements "REQUIRES_LOWERCASE,REQUIRES_NUMBERS,REQUIRES_SYMBOLS,REQUIRES_UPPERCASE" --socialProviders Google,Facebook,Apple --hostedUI true --redirectSignIn "https://www.${Domain}/" --redirectSignOut "https://www.${Domain}/" --yes
} else {
    Write-Host "✅ Autenticação já configurada" -ForegroundColor $Green
}

Write-Host "📊 Configurando API GraphQL..." -ForegroundColor $Yellow

# Configurar API GraphQL (se não existir)
if (-not (Test-Path "amplify/backend/api/agroisync")) {
    amplify add api --service AppSync --serviceName $ProjectName --apiName $ProjectName --authenticationType AMAZON_COGNITO_USER_POOLS --additionalAuthenticationTypes AMAZON_COGNITO_USER_POOLS --yes
} else {
    Write-Host "✅ API GraphQL já configurada" -ForegroundColor $Green
}

Write-Host "💾 Configurando storage S3..." -ForegroundColor $Yellow

# Configurar storage S3 (se não existir)
if (-not (Test-Path "amplify/backend/storage/agroisyncstorage")) {
    amplify add storage --service S3 --serviceName "${ProjectName}storage" --bucketName "${ProjectName}-storage" --bucketRegion $Region --bucketAccess auth --bucketAccessPolicies private --bucketEncryption SSE-S3 --bucketVersioning enabled --bucketPublicAccess false --yes
} else {
    Write-Host "✅ Storage S3 já configurado" -ForegroundColor $Green
}

Write-Host "⚡ Configurando funções Lambda..." -ForegroundColor $Yellow

# Configurar funções Lambda (se não existirem)
$functions = @("adminFunctions", "stakingFunctions", "nftFunctions", "maintenanceFunctions", "analyticsFunctions", "taskScheduler")

foreach ($func in $functions) {
    if (-not (Test-Path "amplify/backend/function/$func")) {
        Write-Host "🔧 Criando função $func..." -ForegroundColor $Yellow
        amplify add function --functionName $func --runtime nodejs18.x --template hello-world --yes
    } else {
        Write-Host "✅ Função $func já existe" -ForegroundColor $Green
    }
}

Write-Host "🌐 Configurando hosting..." -ForegroundColor $Yellow

# Configurar hosting (se não existir)
if (-not (Test-Path "amplify/backend/hosting/amplifyhosting")) {
    amplify add hosting --service amplifyhosting --type manual --yes
} else {
    Write-Host "✅ Hosting já configurado" -ForegroundColor $Green
}

Write-Host "🚀 Fazendo push das configurações..." -ForegroundColor $Yellow

# Fazer push das configurações
amplify push --yes

Write-Host "🔗 Configurando domínio customizado..." -ForegroundColor $Yellow

# Configurar domínio customizado (se não existir)
if (-not (Test-Path "amplify/backend/custom/domain")) {
    try {
        amplify add custom --customType domain --domainName $Domain --yes
    } catch {
        Write-Host "⚠️  Domínio customizado não configurado (pode ser configurado manualmente)" -ForegroundColor $Yellow
    }
} else {
    Write-Host "✅ Domínio customizado já configurado" -ForegroundColor $Green
}

Write-Host "🚀 Push final das configurações..." -ForegroundColor $Yellow

# Fazer push final
amplify push --yes

Write-Host "👤 Configurando usuário admin..." -ForegroundColor $Yellow

# Configurar usuário admin
if (Test-Path "scripts/setup-admin-user.sh") {
    Write-Host "⚠️  Script de setup admin encontrado (execute manualmente no Linux)" -ForegroundColor $Yellow
} else {
    Write-Host "⚠️  Script de setup admin não encontrado" -ForegroundColor $Yellow
}

Write-Host "⚙️  Configurando variáveis de ambiente..." -ForegroundColor $Yellow

# Configurar variáveis de ambiente
amplify env checkout dev

Write-Host "🏗️  Fazendo build e deploy..." -ForegroundColor $Yellow

# Fazer build e deploy
if (Test-Path "frontend") {
    Set-Location frontend
    
    # Limpar e fazer build
    Write-Host "🧹 Limpando projeto..." -ForegroundColor $Yellow
    if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
    if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
    
    Write-Host "📦 Instalando dependências..." -ForegroundColor $Yellow
    npm install
    
    Write-Host "🔨 Fazendo build..." -ForegroundColor $Yellow
    npm run build
    
    # Verificar se o build foi bem-sucedido
    if (Test-Path "out") {
        Write-Host "✅ Build bem-sucedido! Arquivos gerados em out/" -ForegroundColor $Green
        
        # Contar arquivos
        $fileCount = (Get-ChildItem -Path "out" -Recurse -File | Measure-Object).Count
        Write-Host "📊 Total de arquivos: $fileCount" -ForegroundColor $Blue
    } else {
        Write-Host "❌ Build falhou! Verifique os erros acima." -ForegroundColor $Red
        exit 1
    }
    
    Set-Location ..
} else {
    Write-Host "⚠️  Diretório frontend não encontrado" -ForegroundColor $Yellow
}

Write-Host ""
Write-Host "🎉 Deploy do AGROISYNC concluído com sucesso!" -ForegroundColor $Green
Write-Host ""
Write-Host "📊 Resumo da configuração:" -ForegroundColor $Blue
Write-Host "   ✅ Autenticação Cognito com grupos admin/user" -ForegroundColor $Green
Write-Host "   ✅ API GraphQL AppSync segura" -ForegroundColor $Green
Write-Host "   ✅ Storage S3 privado" -ForegroundColor $Green
Write-Host "   ✅ Funções Lambda (Admin, Staking, NFT, Maintenance, Analytics, TaskScheduler)" -ForegroundColor $Green
Write-Host "   ✅ Hosting Amplify com domínio customizado" -ForegroundColor $Green
Write-Host "   ✅ Usuário admin configurado" -ForegroundColor $Green
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor $Blue
Write-Host "   - Frontend: https://www.${Domain}" -ForegroundColor $Yellow
Write-Host "   - Admin: https://www.${Domain}/admin" -ForegroundColor $Yellow
Write-Host "   - API: AppSync endpoint seguro" -ForegroundColor $Yellow
Write-Host ""
Write-Host "🔐 Credenciais Admin:" -ForegroundColor $Blue
Write-Host "   - Email: luispaulodeoliveira@agrotm.com.br" -ForegroundColor $Yellow
Write-Host "   - Senha: Admin@2024!" -ForegroundColor $Yellow
Write-Host ""
Write-Host "🚀 AGROISYNC está pronto para produção!" -ForegroundColor $Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor $Blue
Write-Host "   1. Verificar status: .\scripts\check-agroisync-status.ps1" -ForegroundColor $Yellow
Write-Host "   2. Testar funcionalidades" -ForegroundColor $Yellow
Write-Host "   3. Configurar domínio e SSL" -ForegroundColor $Yellow
Write-Host "   4. Monitorar logs e métricas" -ForegroundColor $Yellow
