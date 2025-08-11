# 🚀 COMANDOS DE CORREÇÃO DNS - CLOUDSHELL

## 📋 CONFIGURAÇÕES
- **Hosted Zone ID:** Z1014720F19TBNCSVRC1
- **Região:** us-east-2
- **App ID:** d2d5j98tau5snm

---

## 1️⃣ CORRIGIR VALIDAÇÃO DO CERTIFICADO ACM

```bash
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1014720F19TBNCSVRC1 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "_3978cce7ded379adc6cc9704bdff5269.agrotmsol.com.br",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "_83bf8471385abf31a452d69c0008d3df.xlfgrmvvlj.acm-validations.aws"}]
            }
        }]
    }'
```

---

## 2️⃣ CORRIGIR DOMÍNIO PRINCIPAL

```bash
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1014720F19TBNCSVRC1 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "agrotmsol.com.br",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d3cg8n66fpfnfp.cloudfront.net"}]
            }
        }]
    }'
```

---

## 3️⃣ CORRIGIR SUBDOMÍNIO WWW

```bash
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1014720F19TBNCSVRC1 \
    --change-batch '{
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.agrotmsol.com.br",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "d3cg8n66fpfnfp.cloudfront.net"}]
            }
        }]
    }'
```

---

## 4️⃣ VERIFICAR PROPAGAÇÃO DNS

```bash
echo "🔍 Verificando propagação DNS..."
nslookup agrotmsol.com.br
nslookup www.agrotmsol.com.br
nslookup _3978cce7ded379adc6cc9704bdff5269.agrotmsol.com.br
```

---

## 5️⃣ VERIFICAR STATUS DO AMPLIFY

```bash
aws amplify get-domain-association \
    --app-id d2d5j98tau5snm \
    --domain-name agrotmsol.com.br \
    --region us-east-2 \
    --query 'domainAssociation.{Status:domainStatus,CertStatus:certificateVerificationDNSRecord}'
```

---

## 6️⃣ FORÇAR NOVO DEPLOY (SE NECESSÁRIO)

```bash
aws amplify start-job \
    --app-id d2d5j98tau5snm \
    --branch-name main \
    --job-type RELEASE \
    --region us-east-2
```

---

## 📊 TIMELINE DE PROPAGAÇÃO

- **5-10 minutos:** DNS propaga
- **10-15 minutos:** Certificado valida
- **15-20 minutos:** Site funcionando

---

## 🌐 URLS FINAIS

- ✅ **https://agrotmsol.com.br**
- ✅ **https://www.agrotmsol.com.br**
- ✅ **https://app.agrotmsol.com.br**

---

## 🎯 EXECUÇÃO RECOMENDADA

1. Execute os comandos **1, 2 e 3** em sequência
2. Aguarde **5 minutos** e execute o comando **4**
3. Execute o comando **5** para verificar status
4. Se necessário, execute o comando **6**
5. Aguarde **15-20 minutos** para funcionamento completo

---

## ⚠️ IMPORTANTE

- Execute os comandos na **ordem correta**
- Aguarde a **propagação do DNS**
- Verifique o **status do certificado**
- Monitore o **status do Amplify**
