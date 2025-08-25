#!/bin/bash

# ===== SCRIPT DE INICIALIZAÇÃO DO AMBIENTE DE DESENVOLVIMENTO AGROTM =====

echo "🚀 Iniciando ambiente de desenvolvimento AGROTM..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale o Node.js 18+ e tente novamente."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional)
read -p "🗑️  Remover volumes antigos? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removendo volumes..."
    docker-compose down -v
fi

# Construir e iniciar containers
echo "🏗️  Construindo containers..."
docker-compose build

echo "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 10

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."

# MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB: Funcionando"
else
    echo "❌ MongoDB: Erro"
fi

# Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: Funcionando"
else
    echo "❌ Redis: Erro"
fi

# Backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Funcionando (http://localhost:5000)"
else
    echo "❌ Backend: Erro"
fi

# Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Funcionando (http://localhost:3000)"
else
    echo "❌ Frontend: Erro"
fi

echo ""
echo "🎉 Ambiente de desenvolvimento iniciado!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "🗄️  MongoDB:  mongodb://localhost:27017"
echo "🔴 Redis:     redis://localhost:6379"
echo ""
echo "📋 Comandos úteis:"
echo "  docker-compose logs -f backend    # Ver logs do backend"
echo "  docker-compose logs -f frontend   # Ver logs do frontend"
echo "  docker-compose down               # Parar todos os serviços"
echo "  docker-compose restart backend    # Reiniciar backend"
echo "  docker-compose restart frontend   # Reiniciar frontend"
echo ""
echo "🔐 Admin Login:"
echo "  Email: luispaulodeoliveira@agrotm.com.br"
echo "  Senha: Th@ys15221008"
echo ""
echo "📚 Documentação: README.md"
echo "🔗 API Docs: backend/API-ROUTES-DOCUMENTATION.md"
