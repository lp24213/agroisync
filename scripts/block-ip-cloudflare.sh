#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <ip>"
  exit 1
fi
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/firewall/access_rules/rules" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"mode":"block","configuration":{"target":"ip","value":"'$1'"},"notes":"Automated block"}'
echo "IP $1 bloqueado no Cloudflare." 