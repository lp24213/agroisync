#!/bin/bash
set -e
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Uso: $0 <secret-name> <new-value>"
  exit 1
fi
gcloud secrets versions add "$1" --data-file=<(echo -n "$2")
echo "Segredo $1 rotacionado com sucesso no GCP." 