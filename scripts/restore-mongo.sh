#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo.archive>"
  exit 1
fi
docker exec -i db mongorestore --archive="$1" --gzip
echo "Restore MongoDB concluído de $1" 