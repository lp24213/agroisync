#!/bin/bash
# Script para corrigir parseInt sem radix

find src -name "*.js" -type f -exec sed -i 's/parseInt(\([^,)]*\))/parseInt(\1, 10)/g' {} \;

echo "Radix fix aplicado!"
