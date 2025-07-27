#!/bin/bash
# Onboarding automatizado AGROTM
npm install
echo "✔️ Dependências instaladas"
cp .env.example .env.local 2>/dev/null || echo "Edite .env.local para configurar suas variáveis."
echo "✔️ Onboarding concluído."
