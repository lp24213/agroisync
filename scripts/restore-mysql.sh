#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo.sql>"
  exit 1
fi
docker exec -i db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE' < "$1"
echo "Restore MySQL concluído de $1" 