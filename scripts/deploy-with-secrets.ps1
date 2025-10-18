# Script interativo para adicionar secrets ao wrangler e publicar
# Roda localmente no seu computador; NÃO armazena secrets em arquivos do repositório.
# Uso: abra PowerShell na pasta do repo e execute: .\scripts\deploy-with-secrets.ps1

param()

function Read-Secret($prompt) {
    Write-Host $prompt -ForegroundColor Yellow
    $secure = Read-Host -AsSecureString
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

Push-Location $PSScriptRoot\..\backend

# Lista de secrets a configurar
$secrets = @(
    'CF_TURNSTILE_SECRET_KEY',
    'RESEND_API_KEY',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'STRIPE_WEBHOOK_SECRET'
)

foreach ($name in $secrets) {
    $val = Read-Secret "Digite o valor para $name (pressione Enter)"
    if (![string]::IsNullOrWhiteSpace($val)) {
        $pinfo = Start-Process -FilePath npx -ArgumentList "wrangler secret put $name --config .\wrangler.toml" -NoNewWindow -PassThru -Wait -RedirectStandardInput input.txt
        # Não há redirecionamento seguro fácil via Start-Process, então usamos um workaround
        cmd /c "echo $val | npx wrangler secret put $name --config .\wrangler.toml"
    }
}

# Deploy do worker
Write-Host "Fazendo deploy do Worker..." -ForegroundColor Cyan
npx wrangler deploy --config .\wrangler.toml

Pop-Location

# Deploy do frontend (Pages)
Push-Location $PSScriptRoot\..\frontend
Write-Host "Publicando Pages..." -ForegroundColor Cyan
npx wrangler pages deploy build --project-name=agroisync
Pop-Location

Write-Host "Deploy concluído." -ForegroundColor Green
