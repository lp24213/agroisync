#!/bin/bash
set -e
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Uso: $0 <secret-name> <new-value>"
  exit 1
fi
az keyvault secret set --vault-name "$AZURE_KEY_VAULT_NAME" --name "$1" --value "$2"
echo "Segredo $1 rotacionado com sucesso no Azure." 