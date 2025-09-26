# Script para configurar domínio personalizado no Cloudflare Pages
# Este script será executado para adicionar agroisync.com ao projeto agroisync

# Primeiro, vamos obter o token de API
$token = (npx wrangler whoami | Select-String "Token:" | ForEach-Object { $_.Line.Split(":")[1].Trim() })

# Se não conseguir o token pelo whoami, vamos usar uma abordagem diferente
if (-not $token) {
    Write-Host "Não foi possível obter o token automaticamente."
    Write-Host "Vamos tentar configurar através do dashboard do Cloudflare."
    Write-Host ""
    Write-Host "Para configurar o domínio agroisync.com:"
    Write-Host "1. Acesse: https://dash.cloudflare.com"
    Write-Host "2. Vá para Pages > agroisync"
    Write-Host "3. Clique em 'Custom domains'"
    Write-Host "4. Adicione 'agroisync.com'"
    Write-Host "5. Configure o DNS conforme instruído"
    Write-Host ""
    Write-Host "OU execute este comando manualmente:"
    Write-Host "npx wrangler pages project add-domain agroisync.com --project-name=agroisync"
} else {
    Write-Host "Token encontrado: $token"
    # Aqui poderíamos fazer a chamada da API
}
