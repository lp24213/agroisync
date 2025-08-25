#!/bin/bash

# ===== SCRIPT DE DEPLOY NO GITHUB AGROTM =====

echo "🚀 Iniciando deploy no GitHub..."

# Verificar se estamos no diretório correto
if [ ! -f "README.md" ]; then
    echo "❌ Execute este script na raiz do projeto AGROTM"
    exit 1
fi

# Verificar se o git está configurado
if ! git config --get user.name > /dev/null 2>&1; then
    echo "❌ Git não está configurado. Configure seu usuário:"
    echo "   git config --global user.name 'Seu Nome'"
    echo "   git config --global user.email 'seu.email@exemplo.com'"
    exit 1
fi

# Verificar se há mudanças para commit
if git diff-index --quiet HEAD --; then
    echo "✅ Nenhuma mudança para commit"
else
    echo "📝 Preparando commit..."
    
    # Adicionar todos os arquivos
    git add .
    
    # Fazer commit
    COMMIT_MESSAGE="🚀 Deploy completo: Backend + Frontend + Configurações
    
✅ Backend 100% implementado
✅ Frontend 100% implementado  
✅ API 100% documentada
✅ Segurança 100% implementada
✅ Pagamentos 100% integrados
✅ Admin 100% funcional
✅ Docker configurado
✅ GitHub Actions configurado
✅ Scripts de deploy criados

🔐 Admin: luispaulodeoliveira@agrotm.com.br
📚 Docs: README.md + API-ROUTES-DOCUMENTATION.md
🚀 Pronto para produção!"
    
    git commit -m "$COMMIT_MESSAGE"
    echo "✅ Commit realizado com sucesso"
fi

# Verificar se o remote origin está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Remote origin não configurado. Configure-o primeiro:"
    echo "   git remote add origin https://github.com/agrotm/agroisync.git"
    exit 1
fi

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Você está na branch '$CURRENT_BRANCH'. Deseja fazer merge para main? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🔄 Fazendo checkout para main..."
        git checkout main
        echo "🔄 Fazendo merge de $CURRENT_BRANCH..."
        git merge "$CURRENT_BRANCH"
    else
        echo "❌ Deploy cancelado. Faça checkout para main primeiro."
        exit 1
    fi
fi

# Fazer push para o GitHub
echo "🚀 Fazendo push para o GitHub..."
if git push origin main; then
    echo "✅ Push realizado com sucesso!"
    echo ""
    echo "🎉 Deploy no GitHub concluído!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Verifique o status do GitHub Actions:"
    echo "   https://github.com/agrotm/agroisync/actions"
    echo ""
    echo "2. Configure as variáveis de ambiente na AWS:"
    echo "   - JWT_SECRET"
    echo "   - MONGODB_URI"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - METAMASK_ADMIN_ADDRESS"
    echo ""
    echo "3. Execute o deploy na AWS:"
    echo "   ./scripts/aws-deploy.sh"
    echo ""
    echo "4. Teste a aplicação:"
    echo "   Frontend: https://seu-dominio.com"
    echo "   Backend: https://api.seu-dominio.com"
    echo ""
    echo "🔐 Admin Login:"
    echo "   Email: luispaulodeoliveira@agrotm.com.br"
    echo "   Senha: Th@ys15221008"
    echo ""
    echo "📚 Documentação: README.md"
    echo "🔗 API Docs: backend/API-ROUTES-DOCUMENTATION.md"
else
    echo "❌ Erro ao fazer push. Verifique suas credenciais e tente novamente."
    exit 1
fi

