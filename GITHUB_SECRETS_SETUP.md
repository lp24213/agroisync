# 🔐 Configuração de Secrets no GitHub

Este documento explica como configurar os secrets necessários para o deploy automático do AGROISYNC.

## 📋 Secrets Necessários

### 1. **AWS Credentials**
- `AWS_ACCESS_KEY_ID` - Sua AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY` - Sua AWS Secret Access Key

### 2. **Stripe Keys**
- `STRIPE_SECRET_KEY` - `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`

### 3. **Web3 Configuration**
- `METAMASK_ADMIN_ADDRESS` - `0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1`

## 🚀 Como Configurar

### Passo 1: Acessar Settings do Repositório
1. Vá para seu repositório no GitHub
2. Clique em **Settings** (aba)
3. No menu lateral, clique em **Secrets and variables**
4. Clique em **Actions**

### Passo 2: Adicionar Secrets
Para cada secret, clique em **New repository secret** e adicione:

#### AWS Credentials
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA... (sua AWS Access Key ID)

Name: AWS_SECRET_ACCESS_KEY
Value: ... (sua AWS Secret Access Key)
```

#### Stripe Secret Key
```
Name: STRIPE_SECRET_KEY
Value: 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
```

#### Metamask Admin Address
```
Name: METAMASK_ADMIN_ADDRESS
Value: 0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1
```

## 🔒 Segurança dos Secrets

### ✅ **Permitido:**
- Usar secrets no GitHub Actions
- Referenciar secrets em workflows
- Usar secrets em deploy automático

### ❌ **Nunca:**
- Commitar secrets no código
- Compartilhar secrets em logs
- Expor secrets em screenshots
- Usar secrets em branches públicas

## 🧪 Testando a Configuração

### 1. Verificar Secrets
```bash
# No workflow, você pode verificar se os secrets estão disponíveis
echo "Stripe Key: ${{ secrets.STRIPE_SECRET_KEY }}"
echo "Metamask: ${{ secrets.METAMASK_ADMIN_ADDRESS }}"
```

### 2. Testar Deploy
1. Faça push para a branch `main`
2. Verifique se o workflow é executado
3. Monitore os logs do deploy
4. Verifique se os recursos foram criados na AWS

## 🆘 Troubleshooting

### Erro: "Secret not found"
- Verifique se o nome do secret está correto
- Confirme se o secret foi adicionado ao repositório correto
- Verifique se o workflow está na branch correta

### Erro: "Access denied"
- Verifique se as credenciais AWS estão corretas
- Confirme se o usuário AWS tem permissões adequadas
- Verifique se a região está configurada corretamente

### Erro: "Parameter validation failed"
- Verifique se os valores dos secrets estão no formato correto
- Confirme se não há espaços extras ou caracteres especiais
- Verifique se o template SAM está correto

## 📊 Monitoramento

### GitHub Actions
- Verifique o status dos workflows na aba **Actions**
- Monitore os logs de execução
- Configure notificações para falhas

### AWS Console
- Verifique o status das stacks no CloudFormation
- Monitore os logs da Lambda no CloudWatch
- Verifique os recursos criados (S3, DynamoDB, etc.)

## 🔄 Rotação de Secrets

### Quando Rotacionar
- A cada 90 dias (recomendado)
- Após suspeita de comprometimento
- Após mudança de funcionários
- Após auditoria de segurança

### Como Rotacionar
1. Gere novos secrets
2. Atualize no GitHub
3. Teste o deploy
4. Remova os secrets antigos
5. Atualize a documentação

## 📞 Suporte

Para problemas com secrets ou deploy:
1. Verifique os logs do GitHub Actions
2. Consulte a documentação da AWS
3. Abra uma issue no repositório
4. Entre em contato com a equipe de DevOps

---

**⚠️ IMPORTANTE**: Mantenha seus secrets seguros e nunca os compartilhe publicamente!
