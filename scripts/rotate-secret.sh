#!/bin/bash
set -e
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Uso: $0 <secret-name> <new-value>"
  exit 1
fi
aws secretsmanager put-secret-value --secret-id "$1" --secret-string "$2"
echo "Segredo $1 rotacionado com sucesso." 