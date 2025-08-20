#!/bin/bash

echo "🚀 AGROISYNC - Build direto para AWS Amplify"
echo "============================================="

# Configurar NVM se disponível
if command -v nvm &> /dev/null; then
    echo "✅ NVM encontrado, configurando Node.js 20.15.1..."
    nvm install 20.15.1
    nvm use 20.15.1
    nvm alias default 20.15.1
else
    echo "⚠️  NVM não encontrado, tentando instalar..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20.15.1
    nvm use 20.15.1
    nvm alias default 20.15.1
fi

# Verificar versões
echo "📋 Versões atuais:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Fazer build direto (sem verificação de versão)
echo "🔨 Fazendo build direto..."
cd frontend
npm run build

echo "✅ Build concluído com sucesso!"
