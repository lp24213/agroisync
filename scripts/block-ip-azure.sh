#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <ip>"
  exit 1
fi
az network firewall network-rule add --firewall-name agrotm-fw --resource-group agrotm-rg --collection-name blocklist --name block-$1 --rule-type Network --action Deny --priority 100 --source-addresses $1 --destination-addresses '*' --destination-ports '*' --protocols Any
echo "IP $1 bloqueado no Azure Firewall." 