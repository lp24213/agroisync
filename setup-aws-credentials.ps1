# AGROTM - Configuração de Credenciais AWS CLI
# Script para configurar acesso AWS automaticamente

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"
# $Magenta = "Magenta"  # Removido - não utilizado

# Configurações padrão
$DEFAULT_REGION = "us-east-2"
$DEFAULT_OUTPUT = "json"

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
        Write-Host "Para macOS (com Homebrew):" -ForegroundColor $Cyan
        Write-Host "  brew install awscli" -ForegroundColor $Cyan
        Write-Host ""
        return $false
    }
    return $false
}

# Função para solicitar credenciais
function Get-Credentials {
    Write-Host ""
    Write-Host "🔐 CONFIGURAÇÃO DE CREDENCIAIS AWS" -ForegroundColor $Yellow
    Write-Host "==================================" -ForegroundColor $Yellow
    Write-Host ""
    
    # Solicitar Access Key ID
    do {
        $AWS_ACCESS_KEY_ID = Read-Host "🔑 AWS Access Key ID"
        if ([string]::IsNullOrEmpty($AWS_ACCESS_KEY_ID)) {
            Write-LogError "Access Key ID não pode estar vazio!"
        }
    } while ([string]::IsNullOrEmpty($AWS_ACCESS_KEY_ID))
    
    # Solicitar Secret Access Key
    do {
        $AWS_SECRET_ACCESS_KEY = Read-Host "🔒 AWS Secret Access Key" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($AWS_SECRET_ACCESS_KEY)
        $AWS_SECRET_ACCESS_KEY = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        if ([string]::IsNullOrEmpty($AWS_SECRET_ACCESS_KEY)) {
            Write-LogError "Secret Access Key não pode estar vazio!"
        }
    } while ([string]::IsNullOrEmpty($AWS_SECRET_ACCESS_KEY))
    
    # Solicitar região (com padrão)
    $AWS_REGION = Read-Host "🌍 AWS Region [$DEFAULT_REGION]"
    if ([string]::IsNullOrEmpty($AWS_REGION)) {
        $AWS_REGION = $DEFAULT_REGION
    }
    
    # Solicitar formato de output (com padrão)
    $AWS_OUTPUT = Read-Host "📊 Output format [$DEFAULT_OUTPUT]"
    if ([string]::IsNullOrEmpty($AWS_OUTPUT)) {
        $AWS_OUTPUT = $DEFAULT_OUTPUT
    }
}

# Função para configurar AWS CLI
function Set-AwsConfiguration {
    Write-Log "Configurando AWS CLI..." $Blue
    
    # Configurar credenciais
    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    aws configure set default.region $AWS_REGION
    aws configure set default.output $AWS_OUTPUT
    
    Write-LogSuccess "AWS CLI configurado com sucesso!"
}

# Função para testar configuração
function Test-Configuration {
    Write-Log "Testando configuração AWS..." $Blue
    
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
        aws amplify list-apps --region $AWS_REGION --max-items 1 | Out-Null
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
function Show-CurrentConfig {
    Write-Log "Configuração atual do AWS CLI:" $Blue
    Write-Host ""
    Write-Host "📋 CONFIGURAÇÃO ATUAL:" -ForegroundColor $Yellow
    Write-Host "======================" -ForegroundColor $Yellow
    
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

# Função para limpar configuração
function Clear-Configuration {
    Write-LogWarning "Limpando configuração AWS..." $Yellow
    
    $confirm = Read-Host "Tem certeza que deseja limpar a configuração? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        aws configure set aws_access_key_id ""
        aws configure set aws_secret_access_key ""
        aws configure set default.region ""
        aws configure set default.output ""
        Write-LogSuccess "Configuração limpa com sucesso!"
    } else {
        Write-LogInfo "Operação cancelada."
    }
}

# Função principal
function Main {
    Write-Host ""
    Write-Host "🔐 AGROTM - CONFIGURAÇÃO DE CREDENCIAIS AWS CLI" -ForegroundColor $Yellow
    Write-Host "================================================" -ForegroundColor $Yellow
    Write-Host ""
    
    # Verificar AWS CLI
    if (-not (Test-AwsCli)) {
        exit 1
    }
    
    # Menu de opções
    do {
        Write-Host ""
        Write-Host "📋 OPÇÕES DISPONÍVEIS:" -ForegroundColor $Yellow
        Write-Host "======================" -ForegroundColor $Yellow
        Write-Host "1. 🔑 Configurar novas credenciais" -ForegroundColor $Cyan
        Write-Host "2. ✅ Testar configuração atual" -ForegroundColor $Cyan
        Write-Host "3. 📋 Mostrar configuração atual" -ForegroundColor $Cyan
        Write-Host "4. 🗑️ Limpar configuração" -ForegroundColor $Cyan
        Write-Host "0. 🚪 Sair" -ForegroundColor $Cyan
        Write-Host ""
        
        $choice = Read-Host "Escolha uma opção (0-4)"
        
        switch ($choice) {
            "1" {
                Get-Credentials
                Set-AwsConfiguration
                Test-Configuration
            }
            "2" {
                Test-Configuration
            }
            "3" {
                Show-CurrentConfig
            }
            "4" {
                Clear-Configuration
            }
            "0" {
                Write-Host ""
                Write-LogInfo "Saindo..."
                exit 0
            }
            default {
                Write-LogError "Opção inválida! Escolha 0-4."
            }
        }
        
        Write-Host ""
        Read-Host "Pressione Enter para continuar..."
    } while ($true)
}

# Executar função principal
Main
