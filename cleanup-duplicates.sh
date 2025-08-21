#!/bin/bash

# AGROISYNC - Script de Limpeza de Arquivos Duplicados
# Este script remove arquivos duplicados e desnecessários

echo "🧹 AGROISYNC - Limpeza de Arquivos Duplicados"
echo "============================================="

# 1. REMOVER ARQUIVOS ZIP TEMPORÁRIOS
echo "🗑️ Removendo arquivos ZIP temporários..."
rm -f *.zip
echo "✅ Arquivos ZIP removidos"

# 2. REMOVER SCRIPTS DUPLICADOS DE FIX
echo "🗑️ Removendo scripts de fix duplicados..."
rm -f fix-agroisync-ultra-perfeito.ps1
rm -f fix-agroisync-ultra-perfeito.sh
rm -f fix-agroisync-100-perfect.sh
rm -f fix-agroisync-ABSOLUTAMENTE-PERFEITO.sh
rm -f fix-agroisync-definitivo-final.ps1
rm -f fix-agroisync-definitivo-final.sh
rm -f fix-agroisync-ultra-final.ps1
rm -f fix-agroisync-ultra-final.sh
rm -f fix-agroisync-final-definitive.ps1
rm -f fix-agroisync-final-definitive.sh
rm -f fix-agroisync-build-failure.ps1
rm -f fix-agroisync-build-failure.sh
rm -f fix-agroisync-aws-ai-corrections.ps1
rm -f fix-agroisync-aws-ai-corrections.sh
rm -f fix-agroisync-total-definitivo.sh
rm -f fix-agrotm-complete-build.sh
rm -f fix-agroisync-hiper-profissional.ps1
rm -f fix-agroisync-hiper-profissional.sh
rm -f fix-amplify-404-complete.sh
rm -f fix-amplify-complete.sh
rm -f fix-amplify-dns.sh
rm -f fix-dns-complete.sh
echo "✅ Scripts de fix duplicados removidos"

# 3. REMOVER SCRIPTS DE DEPLOY DUPLICADOS
echo "🗑️ Removendo scripts de deploy duplicados..."
rm -f deploy-agroisync-amplify.ps1
rm -f deploy-agroisync-perfect.ps1
rm -f deploy-amplify-direct.ps1
echo "✅ Scripts de deploy duplicados removidos"

# 4. REMOVER ARQUIVOS JSON DE DNS DUPLICADOS
echo "🗑️ Removendo arquivos JSON de DNS duplicados..."
rm -f fix-acm-validation.json
rm -f fix-main-domain.json
rm -f fix-www-domain.json
rm -f update-dns.json
rm -f clean-dns.json
rm -f add-dns-records.json
rm -f ssl-dns-records.json
rm -f delete-conflicting-records.json
rm -f validacao-ssl-agroisync.json
rm -f dns-agroisync-simples.json
rm -f agroisync-subdomains-only.json
echo "✅ Arquivos JSON de DNS duplicados removidos"

# 5. REMOVER ARQUIVOS TEMPORÁRIOS
echo "🗑️ Removendo arquivos temporários..."
rm -f "h origin main"
rm -f "how HEADamplify.yml"
rm -f "tatus"
rm -f "tatus --porcelain"
rm -f "s... && git add . && git commit -m Trigger deployment - AGROTM ready for production && git push origin main"
echo "✅ Arquivos temporários removidos"

# 6. REMOVER PASTA FRONTEND-OLD
echo "🗑️ Removendo pasta frontend-old..."
rm -rf frontend-old/
echo "✅ Pasta frontend-old removida"

# 7. REMOVER TSCONFIGS DUPLICADOS NO BACKEND
echo "🗑️ Removendo tsconfigs duplicados no backend..."
cd backend
rm -f tsconfig.final.json
rm -f tsconfig.transpile.json
rm -f tsconfig.ultra.json
rm -f tsconfig.ignore.json
rm -f tsconfig.dev.json
cd ..
echo "✅ TSConfigs duplicados removidos"

# 8. REMOVER READMEs REDUNDANTES
echo "🗑️ Removendo READMEs redundantes..."
rm -f AMPLIFY-BUILD-FIX-README.md
rm -f DEPLOY-AGROISYNC-AMPLIFY.md
rm -f AMPLIFY-DEPLOY-README.md
rm -f INTEGRATION-COMPLETE-README.md
rm -f IMPLEMENTATION-SUMMARY.md
rm -f RELATÓRIO.md
echo "✅ READMEs redundantes removidos"

# 9. REMOVER ARQUIVOS DE CONFIGURAÇÃO DUPLICADOS
echo "🗑️ Removendo arquivos de configuração duplicados..."
rm -f amplify-app-settings.json
rm -f amplify-cli-credentials.json
rm -f env-vars.json
rm -f turbo-deploy.json
rm -f vercel.json
echo "✅ Arquivos de configuração duplicados removidos"

# 10. LIMPEZA FINAL
echo "🧹 Limpeza final..."
find . -name "*.log" -delete
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete
echo "✅ Limpeza final concluída"

echo ""
echo "🎉 LIMPEZA CONCLUÍDA!"
echo "====================="
echo "✅ Arquivos ZIP temporários removidos"
echo "✅ Scripts duplicados removidos"
echo "✅ Configurações redundantes removidas"
echo "✅ Arquivos temporários removidos"
echo "✅ Estrutura do projeto otimizada"
echo ""
echo "📊 PRÓXIMOS PASSOS:"
echo "1. Execute 'git status' para ver as mudanças"
echo "2. Execute 'git add .' para adicionar as mudanças"
echo "3. Execute 'git commit -m \"🧹 Clean duplicate files and optimize project structure\"'"
echo "4. Execute 'git push origin main'"
echo ""
echo "🚀 Projeto AGROISYNC limpo e otimizado!"
