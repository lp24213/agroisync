#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo.archive>"
  exit 1
fi
mongorestore --host $MONGO_HOST --username $MONGO_USER --password $MONGO_PASSWORD --archive="$1" --gzip
echo "Restore MongoDB concluído de $1" 