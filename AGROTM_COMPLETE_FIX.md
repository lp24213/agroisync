# 🚀 CORREÇÃO COMPLETA AGROTM.SOL - FRONTEND + BACKEND

## 📋 **PROBLEMAS IDENTIFICADOS:**

### **1. Backend ECS com 0 containers (210 falhas)**
- Serviço ECS parado ou falhando
- Task definition desatualizada
- Secrets não configurados

### **2. Frontend com API URL errada**
- `NEXT_PUBLIC_API_URL` apontando para `agrotmsol.com.br`
- Integração frontend/backend quebrada
- CORS mal configurado

### **3. DNS mal configurado**
- Domínios não apontando para serviços corretos
- API sem subdomínio configurado
- Propagação DNS incorreta

### **4. Integração frontend/backend quebrada**
- Falta de comunicação entre serviços
- Variáveis de ambiente incorretas
- Health checks falhando

## 🔧 **DADOS CORRETOS:**

- **Amplify App:** d2d5j98tau5snm
- **ECS Cluster:** agrotm-cluster
- **ECS Service:** agrotm-service
- **ALB:** agrotm-alb-804097878.us-east-2.elb.amazonaws.com
- **Target Group:** agrotm-tg
- **Hosted Zone Agroisync:** Z00916223VXCYY3KXDZZ2
- **Região:** us-east-2

## 🚀 **SCRIPTS DE CORREÇÃO CRIADOS:**

### **1. Script Bash (Linux/Mac):**
```bash
cd scripts
chmod +x fix-agrotm-complete.sh
./fix-agrotm-complete.sh
```

### **2. Script PowerShell (Windows):**
```powershell
cd scripts
.\fix-agrotm-complete.ps1
```

## 📝 **CORREÇÕES AUTOMÁTICAS:**

### **CORREÇÃO 1: DNS para API**
- Configura `api.agroisync.com` → ALB do backend
- Remove configurações antigas incorretas
- Atualiza TTL para propagação rápida

### **CORREÇÃO 2: Variáveis do Amplify**
- Atualiza `NEXT_PUBLIC_API_URL` para `https://api.agroisync.com`
- Remove referências incorretas a `agrotmsol.com.br`
- Configura ambiente de produção

### **CORREÇÃO 3: Secrets do Backend**
- Verifica/cria `MONGODB_URI` no Parameter Store
- Verifica/cria `JWT_SECRET` no Parameter Store
- Configura acesso seguro aos secrets

### **CORREÇÃO 4: Task Definition Corrigida**
- Cria nova task definition com configurações corretas
- Configura CORS para domínios permitidos
- Adiciona health checks robustos
- Configura logs e monitoramento

### **CORREÇÃO 5: Reset do Serviço ECS**
- Para serviço ECS para limpeza completa
- Remove containers falhando
- Prepara para nova configuração

### **CORREÇÃO 6: Atualização do Serviço**
- Aplica nova task definition
- Força novo deployment
- Configura desired count para 1

### **CORREÇÃO 7: Monitoramento do Backend**
- Monitora inicialização em tempo real
- Verifica containers rodando
- Aguarda estabilização completa

### **CORREÇÃO 8: Health Check do Target Group**
- Verifica saúde dos targets
- Confirma backend respondendo
- Valida configuração do ALB

### **CORREÇÃO 9: Teste da API**
- Testa health check diretamente no ALB
- Verifica conectividade
- Confirma backend funcionando

### **CORREÇÃO 10: Deploy do Frontend**
- Força novo deploy no Amplify
- Aplica novas variáveis de ambiente
- Atualiza configuração

### **CORREÇÃO 11: Monitoramento do Frontend**
- Acompanha progresso do deploy
- Verifica conclusão
- Confirma sucesso

### **CORREÇÃO 12: Configuração de Domínios**
- Configura `agroisync.com` → Amplify
- Configura `www.agroisync.com` → Amplify
- Remove configurações antigas

### **CORREÇÃO 13: Teste Final**
- Testa todas as URLs
- Verifica integração frontend/backend
- Confirma funcionamento completo

## 📊 **RESULTADO ESPERADO:**

### **ANTES (PROBLEMAS):**
```
❌ Backend ECS: 0 containers (210 falhas)
❌ Frontend API URL: agrotmsol.com.br (errado)
❌ DNS: mal configurado
❌ Integração: quebrada
```

### **DEPOIS (CORRIGIDO):**
```
✅ Backend ECS: 1 container rodando
✅ Frontend API URL: api.agroisync.com (correto)
✅ DNS: configurado corretamente
✅ Integração: funcionando perfeitamente
```

## ⚠️ **PRÉ-REQUISITOS:**

1. **AWS CLI configurado:**
   ```bash
   aws configure
   ```

2. **Permissões necessárias:**
   - ECS: `ecs:DescribeServices`, `ecs:UpdateService`, `ecs:RegisterTaskDefinition`
   - Route53: `route53:ChangeResourceRecordSets`
   - Amplify: `amplify:UpdateApp`, `amplify:StartJob`
   - SSM: `ssm:GetParameter`, `ssm:PutParameter`
   - ELB: `elasticloadbalancing:DescribeTargetHealth`

3. **Credenciais válidas:**
   - Access Key ID
   - Secret Access Key
   - Região: us-east-2

## 🎯 **EXECUÇÃO:**

### **Passo 1: Verificar AWS CLI**
```bash
aws --version
aws sts get-caller-identity
```

### **Passo 2: Executar Script**
```bash
# Linux/Mac
./fix-agrotm-complete.sh

# Windows
.\fix-agrotm-complete.ps1
```

### **Passo 3: Monitorar Progresso**
- O script mostrará progresso em tempo real
- Aguardar conclusão de todas as correções
- Verificar URLs finais

## 🔍 **VERIFICAÇÃO MANUAL:**

### **Teste Backend:**
```bash
# Health check direto
curl -I http://agrotm-alb-804097878.us-east-2.elb.amazonaws.com/health

# Via DNS
curl -I https://api.agroisync.com/health
```

### **Teste Frontend:**
```bash
# Domínios principais
curl -I https://agroisync.com
curl -I https://www.agroisync.com

# Amplify direto
curl -I https://d2d5j98tau5snm.amplifyapp.com
```

### **Teste ECS:**
```bash
# Status do serviço
aws ecs describe-services --cluster agrotm-cluster --services agrotm-service

# Status dos containers
aws ecs list-tasks --cluster agrotm-cluster --service-name agrotm-service
```

## ⏰ **TEMPO ESTIMADO:**

- **Execução do script:** 15-25 minutos
- **Estabilização do backend:** 5-10 minutos
- **Propagação DNS:** 15 minutos - 2 horas
- **Total para funcionar:** 35 minutos - 2.5 horas

## 🚨 **TROUBLESHOOTING:**

### **Se Backend não iniciar:**
- Verificar logs do ECS
- Confirmar task definition válida
- Verificar secrets no Parameter Store

### **Se Frontend não carregar:**
- Verificar deploy do Amplify
- Confirmar variáveis de ambiente
- Verificar logs do build

### **Se DNS não resolver:**
- Aguardar propagação
- Verificar Hosted Zone
- Confirmar permissões Route53

### **Se integração falhar:**
- Verificar CORS no backend
- Confirmar URL da API
- Testar endpoints individualmente

## ✅ **SUCESSO:**

Após execução bem-sucedida:

### **Backend:**
- 🚀 ECS rodando 1 container
- 🔌 API respondendo em `/health`
- 🔒 Secrets configurados
- 📊 Logs funcionando

### **Frontend:**
- 🌐 https://agroisync.com funcionando
- 🌐 https://www.agroisync.com funcionando
- 🔗 Integração com API funcionando
- 📱 Responsivo em todos os dispositivos

### **Infraestrutura:**
- 🌍 DNS propagado corretamente
- 🔒 SSL funcionando automaticamente
- 📈 Monitoramento ativo
- 🚀 Deploy automatizado

---

## 🎉 **COM ESTES SCRIPTS, AGROTM.SOL ESTARÁ FUNCIONANDO PERFEITAMENTE!**

**Execute o script e todo o sistema será corrigido automaticamente!** 🚀
