#!/bin/bash

# 🚀 AGROISYNC IA - Script de Inicialização

echo "🧠 Iniciando Agroisync IA Admin..."

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado! Instale Python 3.8+"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️ Arquivo .env não encontrado!"
    echo "📋 Copiando env.example para .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado!"
    echo "🔧 IMPORTANTE: Edite o arquivo .env e configure:"
    echo "   - IA_SECRET_TOKEN"
    echo "   - ALLOWED_IPS"
    exit 1
fi

# Verificar se dependências estão instaladas
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
    source venv/bin/activate
    echo "📥 Instalando dependências..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Iniciar servidor
echo "🚀 Iniciando servidor FastAPI..."
python main.py

