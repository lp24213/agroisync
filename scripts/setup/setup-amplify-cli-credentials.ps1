# AGROTM - Configuração de Credenciais Amplify CLI
# Script para configurar as novas chaves de acesso automaticamente

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"
$Magenta = "Magenta"

# Novas credenciais do Amplify CLI
$AMPLIFY_ACCESS_KEY_ID = "AKIARXUJLK4EQEIIMUS2"
$AMPLIFY_SECRET_ACCESS_KEY = "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"
$AMPLIFY_REGION = "us-east-1"
$AMPLIFY_OUTPUT = "json"

# Função para log
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Green
}

function Write-LogError {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Red
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor $Yellow
}

function Write-LogInfo {
    param([string]$Message)
    Write-Host "ℹ️ $Message" -ForegroundColor $Cyan
}

# Função para verificar se AWS CLI está instalado
function Test-AwsCli {
    Write-Log "Verificando se AWS CLI está instalado..." $Blue
    try {
        $version = aws --version
        if ($LASTEXITCODE -eq 0) {
            Write-LogSuccess "AWS CLI está instalado: $version"
            return $true
        }
    } catch {
        Write-LogError "AWS CLI não está instalado!"
        Write-Host ""
        Write-Host "📦 Instale o AWS CLI primeiro:" -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Para Windows:" -ForegroundColor $Cyan
        Write-Host "  Baixe de: https://aws.amazon.com/cli/" -ForegroundColor $Cyan
        Write-Host ""
        return $false
    }
    return $false
}

# Função para verificar se Amplify CLI está instalado
function Test-AmplifyCli {
    Write-Log "Verificando se Amplify CLI está instalado..." $Blue
    try {
        $version = amplify --version
        if ($LASTEXITCODE -eq 0) {
            Write-LogSuccess "Amplify CLI está instalado: $version"
            return $true
        }
    } catch {
        Write-LogWarning "Amplify CLI não está instalado!"
        Write-Host ""
        Write-Host "📦 Instale o Amplify CLI:" -ForegroundColor $Yellow
        Write-Host "  npm install -g @aws-amplify/cli" -ForegroundColor $Cyan
        Write-Host ""
        return $false
    }
    return $false
}

# Função para configurar credenciais AWS
function Set-AmplifyCredentials {
    Write-Log "Configurando credenciais do Amplify CLI..." $Blue
    
    # Configurar perfil específico para Amplify
    aws configure set aws_access_key_id $AMPLIFY_ACCESS_KEY_ID --profile amplify-cli
    aws configure set aws_secret_access_key $AMPLIFY_SECRET_ACCESS_KEY --profile amplify-cli
    aws configure set default.region $AMPLIFY_REGION --profile amplify-cli
    aws configure set default.output $AMPLIFY_OUTPUT --profile amplify-cli
    
    # Configurar como perfil padrão também
    aws configure set aws_access_key_id $AMPLIFY_ACCESS_KEY_ID
    aws configure set aws_secret_access_key $AMPLIFY_SECRET_ACCESS_KEY
    aws configure set default.region $AMPLIFY_REGION
    aws configure set default.output $AMPLIFY_OUTPUT
    
    Write-LogSuccess "Credenciais do Amplify CLI configuradas com sucesso!"
}

# Função para testar configuração
function Test-AmplifyConfiguration {
    Write-Log "Testando configuração do Amplify CLI..." $Blue
    
    # Testar identidade
    try {
        $identity = aws sts get-caller-identity --query 'Arn' --output text
        $account = aws sts get-caller-identity --query 'Account' --output text
        $userId = aws sts get-caller-identity --query 'UserId' --output text
        
        if ($LASTEXITCODE -eq 0) {
            Write-LogSuccess "Autenticação bem-sucedida!"
            Write-Host "  👤 Usuário: $identity" -ForegroundColor $Green
            Write-Host "  🏢 Conta: $account" -ForegroundColor $Green
            Write-Host "  🆔 User ID: $userId" -ForegroundColor $Green
        } else {
            Write-LogError "Falha na autenticação AWS!"
            return $false
        }
    } catch {
        Write-LogError "Falha na autenticação AWS!"
        return $false
    }
    
    # Testar acesso ao Amplify
    Write-Log "Testando acesso ao Amplify..." $Blue
    try {
        aws amplify list-apps --region $AMPLIFY_REGION --max-items 1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-LogSuccess "Acesso ao Amplify: OK"
        } else {
            Write-LogWarning "Sem acesso ao Amplify (verifique permissões)"
        }
    } catch {
        Write-LogWarning "Sem acesso ao Amplify (verifique permissões)"
    }
    
    return $true
}

# Função para mostrar configuração atual
function Show-AmplifyConfig {
    Write-Log "Configuração atual do Amplify CLI:" $Blue
    Write-Host ""
    Write-Host "📋 CONFIGURAÇÃO AMPLIFY CLI:" -ForegroundColor $Yellow
    Write-Host "=============================" -ForegroundColor $Yellow
    
    try {
        $region = aws configure get default.region
        $output = aws configure get default.output
        $accessKey = aws configure get aws_access_key_id
        $secretKey = aws configure get aws_secret_access_key
        
        Write-Host "  🌍 Região: $region" -ForegroundColor $Cyan
        Write-Host "  📊 Output: $output" -ForegroundColor $Cyan
        Write-Host "  🔑 Access Key: $($accessKey.Substring(0,8))..." -ForegroundColor $Cyan
        Write-Host "  🔒 Secret Key: $($secretKey.Substring(0,8))..." -ForegroundColor $Cyan
    } catch {
        Write-LogError "Erro ao obter configuração atual"
    }
}

# Função para configurar variáveis de ambiente
function Set-EnvironmentVariables {
    Write-Log "Configurando variáveis de ambiente..." $Blue
    
    # Configurar variáveis de ambiente para o usuário atual
    [Environment]::SetEnvironmentVariable("AWS_ACCESS_KEY_ID", $AMPLIFY_ACCESS_KEY_ID, "User")
    [Environment]::SetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", $AMPLIFY_SECRET_ACCESS_KEY, "User")
    [Environment]::SetEnvironmentVariable("AWS_REGION", $AMPLIFY_REGION, "User")
    [Environment]::SetEnvironmentVariable("AWS_DEFAULT_OUTPUT", $AMPLIFY_OUTPUT, "User")
    
    # Configurar para a sessão atual
    $env:AWS_ACCESS_KEY_ID = $AMPLIFY_ACCESS_KEY_ID
    $env:AWS_SECRET_ACCESS_KEY = $AMPLIFY_SECRET_ACCESS_KEY
    $env:AWS_REGION = $AMPLIFY_REGION
    $env:AWS_DEFAULT_OUTPUT = $AMPLIFY_OUTPUT
    
    Write-LogSuccess "Variáveis de ambiente configuradas!"
}

# Função para criar arquivo de configuração do Amplify
function New-AmplifyConfig {
    Write-Log "Criando arquivo de configuração do Amplify..." $Blue
    
    $amplifyConfig = @"
{
  "amplify-cli": {
    "accessKeyId": "$AMPLIFY_ACCESS_KEY_ID",
    "secretAccessKey": "$AMPLIFY_SECRET_ACCESS_KEY",
    "region": "$AMPLIFY_REGION",
    "output": "$AMPLIFY_OUTPUT",
    "description": "AGROTM Amplify CLI Credentials",
    "created": "$(Get-Date -Format 'yyyy-MM-dd')",
    "environment": "production"
  }
}
"@
    
    $amplifyConfig | Out-File -FilePath "amplify-cli-config.json" -Encoding UTF8
    Write-LogSuccess "Arquivo de configuração criado: amplify-cli-config.json"
}

# Função principal
function Main {
    Write-Host ""
    Write-Host "🚀 CONFIGURAÇÃO AMPLIFY CLI - AGROTM" -ForegroundColor $Magenta
    Write-Host "=====================================" -ForegroundColor $Magenta
    Write-Host ""
    
    # Verificar pré-requisitos
    if (-not (Test-AwsCli)) {
        Write-LogError "AWS CLI não está instalado. Instale primeiro."
        return
    }
    
    if (-not (Test-AmplifyCli)) {
        Write-LogWarning "Amplify CLI não está instalado. Continue mesmo assim."
    }
    
    Write-Host ""
    Write-Host "🔐 CONFIGURANDO NOVAS CREDENCIAIS AMPLIFY CLI" -ForegroundColor $Yellow
    Write-Host "=============================================" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host "  🔑 Access Key: $($AMPLIFY_ACCESS_KEY_ID.Substring(0,8))..." -ForegroundColor $Cyan
    Write-Host "  🌍 Região: $AMPLIFY_REGION" -ForegroundColor $Cyan
    Write-Host "  📊 Output: $AMPLIFY_OUTPUT" -ForegroundColor $Cyan
    Write-Host ""
    
    # Configurar credenciais
    Set-AmplifyCredentials
    
    # Configurar variáveis de ambiente
    Set-EnvironmentVariables
    
    # Criar arquivo de configuração
    New-AmplifyConfig
    
    # Testar configuração
    Write-Host ""
    if (Test-AmplifyConfiguration) {
        Write-LogSuccess "Configuração do Amplify CLI concluída com sucesso!"
    } else {
        Write-LogWarning "Configuração concluída, mas alguns testes falharam."
    }
    
    # Mostrar configuração final
    Write-Host ""
    Show-AmplifyConfig
    
    Write-Host ""
    Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor $Green
    Write-Host "=========================" -ForegroundColor $Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor $Yellow
    Write-Host "  1. Execute: amplify init" -ForegroundColor $Cyan
    Write-Host "  2. Execute: amplify configure" -ForegroundColor $Cyan
    Write-Host "  3. Execute: amplify push" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "📚 Documentação: https://docs.amplify.aws/" -ForegroundColor $Blue
    Write-Host ""
}

# Executar função principal
Main
