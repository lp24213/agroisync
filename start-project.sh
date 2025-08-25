#!/bin/bash

# 🚀 AGROTM - Script de Inicialização
# Este script configura e inicia o projeto AGROTM

echo "🚀 Iniciando AGROTM - Sistema de Inteligência Agrícola"
echo "=================================================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instalando..."
    # Instalar Docker (Ubuntu/Debian)
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado com sucesso!"
else
    echo "✅ Docker já está instalado"
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instalando..."
    # Instalar Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js instalado com sucesso!"
else
    echo "✅ Node.js já está instalado (versão $(node --version))"
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Instalando..."
    sudo apt-get install -y npm
    echo "✅ npm instalado com sucesso!"
else
    echo "✅ npm já está instalado (versão $(npm --version))"
fi

# Iniciar MongoDB com Docker
echo "🐳 Iniciando MongoDB..."
if docker ps -q -f name=mongodb | grep -q .; then
    echo "✅ MongoDB já está rodando"
else
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    echo "✅ MongoDB iniciado com sucesso!"
fi

# Aguardar MongoDB inicializar
echo "⏳ Aguardando MongoDB inicializar..."
sleep 10

# Verificar se MongoDB está respondendo
if docker exec mongodb mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB está respondendo"
else
    echo "❌ MongoDB não está respondendo. Aguardando mais tempo..."
    sleep 10
fi

# Configurar frontend
echo "⚛️  Configurando Frontend..."
cd frontend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
else
    echo "✅ Dependências do frontend já estão instaladas"
fi

# Criar arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo "🔧 Criando arquivo .env.local..."
    cat > .env.local << EOF
# AGROISYNC Frontend Environment Variables - Development
NEXT_PUBLIC_APP_NAME=AGROISYNC
NEXT_PUBLIC_APP_VERSION=2.3.1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
EOF
    echo "✅ Arquivo .env.local criado"
else
    echo "✅ Arquivo .env.local já existe"
fi

cd ..

# Configurar backend
echo "🔧 Configurando Backend..."
cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
else
    echo "✅ Dependências do backend já estão instaladas"
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "🔧 Criando arquivo .env..."
    cat > .env << EOF
# AGROISYNC Backend Environment Variables - Development
NODE_ENV=development
PORT=3001
JWT_SECRET=dev_jwt_secret_key_here_minimum_32_characters
MONGODB_URI=mongodb://localhost:27017/agroisync
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
DEBUG=true
LOG_LEVEL=debug
EOF
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

cd ..

# Criar script de inicialização
echo "📝 Criando script de inicialização..."
cat > start-services.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando serviços AGROTM..."

# Terminal 1 - Backend
echo "🔧 Iniciando Backend..."
cd backend
gnome-terminal --title="AGROTM Backend" -- bash -c "npm run dev; exec bash"

# Aguardar backend inicializar
sleep 5

# Terminal 2 - Frontend
echo "⚛️  Iniciando Frontend..."
cd frontend
gnome-terminal --title="AGROTM Frontend" -- bash -c "npm start; exec bash"

echo "✅ Serviços iniciados!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api"
echo ""
echo "💡 Use 'chmod +x start-services.sh' para tornar executável"
EOF

chmod +x start-services.sh

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo "=================================================="
echo "📋 Próximos passos:"
echo "1. Configure suas chaves do Stripe no arquivo backend/.env"
echo "2. Configure suas chaves de blockchain no arquivo backend/.env"
echo "3. Execute: ./start-services.sh"
echo ""
echo "🔐 Credenciais de Admin:"
echo "   Email: luispaulodeoliveira@agrotm.com.br"
echo "   Senha: Th@ys15221008"
echo ""
echo "📚 Documentação completa: SETUP-INSTRUCTIONS.md"
echo ""
echo "🚀 AGROTM está pronto para uso!"
