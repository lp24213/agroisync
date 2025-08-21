#!/bin/bash

echo "🚀 AGROISYNC - Build Principal"
echo "=============================="

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# 2. Instalar dependências do workspace principal
echo "📦 Instalando dependências do workspace..."
npm ci

# 3. Build do frontend
echo "🎨 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# 4. Build do backend
echo "⚙️ Building backend..."
cd backend
npm ci
npm run build
cd ..

# 5. Verificar builds
if [ -d "frontend/.next" ] || [ -d "frontend/out" ]; then
    echo "✅ Frontend build concluído"
else
    echo "❌ Frontend build falhou"
    exit 1
fi

if [ -d "backend/dist" ]; then
    echo "✅ Backend build concluído"
else
    echo "❌ Backend build falhou"
    exit 1
fi

echo "🎉 Build completo!"
echo "Frontend: ✅"
echo "Backend: ✅"
