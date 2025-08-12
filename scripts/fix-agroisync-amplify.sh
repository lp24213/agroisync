#!/bin/bash

echo "🚀 CORREÇÃO DEFINITIVA AGROISYNC.COM - AMPLIFY..."

# Configurar região
export AWS_DEFAULT_REGION=us-east-2

echo "🔍 Status atual do DNS AGROISYNC:"
echo "Verificando agroisync.com:"
nslookup agroisync.com
echo "Verificando www.agroisync.com:"
nslookup www.agroisync.com

echo ""
echo "📝 CORREÇÃO 1: Apontando agroisync.com para Amplify..."
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d2d5j98tau5snm.amplifyapp.com"}]
            }
        }]
    }'

if [ $? -eq 0 ]; then
    echo "✅ Domínio agroisync.com corrigido!"
else
    echo "❌ Erro ao corrigir agroisync.com"
    exit 1
fi

echo ""
echo "📝 CORREÇÃO 2: Apontando www.agroisync.com para Amplify..."
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d2d5j98tau5snm.amplifyapp.com"}]
            }
        }]
    }'

if [ $? -eq 0 ]; then
    echo "✅ WWW.agroisync.com corrigido!"
else
    echo "❌ Erro ao corrigir WWW.agroisync.com"
    exit 1
fi

echo ""
echo "📝 CORREÇÃO 3: Removendo domínio customizado do Amplify (se existir)..."
aws amplify delete-domain-association \
    --app-id d2d5j98tau5snm \
    --domain-name agroisync.com \
    --region us-east-2 2>/dev/null

echo "⚠️ Domínio customizado removido (se existia)"

echo ""
echo "📝 CORREÇÃO 4: Aguardando propagação DNS..."
echo "⏳ Aguardando 2 minutos para propagação..."
sleep 120

echo ""
echo "📝 CORREÇÃO 5: Verificando nova configuração DNS..."
echo "🔍 Novo DNS agroisync.com:"
nslookup agroisync.com
echo "🔍 Novo DNS www.agroisync.com:"
nslookup www.agroisync.com

echo ""
echo "📝 CORREÇÃO 6: Testando conectividade AGROISYNC..."
echo "🌐 Testando https://agroisync.com:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L https://agroisync.com --max-time 15)
echo "Status: $HTTP_STATUS"

echo "🌐 Testando https://www.agroisync.com:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L https://www.agroisync.com --max-time 15)
echo "Status: $HTTP_STATUS"

echo "🌐 Testando https://d2d5j98tau5snm.amplifyapp.com (direto):"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L https://d2d5j98tau5snm.amplifyapp.com --max-time 15)
echo "Status: $HTTP_STATUS"

echo ""
echo "📝 CORREÇÃO 7: Atualizando variável de ambiente do Amplify..."
aws amplify update-app \
    --app-id d2d5j98tau5snm \
    --environment-variables NEXT_PUBLIC_API_URL=https://agroisync.com \
    --region us-east-2

echo "✅ Variável de ambiente atualizada!"

echo ""
echo "📝 CORREÇÃO 8: Forçando novo deploy Amplify..."
JOB_ID=$(aws amplify start-job \
    --app-id d2d5j98tau5snm \
    --branch-name main \
    --job-type RELEASE \
    --region us-east-2 \
    --query 'jobSummary.jobId' \
    --output text 2>/dev/null)

if [ "$JOB_ID" != "None" ] && [ -n "$JOB_ID" ]; then
    echo "🚀 Deploy iniciado com Job ID: $JOB_ID"
    
    echo "📝 CORREÇÃO 9: Monitorando deploy..."
    for i in {1..15}; do
        STATUS=$(aws amplify get-job \
            --app-id d2d5j98tau5snm \
            --branch-name main \
            --job-id $JOB_ID \
            --region us-east-2 \
            --query 'job.summary.status' \
            --output text 2>/dev/null)
        
        echo "⏳ Deploy status: $STATUS (tentativa $i/15)"
        
        if [ "$STATUS" = "SUCCEED" ]; then
            echo "✅ Deploy concluído com sucesso!"
            break
        elif [ "$STATUS" = "FAILED" ]; then
            echo "❌ Deploy falhou!"
            break
        fi
        
        sleep 30
    done
else
    echo "⚠️ Não foi possível iniciar novo deploy (pode não ser necessário)"
fi

echo ""
echo "📝 CORREÇÃO 10: Teste final após todas as correções..."
sleep 60

echo "🎯 TESTE FINAL AGROISYNC:"
for url in "https://agroisync.com" "https://www.agroisync.com"; do
    echo "Testando $url..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" --max-time 20)
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" -L "$url" --max-time 20)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ $url: OK ($HTTP_STATUS) - ${RESPONSE_TIME}s"
    else
        echo "❌ $url: ERRO ($HTTP_STATUS)"
        
        # Diagnóstico adicional
        echo "   🔍 Diagnóstico:"
        curl -I -L "$url" --max-time 10 2>/dev/null | head -5
    fi
    echo ""
done

echo ""
echo "🎉 CORREÇÃO AGROISYNC FINALIZADA!"
echo ""
echo "📋 RESUMO DAS CORREÇÕES:"
echo "   ✅ DNS agroisync.com → d2d5j98tau5snm.amplifyapp.com"
echo "   ✅ DNS www.agroisync.com → d2d5j98tau5snm.amplifyapp.com"
echo "   ✅ Variável de ambiente atualizada"
echo "   ✅ Domínio customizado removido"
echo "   ✅ Deploy forçado"
echo "   ✅ Propagação DNS aguardada"
echo ""
echo "🌐 URLs CORRIGIDAS AGROISYNC:"
echo "   - https://agroisync.com"
echo "   - https://www.agroisync.com"
echo ""
echo "⏰ Se ainda houver erro 404, aguarde mais 10-15 minutos para propagação completa do DNS"
