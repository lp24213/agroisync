#!/bin/bash

echo "🧪 Testando build para Amplify no ambiente Linux..."

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next out

# Configurar para Amplify
echo "⚙️ Configurando para Amplify..."
cp next.config-final.js next.config.js
cp tsconfig-amplify.json tsconfig.json

# Verificar se os arquivos existem
echo "📁 Verificando arquivos de configuração..."
ls -la next.config*.js
ls -la tsconfig*.json

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Fazer build
echo "🏗️ Fazendo build..."
npm run build

# Verificar resultado
echo "📁 Verificando estrutura de arquivos..."
pwd
ls -la

echo "📁 Verificando pasta out..."
if [ -d "out" ]; then
    ls -la out/
    echo "📄 Verificando se index.html existe..."
    if [ -f "out/index.html" ]; then
        echo "✅ index.html encontrado! Build funcionou!"
        echo "📄 Primeiras linhas do index.html:"
        head -10 out/index.html
        echo "📊 Tamanho do index.html:"
        ls -lh out/index.html
    else
        echo "❌ index.html não encontrado! Build falhou!"
        exit 1
    fi
else
    echo "❌ Pasta 'out' não foi criada! Build falhou!"
    exit 1
fi

echo "🎉 Teste de build concluído com sucesso!"
echo "🚀 Pronto para deploy no Amplify!"
