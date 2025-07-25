#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo.sql>"
  exit 1
fi
docker exec -i db psql -U agrotm agrotm < "$1"
echo "Restore concluído de $1" 