#!/bin/bash

# COMANDOS PARA CRIAR AGROSYNC NO IBM CLOUD
echo "=== CRIANDO AGROSYNC NO IBM CLOUD ==="

# 1. Criar projeto
echo "Criando projeto..."
ibmcloud ce project create --name agroisync-project

# 2. Selecionar projeto
echo "Selecionando projeto..."
ibmcloud ce project select --name agroisync-project

# 3. Criar aplicação
echo "Criando aplicação..."
ibmcloud ce app create --name agroisync-web --image nginx:alpine --port 80 --cpu 0.25 --memory 0.5Gi

# 4. Verificar status
echo "Verificando status..."
ibmcloud ce app get --name agroisync-web

echo "=== DEPLOY CONCLUÍDO! ==="
echo "Aguarde alguns minutos e teste a URL que aparecerá acima."
