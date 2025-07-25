#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo.sql>"
  exit 1
fi
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < "$1"
echo "Restore MySQL concluído de $1" 