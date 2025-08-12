# 🌐 Configuração de Domínio Personalizado - AGROTM

## 📋 Status Atual
- **Domínio:** agrisync.com.br
- **Subdomínio:** www.agroisync.com.br
- **Status:** Não configurado
- **Problema:** Domínios não resolvem para o AWS Amplify

## 🚀 Solução: Configurar Domínio Personalizado no AWS Amplify

### 1. Pré-requisitos
- ✅ AWS CLI configurado
- ✅ Amplify CLI configurado
- ✅ Acesso ao console AWS
- ✅ Domínio registrado (agrisync.com.br)

### 2. Configuração Automática (Recomendado)

#### Windows (PowerShell):
```powershell
cd scripts
.\configure-domain.ps1
```

#### Linux/Mac (Bash):
```bash
cd scripts
chmod +x configure-domain.sh
./configure-domain.sh
```

### 3. Configuração Manual

#### 3.1 Console AWS Amplify
1. Acesse: https://console.aws.amazon.com/amplify/
2. Selecione o app: `d2d5j98tau5snm`
3. Vá para **Domain Management**
4. Clique em **Add domain**
5. Digite: `agrisync.com.br`
6. Configure subdomínio: `www` → `main`

#### 3.2 Configuração DNS
Configure os seguintes registros no seu provedor de domínio:

**Registro A (Raiz):**
- Nome: `@`
- Tipo: `A`
- Valor: `AWS_ALIAS`
- Alvo: `d2d5j98tau5snm.amplifyapp.com`

**Registro CNAME (www):**
- Nome: `www`
- Tipo: `CNAME`
- Valor: `agrisync.com.br`

**Registro CNAME (api):**
- Nome: `api`
- Tipo: `CNAME`
- Valor: `agrisync.com.br`

### 4. Verificação

#### 4.1 Teste de Resolução DNS:
```bash
# Teste domínio principal
nslookup agrisync.com.br

# Teste subdomínio
nslookup www.agroisync.com.br

# Teste conectividade
curl -I https://agrisync.com.br
```

#### 4.2 Status no AWS Amplify:
```bash
aws amplify get-domain-association \
    --app-id d2d5j98tau5snm \
    --domain-name agrisync.com.br
```

### 5. Troubleshooting

#### 5.1 Domínio não resolve:
- Verifique se os registros DNS estão corretos
- Aguarde propagação DNS (até 48 horas)
- Verifique se o domínio está ativo no provedor

#### 5.2 SSL não funciona:
- O SSL é configurado automaticamente pela AWS
- Pode levar até 24 horas para ser ativado
- Verifique se o domínio está validado

#### 5.3 Erro de configuração:
- Verifique se o app ID está correto
- Confirme se o branch `main` existe
- Verifique permissões AWS

### 6. URLs Finais
Após a configuração, as seguintes URLs estarão disponíveis:

- 🌐 **Principal:** https://agrisync.com.br
- 🌐 **Subdomínio:** https://www.agroisync.com.br
- 🌐 **API:** https://api.agrisync.com.br

### 7. Monitoramento
- ✅ Status do deploy no AWS Amplify
- ✅ Logs de acesso no CloudWatch
- ✅ Métricas de performance
- ✅ Alertas de disponibilidade

### 8. Suporte
Se houver problemas:
1. Verifique os logs do AWS Amplify
2. Consulte a documentação AWS
3. Abra um ticket de suporte AWS
4. Verifique o status do serviço

---

**⚠️ IMPORTANTE:** Após a configuração, aguarde até 48 horas para a propagação completa do DNS e ativação do SSL.
