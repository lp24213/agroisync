#!/bin/bash

# 🔍 AGROTM - MONITORAMENTO CONTÍNUO DO AMPLIFY
# Monitora URLs continuamente para detectar problemas

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="agrotmsol.com.br"
AMPLIFY_URL="d2d5j98tau5snm.amplifyapp.com"

# Função para log
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para testar URL
test_url() {
    local url="$1"
    local status=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" --max-time 10)
    
    if [ "$status" = "200" ]; then
        echo "✅ $url: OK ($status)"
        return 0
    else
        echo "❌ $url: ERRO ($status)"
        return 1
    fi
}

# Função principal
main() {
    echo "🔍 MONITORAMENTO CONTÍNUO DO AMPLIFY"
    echo "===================================="
    echo "Monitorando URLs a cada 5 minutos..."
    echo "Pressione Ctrl+C para parar"
    echo ""
    
    # URLs para monitorar
    local urls=(
        "https://$DOMAIN"
        "https://www.$DOMAIN"
        "https://app.$DOMAIN"
        "https://$AMPLIFY_URL"
    )
    
    local iteration=1
    
    while true; do
        echo "$(date): Testando URLs (iteração $iteration)..."
        echo "----------------------------------------"
        
        local all_ok=true
        
        # Testar cada URL
        for url in "${urls[@]}"; do
            if ! test_url "$url"; then
                all_ok=false
            fi
        done
        
        echo "----------------------------------------"
        
        if $all_ok; then
            log_success "Todas as URLs estão funcionando! 🎉"
        else
            log_warning "Algumas URLs apresentam problemas"
        fi
        
        echo ""
        echo "⏳ Próxima verificação em 5 minutos..."
        echo "---"
        
        # Aguardar 5 minutos
        sleep 300
        ((iteration++))
    done
}

# Executar função principal
main "$@"
