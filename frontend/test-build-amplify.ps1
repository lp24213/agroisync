# Testando build para Amplify localmente no Windows
Write-Host "🧪 Testando build para Amplify localmente..." -ForegroundColor Green

# Limpar builds anteriores
Write-Host "🧹 Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

# Configurar para Amplify
Write-Host "⚙️ Configurando para Amplify..." -ForegroundColor Yellow
Copy-Item "next.config-final.js" "next.config.js" -Force
Copy-Item "tsconfig-amplify.json" "tsconfig.json" -Force

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm ci

# Fazer build
Write-Host "🏗️ Fazendo build..." -ForegroundColor Yellow
npm run build

# Verificar resultado
Write-Host "📁 Verificando estrutura de arquivos..." -ForegroundColor Yellow
Get-ChildItem
Write-Host "📁 Verificando pasta out..." -ForegroundColor Yellow
Get-ChildItem "out"
Write-Host "📄 Verificando se index.html existe..." -ForegroundColor Yellow
if (Test-Path "out/index.html") {
    Write-Host "✅ index.html encontrado! Build funcionou!" -ForegroundColor Green
    Write-Host "📄 Primeiras linhas do index.html:" -ForegroundColor Cyan
    Get-Content "out/index.html" | Select-Object -First 5
} else {
    Write-Host "❌ index.html não encontrado! Build falhou!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Teste de build concluído com sucesso!" -ForegroundColor Green
