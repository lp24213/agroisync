#!/bin/bash

echo "🧪 Testando build para Amplify localmente..."

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next out

# Configurar para Amplify
echo "⚙️ Configurando para Amplify..."
cp next.config-amplify.js next.config.js
cp tsconfig-amplify.json tsconfig.json

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Fazer build
echo "🏗️ Fazendo build..."
npm run build

# Verificar resultado
echo "📁 Verificando estrutura de arquivos..."
ls -la
echo "📁 Verificando pasta out..."
ls -la out/
echo "📁 Verificando se index.html existe..."
if [ -f "out/index.html" ]; then
    echo "✅ index.html encontrado! Build funcionou!"
else
    echo "❌ index.html não encontrado! Build falhou!"
    exit 1
fi

echo "🎉 Teste de build concluído com sucesso!"
