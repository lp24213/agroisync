# AGROISYNC - Script de Limpeza de Arquivos Duplicados (PowerShell)
# Este script remove arquivos duplicados e desnecessários

Write-Host "🧹 AGROISYNC - Limpeza de Arquivos Duplicados" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# 1. REMOVER ARQUIVOS ZIP TEMPORÁRIOS
Write-Host "🗑️ Removendo arquivos ZIP temporários..." -ForegroundColor Yellow
Get-ChildItem -Path "*.zip" | Remove-Item -Force -ErrorAction SilentlyContinue
Write-Host "✅ Arquivos ZIP removidos" -ForegroundColor Green

# 2. REMOVER SCRIPTS DUPLICADOS DE FIX
Write-Host "🗑️ Removendo scripts de fix duplicados..." -ForegroundColor Yellow
$fixScripts = @(
    "fix-agroisync-ultra-perfeito.ps1",
    "fix-agroisync-ultra-perfeito.sh",
    "fix-agroisync-100-perfect.sh",
    "fix-agroisync-ABSOLUTAMENTE-PERFEITO.sh",
    "fix-agroisync-definitivo-final.ps1",
    "fix-agroisync-definitivo-final.sh",
    "fix-agroisync-ultra-final.ps1",
    "fix-agroisync-ultra-final.sh",
    "fix-agroisync-final-definitive.ps1",
    "fix-agroisync-final-definitive.sh",
    "fix-agroisync-build-failure.ps1",
    "fix-agroisync-build-failure.sh",
    "fix-agroisync-aws-ai-corrections.ps1",
    "fix-agroisync-aws-ai-corrections.sh",
    "fix-agroisync-total-definitivo.sh",
    "fix-agrotm-complete-build.sh",
    "fix-agroisync-hiper-profissional.ps1",
    "fix-agroisync-hiper-profissional.sh",
    "fix-amplify-404-complete.sh",
    "fix-amplify-complete.sh",
    "fix-amplify-dns.sh",
    "fix-dns-complete.sh"
)

foreach ($script in $fixScripts) {
    if (Test-Path $script) {
        Remove-Item $script -Force
        Write-Host "Removido: $script" -ForegroundColor Gray
    }
}
Write-Host "✅ Scripts de fix duplicados removidos" -ForegroundColor Green

# 3. REMOVER SCRIPTS DE DEPLOY DUPLICADOS
Write-Host "🗑️ Removendo scripts de deploy duplicados..." -ForegroundColor Yellow
$deployScripts = @(
    "deploy-agroisync-amplify.ps1",
    "deploy-agroisync-perfect.ps1",
    "deploy-amplify-direct.ps1"
)

foreach ($script in $deployScripts) {
    if (Test-Path $script) {
        Remove-Item $script -Force
        Write-Host "Removido: $script" -ForegroundColor Gray
    }
}
Write-Host "✅ Scripts de deploy duplicados removidos" -ForegroundColor Green

# 4. REMOVER ARQUIVOS JSON DE DNS DUPLICADOS
Write-Host "🗑️ Removendo arquivos JSON de DNS duplicados..." -ForegroundColor Yellow
$dnsFiles = @(
    "fix-acm-validation.json",
    "fix-main-domain.json",
    "fix-www-domain.json",
    "update-dns.json",
    "clean-dns.json",
    "add-dns-records.json",
    "ssl-dns-records.json",
    "delete-conflicting-records.json",
    "validacao-ssl-agroisync.json",
    "dns-agroisync-simples.json",
    "agroisync-subdomains-only.json"
)

foreach ($file in $dnsFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removido: $file" -ForegroundColor Gray
    }
}
Write-Host "✅ Arquivos JSON de DNS duplicados removidos" -ForegroundColor Green

# 5. REMOVER ARQUIVOS TEMPORÁRIOS
Write-Host "🗑️ Removendo arquivos temporários..." -ForegroundColor Yellow
$tempFiles = @(
    "h origin main",
    "how HEADamplify.yml",
    "tatus",
    "tatus --porcelain",
    "s... && git add . && git commit -m Trigger deployment - AGROTM ready for production && git push origin main"
)

foreach ($file in $tempFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removido: $file" -ForegroundColor Gray
    }
}
Write-Host "✅ Arquivos temporários removidos" -ForegroundColor Green

# 6. REMOVER PASTA FRONTEND-OLD
Write-Host "🗑️ Removendo pasta frontend-old..." -ForegroundColor Yellow
if (Test-Path "frontend-old") {
    Remove-Item "frontend-old" -Recurse -Force
    Write-Host "✅ Pasta frontend-old removida" -ForegroundColor Green
} else {
    Write-Host "⚠️ Pasta frontend-old não encontrada" -ForegroundColor Yellow
}

# 7. REMOVER TSCONFIGS DUPLICADOS NO BACKEND
Write-Host "🗑️ Removendo tsconfigs duplicados no backend..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Set-Location "backend"
    $tsConfigs = @(
        "tsconfig.final.json",
        "tsconfig.transpile.json",
        "tsconfig.ultra.json",
        "tsconfig.ignore.json",
        "tsconfig.dev.json"
    )
    
    foreach ($config in $tsConfigs) {
        if (Test-Path $config) {
            Remove-Item $config -Force
            Write-Host "Removido: backend/$config" -ForegroundColor Gray
        }
    }
    Set-Location ".."
    Write-Host "✅ TSConfigs duplicados removidos" -ForegroundColor Green
}

# 8. REMOVER READMEs REDUNDANTES
Write-Host "🗑️ Removendo READMEs redundantes..." -ForegroundColor Yellow
$readmeFiles = @(
    "AMPLIFY-BUILD-FIX-README.md",
    "DEPLOY-AGROISYNC-AMPLIFY.md",
    "AMPLIFY-DEPLOY-README.md",
    "INTEGRATION-COMPLETE-README.md",
    "IMPLEMENTATION-SUMMARY.md",
    "RELATÓRIO.md"
)

foreach ($file in $readmeFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removido: $file" -ForegroundColor Gray
    }
}
Write-Host "✅ READMEs redundantes removidos" -ForegroundColor Green

# 9. REMOVER ARQUIVOS DE CONFIGURAÇÃO DUPLICADOS
Write-Host "🗑️ Removendo arquivos de configuração duplicados..." -ForegroundColor Yellow
$configFiles = @(
    "amplify-app-settings.json",
    "amplify-cli-credentials.json",
    "env-vars.json",
    "turbo-deploy.json",
    "vercel.json"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removido: $file" -ForegroundColor Gray
    }
}
Write-Host "✅ Arquivos de configuração duplicados removidos" -ForegroundColor Green

# 10. LIMPEZA FINAL
Write-Host "🧹 Limpeza final..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Recurse -Include "*.log", "*.tmp", ".DS_Store" | Remove-Item -Force -ErrorAction SilentlyContinue
Write-Host "✅ Limpeza final concluída" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 LIMPEZA CONCLUÍDA!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "✅ Arquivos ZIP temporários removidos" -ForegroundColor Green
Write-Host "✅ Scripts duplicados removidos" -ForegroundColor Green
Write-Host "✅ Configurações redundantes removidas" -ForegroundColor Green
Write-Host "✅ Arquivos temporários removidos" -ForegroundColor Green
Write-Host "✅ Estrutura do projeto otimizada" -ForegroundColor Green
Write-Host ""
Write-Host "📊 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Execute 'git status' para ver as mudanças" -ForegroundColor White
Write-Host "2. Execute 'git add .' para adicionar as mudanças" -ForegroundColor White
Write-Host "3. Execute 'git commit -m \"🧹 Clean duplicate files and optimize project structure\"'" -ForegroundColor White
Write-Host "4. Execute 'git push origin main'" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Projeto AGROISYNC limpo e otimizado!" -ForegroundColor Green
