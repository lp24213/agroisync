#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Uso: $0 <ip>"
  exit 1
fi
aws wafv2 update-ip-set --name agrotm-ip-block --scope REGIONAL --id $AWS_WAF_IP_SET_ID --addresses $1/32 --region us-east-1
echo "IP $1 bloqueado na AWS WAF." 