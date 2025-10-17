# agroisync-diagnose.ps1
# Diagnóstico de ambiente e projeto para Windows PowerShell

Write-Host "==== Diagnóstico do Ambiente Agroisync (PowerShell) ===="

# Informações do sistema
Write-Host "\n--- Informações do Sistema ---"
Get-ComputerInfo | Select-Object OSName, OSVersion, OsArchitecture, CsSystemType, CsTotalPhysicalMemory

# Versão do Node.js e npm
Write-Host "\n--- Node.js e npm ---"
try { node -v } catch { Write-Host "Node.js não encontrado" }
try { npm -v } catch { Write-Host "npm não encontrado" }

# Versão do wrangler
Write-Host "\n--- Wrangler ---"
try { wrangler --version } catch { Write-Host "Wrangler não encontrado" }

# Versão do miniflare
Write-Host "\n--- Miniflare ---"
try { miniflare --version } catch { Write-Host "Miniflare não encontrado" }

# Variáveis de ambiente relevantes
Write-Host "\n--- Variáveis de Ambiente ---"
Get-ChildItem Env: | Where-Object { $_.Name -match 'CLOUDFLARE|NODE|D1|DATABASE|PORT|ENV' } | Format-Table -AutoSize

# Checagem de arquivos principais
Write-Host "\n--- Arquivos principais ---"
$files = @(
  "package.json",
  "backend\\package.json",
  "frontend\\package.json",
  "backend\\wrangler.toml",
  "frontend\\wrangler.toml",
  "agroisync-diagnose.sh"
)
foreach ($f in $files) {
  if (Test-Path $f) { Write-Host "$f: OK" } else { Write-Host "$f: NÃO ENCONTRADO" }
}

# Checagem de portas
Write-Host "\n--- Portas em uso (8787, 3000) ---"
Get-NetTCPConnection -LocalPort 8787,3000 -ErrorAction SilentlyContinue | Select-Object LocalPort,State,OwningProcess

# Listagem de processos Node.js
Write-Host "\n--- Processos Node.js ---"
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,Path,StartTime

# Diagnóstico de dependências backend/frontend
Write-Host "\n--- Dependências backend ---"
if (Test-Path "backend\\package.json") { npm --prefix backend list --depth=0 }
Write-Host "\n--- Dependências frontend ---"
if (Test-Path "frontend\\package.json") { npm --prefix frontend list --depth=0 }

# Checagem de scripts npm
Write-Host "\n--- Scripts npm backend ---"
if (Test-Path "backend\\package.json") { (Get-Content backend\\package.json | ConvertFrom-Json).scripts }
Write-Host "\n--- Scripts npm frontend ---"
if (Test-Path "frontend\\package.json") { (Get-Content frontend\\package.json | ConvertFrom-Json).scripts }

# Checagem de arquivos de configuração
Write-Host "\n--- Configuração wrangler backend ---"
if (Test-Path "backend\\wrangler.toml") { Get-Content backend\\wrangler.toml }
Write-Host "\n--- Configuração wrangler frontend ---"
if (Test-Path "frontend\\wrangler.toml") { Get-Content frontend\\wrangler.toml }

Write-Host "\n==== FIM DO DIAGNÓSTICO ===="
