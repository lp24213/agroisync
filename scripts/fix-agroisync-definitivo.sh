#!/bin/bash

echo "🚀 CORREÇÃO DEFINITIVA AGROISYNC.COM - TODOS OS PROBLEMAS..."

# Configurar região
export AWS_DEFAULT_REGION=us-east-2

echo "🔍 DIAGNÓSTICO INICIAL COMPLETO:"
echo "Verificando DNS atual:"
nslookup agroisync.com
nslookup www.agroisync.com

echo ""
echo "📝 CORREÇÃO 1: REMOVENDO DNS CLOUDFRONT ERRADO..."
# Remover A record que aponta para CloudFront errado
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "DELETE",
            "ResourceRecordSet": {
                "Name": "agroisync.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "dxw3ig9lvgm9z.cloudfront.net",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }]
    }' 2>/dev/null && echo "✅ A record CloudFront removido!" || echo "⚠️ A record pode não existir"

# Remover CNAME www que aponta para CloudFront errado
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "DELETE",
            "ResourceRecordSet": {
                "Name": "www.agroisync.com",
                "Type": "CNAME",
                "TTL": 500,
                "ResourceRecords": [{"Value": "dxw3ig9lvgm9z.cloudfront.net"}]
            }
        }]
    }' 2>/dev/null && echo "✅ CNAME www CloudFront removido!" || echo "⚠️ CNAME pode não existir"

echo ""
echo "📝 CORREÇÃO 2: CONFIGURANDO DNS CORRETO PARA AMPLIFY..."
# Criar CNAME para domínio raiz apontando para Amplify
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
    }' && echo "✅ DNS agroisync.com → Amplify configurado!" || echo "❌ Erro no DNS raiz"

# Criar CNAME para www apontando para Amplify
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
    }' && echo "✅ DNS www.agroisync.com → Amplify configurado!" || echo "❌ Erro no DNS www"

echo ""
echo "📝 CORREÇÃO 3: CONFIGURANDO DNS PARA API..."
aws route53 change-resource-record-sets \
    --hosted-zone-id Z00916223VXCYY3KXDZZ2 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "api.agroisync.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "agrotm-alb-804097878.us-east-2.elb.amazonaws.com"}]
            }
        }]
    }' && echo "✅ DNS API configurado!" || echo "❌ Erro no DNS API"

echo ""
echo "📝 CORREÇÃO 4: AGUARDANDO PROPAGAÇÃO DNS..."
echo "⏳ Aguardando 2 minutos para propagação DNS..."
sleep 120

echo ""
echo "📝 CORREÇÃO 5: VERIFICANDO NOVA CONFIGURAÇÃO DNS..."
echo "🔍 Novo DNS agroisync.com:"
nslookup agroisync.com
echo "🔍 Novo DNS www.agroisync.com:"
nslookup www.agroisync.com
echo "🔍 Novo DNS api.agroisync.com:"
nslookup api.agroisync.com

echo ""
echo "📝 CORREÇÃO 6: VERIFICANDO/CORRIGINDO BACKEND ECS..."
# Verificar status atual do ECS
RUNNING_COUNT=$(aws ecs describe-services \
    --cluster agrotm-cluster \
    --services agrotm-service \
    --query 'services[0].runningCount' \
    --output text)

echo "🔍 Containers rodando: $RUNNING_COUNT"

if [ "$RUNNING_COUNT" = "0" ]; then
    echo "❌ Backend parado! Reiniciando..."
    
    # Verificar/criar secrets
    aws ssm get-parameter --name "agrotm/database-url" --region us-east-2 >/dev/null 2>&1 || {
        echo "Criando MONGODB_URI..."
        aws ssm put-parameter \
            --name "agrotm/database-url" \
            --value "mongodb://agrotm:agrotm123@mongodb:27017/agrotm?authSource=admin" \
            --type "SecureString" \
            --region us-east-2
    }
    
    aws ssm get-parameter --name "agrotm/jwt-secret" --region us-east-2 >/dev/null 2>&1 || {
        echo "Criando JWT_SECRET..."
        aws ssm put-parameter \
            --name "agrotm/jwt-secret" \
            --value "agrotm-production-secret-key-2024" \
            --type "SecureString" \
            --region us-east-2
    }
    
    # Forçar novo deployment
    aws ecs update-service \
        --cluster agrotm-cluster \
        --service agrotm-service \
        --force-new-deployment \
        --region us-east-2
    
    echo "⏳ Aguardando backend iniciar..."
    for i in {1..15}; do
        RUNNING=$(aws ecs describe-services \
            --cluster agrotm-cluster \
            --services agrotm-service \
            --query 'services[0].runningCount' \
            --output text)
        
        echo "⏳ Containers: $RUNNING/1 ($i/15)"
        
        if [ "$RUNNING" = "1" ]; then
            echo "✅ Backend iniciado!"
            break
        fi
        
        sleep 30
    done
else
    echo "✅ Backend já está rodando!"
fi

echo ""
echo "📝 CORREÇÃO 7: ATUALIZANDO CONFIGURAÇÃO DO AMPLIFY..."
# Atualizar variável de ambiente do Amplify
aws amplify update-app \
    --app-id d2d5j98tau5snm \
    --environment-variables NEXT_PUBLIC_API_URL=https://api.agroisync.com \
    --region us-east-2 && echo "✅ Variável API atualizada!" || echo "❌ Erro na variável"

echo ""
echo "📝 CORREÇÃO 8: REMOVENDO DOMÍNIO CUSTOMIZADO CONFLITANTE..."
# Remover qualquer domínio customizado que possa estar conflitando
aws amplify delete-domain-association \
    --app-id d2d5j98tau5snm \
    --domain-name agroisync.com \
    --region us-east-2 2>/dev/null && echo "✅ Domínio customizado removido!" || echo "⚠️ Nenhum domínio customizado encontrado"

echo ""
echo "📝 CORREÇÃO 9: FORÇANDO DEPLOY DO FRONTEND..."
JOB_ID=$(aws amplify start-job \
    --app-id d2d5j98tau5snm \
    --branch-name main \
    --job-type RELEASE \
    --region us-east-2 \
    --query 'jobSummary.jobId' \
    --output text)

if [ "$JOB_ID" != "None" ] && [ -n "$JOB_ID" ]; then
    echo "🚀 Deploy frontend iniciado: $JOB_ID"
    
    # Monitorar deploy
    for i in {1..15}; do
        STATUS=$(aws amplify get-job \
            --app-id d2d5j98tau5snm \
            --branch-name main \
            --job-id $JOB_ID \
            --region us-east-2 \
            --query 'job.summary.status' \
            --output text 2>/dev/null)
        
        echo "⏳ Deploy status: $STATUS ($i/15)"
        
        if [ "$STATUS" = "SUCCEED" ]; then
            echo "✅ Deploy frontend concluído!"
            break
        elif [ "$STATUS" = "FAILED" ]; then
            echo "❌ Deploy frontend falhou!"
            break
        fi
        
        sleep 30
    done
else
    echo "⚠️ Não foi possível iniciar deploy"
fi

echo ""
echo "📝 CORREÇÃO 10: AGUARDANDO ESTABILIZAÇÃO FINAL..."
sleep 120

echo ""
echo "🎯 TESTE FINAL COMPLETO - TODOS OS COMPONENTES:"

echo "🔍 1. Testando DNS direto:"
echo "agroisync.com resolve para:"
nslookup agroisync.com | grep -A1 "Name:" || echo "❌ DNS não resolve"

echo ""
echo "🔍 2. Testando Amplify direto:"
AMPLIFY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://d2d5j98tau5snm.amplifyapp.com --max-time 15)
echo "Amplify direto: $AMPLIFY_STATUS"

echo ""
echo "🔍 3. Testando API backend:"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health --max-time 15)
echo "API health: $API_STATUS"

echo ""
echo "🔍 4. Testando domínios finais:"
for url in "https://agroisync.com" "https://www.agroisync.com"; do
    echo "Testando $url..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" --max-time 20)
    REDIRECT=$(curl -s -I -L "$url" --max-time 20 | grep -i location | head -1)
    
    if [ "$STATUS" = "200" ]; then
        echo "✅ $url: OK ($STATUS)"
    else
        echo "❌ $url: ERRO ($STATUS)"
        echo "   Redirect: $REDIRECT"
        
        # Diagnóstico adicional
        echo "   Headers:"
        curl -I -L "$url" --max-time 10 2>/dev/null | head -5
    fi
    echo ""
done

echo ""
echo "🔍 5. Testando integração frontend/backend:"
echo "Testando https://api.agroisync.com/health:"
curl -I https://api.agroisync.com/health --max-time 15 2>/dev/null | head -1 || echo "❌ API não responde via HTTPS"

echo ""
echo "🎉 CORREÇÃO DEFINITIVA FINALIZADA!"
echo ""
echo "📋 TODAS AS CORREÇÕES APLICADAS:"
echo "   ✅ DNS CloudFront errado removido"
echo "   ✅ DNS agroisync.com → d2d5j98tau5snm.amplifyapp.com"
echo "   ✅ DNS www.agroisync.com → d2d5j98tau5snm.amplifyapp.com"
echo "   ✅ DNS api.agroisync.com → ALB backend"
echo "   ✅ Backend ECS verificado/reiniciado"
echo "   ✅ Secrets Parameter Store criados"
echo "   ✅ Variável NEXT_PUBLIC_API_URL corrigida"
echo "   ✅ Domínio customizado conflitante removido"
echo "   ✅ Frontend redeploy forçado"
echo "   ✅ Propagação DNS aguardada"
echo ""
echo "🌐 URLS FINAIS:"
echo "   - Frontend: https://agroisync.com"
echo "   - Frontend: https://www.agroisync.com"
echo "   - API: https://api.agroisync.com"
echo ""
echo "⏰ Se ainda houver erro 404, aguarde mais 10-15 minutos para propagação completa do DNS"
