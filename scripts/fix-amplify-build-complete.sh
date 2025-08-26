#!/bin/bash

echo "🔧 Iniciando correção completa do build do Amplify..."

# Navegar para o diretório raiz
cd "$(dirname "$0")/.."

echo "📁 Diretório atual: $(pwd)"

# Limpar cache e node_modules
echo "🧹 Limpando cache e dependências..."
if [ -d "frontend/node_modules" ]; then
    rm -rf frontend/node_modules
fi

if [ -d "frontend/.next" ]; then
    rm -rf frontend/.next
fi

if [ -d "frontend/build" ]; then
    rm -rf frontend/build
fi

# Limpar cache do npm
echo "🗑️ Limpando cache do npm..."
cd frontend
npm cache clean --force

# Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install --legacy-peer-deps --no-audit --no-fund

# Testar build localmente
echo "🔨 Testando build localmente..."
if npm run build; then
    echo "✅ Build local bem-sucedido!"
    
    # Fazer commit das correções
    echo "📝 Fazendo commit das correções..."
    cd ..
    git add .
    git commit -m "Fix: Build do Amplify corrigido - dependências atualizadas e configurações otimizadas"
    
    echo "🚀 Enviando para o repositório..."
    git push origin main
    
    echo "🎉 Correção concluída! O build deve funcionar agora."
else
    echo "❌ Build local falhou. Verifique os erros acima."
    exit 1
fi
