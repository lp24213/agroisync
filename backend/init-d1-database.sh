#!/bin/bash
# ===== SCRIPT DE INICIALIZAÇÃO D1 DATABASE =====
# Inicializa o Cloudflare D1 Database com o schema

echo "🚀 Inicializando D1 Database - AgroSync"
echo "========================================"
echo ""

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI não encontrado!"
    echo "📦 Instale com: npm install -g wrangler"
    exit 1
fi

echo "✅ Wrangler CLI encontrado"
echo ""

# Database info
DATABASE_NAME="agroisync-db"
DATABASE_ID="a3eb1069-9c36-4689-9ee9-971245cb2d12"

echo "📋 Database Info:"
echo "   Nome: $DATABASE_NAME"
echo "   ID: $DATABASE_ID"
echo ""

# Executar schema.sql
echo "📊 Executando schema.sql..."
echo ""

# Ler arquivo SQL e executar cada comando
wrangler d1 execute $DATABASE_NAME --file=schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database inicializado com sucesso!"
    echo ""
    echo "📊 Tabelas criadas:"
    echo "   ✓ users"
    echo "   ✓ products"
    echo "   ✓ freights"
    echo "   ✓ messages"
    echo "   ✓ transactions"
    echo "   ✓ notifications"
    echo "   ✓ sessions"
    echo "   ✓ audit_logs"
    echo ""
    echo "👤 Usuário admin criado:"
    echo "   Email: admin@agroisync.com"
    echo "   Senha: AgroSync2024!@#SecureAdmin"
    echo ""
    echo "🎉 Pronto! Você pode agora:"
    echo "   1. Iniciar o worker: wrangler dev"
    echo "   2. Fazer deploy: wrangler publish"
    echo ""
else
    echo ""
    echo "❌ Erro ao inicializar database"
    echo "💡 Verifique se o database existe e se você está autenticado"
    echo ""
    echo "Comandos úteis:"
    echo "   wrangler login"
    echo "   wrangler d1 list"
    echo "   wrangler d1 info $DATABASE_NAME"
    echo ""
    exit 1
fi
