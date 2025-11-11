<#
Script auxiliar para guiar deploy do backend (Cloudflare Worker) e frontend (Pages).
IMPORTANTE: Este script não armazena secrets. Você precisa executar os comandos de wrangler
aprovando o input do token/chave quando solicitado.

Uso (executar na raiz do repo):
  .\scripts\deploy-wrangler.ps1

O que faz (passos automatizados / interativos):
- verifica presença do wrangler (npx wrangler)
- lista recomendações para setar secrets (não armazena nada automaticamente)
- imprime os comandos exatos para você executar (copy/paste) com checagens locais
#>
Set-StrictMode -Version Latest
Write-Output "== deploy helper (wrangler) =="

function Check-NodeNpm {
    Write-Output "Verificando node/npm..."
    $node = (Get-Command node.exe -ErrorAction SilentlyContinue)
    $npm = (Get-Command npm.cmd -ErrorAction SilentlyContinue)
    if (-not $node) { Write-Output "Node não encontrado no PATH. Instale Node.js (LTS) antes de continuar."; return $false }
    if (-not $npm) { Write-Output "npm não encontrado no PATH. Instale Node.js (LTS) antes de continuar."; return $false }
    return $true
}

if (-not (Check-NodeNpm)) { exit 1 }

Write-Output "Próximo: confirmar que você tem 'wrangler' disponível (via npx)."
Write-Output "Antes de publicar, configure os secrets necessários com:"
Write-Output "  npx wrangler secret put CF_TURNSTILE_SECRET_KEY"
Write-Output "  npx wrangler secret put RESEND_API_KEY"
Write-Output "  npx wrangler secret put JWT_SECRET"
Write-Output "  npx wrangler secret put JWT_REFRESH_SECRET"

Write-Output "Com secrets configurados, publique o backend (dentro da pasta backend):"
Write-Output "  Push-Location backend; npx wrangler publish; Pop-Location"

Write-Output "Para o frontend (Cloudflare Pages):"
Write-Output "  Push-Location frontend; npm ci; npm run build; npx wrangler pages deploy build --project-name=agroisync; Pop-Location"

Write-Output "Este script NÃO executa publicações automáticas por ausência de credenciais seguras aqui. Copie e cole os comandos acima no seu terminal com suas credenciais Cloudflare." 
