#!/bin/bash

echo "🚀 Iniciando build do AGROSYNC Frontend..."

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf build/

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --production=false

# Executar build
echo "🔨 Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "build" ]; then
    echo "❌ Erro: Diretório build não foi criado"
    exit 1
fi

# Verificar arquivos essenciais
echo "📁 Verificando arquivos essenciais..."
if [ ! -f "build/index.html" ]; then
    echo "❌ Erro: index.html não encontrado"
    exit 1
fi

if [ ! -f "build/static/js" ]; then
    echo "❌ Erro: Arquivos JavaScript não encontrados"
    exit 1
fi

# Copiar arquivos de configuração para o build
echo "📄 Copiando _redirects..."
cp public/_redirects build/

echo "📄 Copiando _headers..."
cp public/_headers build/

# Verificar arquivos de configuração
echo "📄 Verificando _redirects:"
cat build/_redirects

echo "📄 Verificando _headers:"
cat build/_headers

# Listar conteúdo do build
echo "📁 Conteúdo do diretório build:"
ls -la build/

echo "✅ Build concluído com sucesso!"
echo "🚀 Pronto para deploy no AWS Amplify"
