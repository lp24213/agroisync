#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <incident-type>"
  exit 1
fi
curl -X POST "$SOAR_API_URL/incidents" \
  -H "Authorization: Bearer $SOAR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"'$1'","timestamp":"'$(date -Iseconds)'"}'
echo "Incidente $1 enviado para SOAR." 