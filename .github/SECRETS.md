# AGROISYNC - GitHub Secrets Configuration

Este documento lista todos os secrets necessários para os workflows CI/CD do AGROISYNC na AWS.

## 🔐 Secrets Obrigatórios

### AWS Credentials
- **AWS_ACCESS_KEY_ID**: Chave de acesso AWS
- **AWS_SECRET_ACCESS_KEY**: Chave secreta AWS
- **AWS_REGION**: Região AWS (ex: us-east-1, eu-west-1)

### AWS Amplify
- **AMPLIFY_APP_ID**: ID da aplicação Amplify
- **AMPLIFY_BRANCH_NAME**: Nome da branch (ex: main, develop)

### AWS ECS
- **ECS_CLUSTER_NAME**: Nome do cluster ECS
- **ECS_SERVICE_NAME**: Nome do serviço ECS
- **ECS_TASK_DEFINITION**: Nome da definição de task ECS

### AWS ECR
- **ECR_REPOSITORY**: Nome do repositório ECR
- **ECR_REGISTRY**: URL do registro ECR

### AWS RDS
- **RDS_HOST**: Endpoint do banco de dados RDS
- **RDS_PORT**: Porta do banco de dados (ex: 5432)
- **RDS_DATABASE**: Nome do banco de dados
- **RDS_USERNAME**: Usuário do banco de dados

### AWS ElastiCache
- **REDIS_HOST**: Endpoint do Redis ElastiCache
- **REDIS_PORT**: Porta do Redis (ex: 6379)

### AWS S3
- **S3_BUCKET**: Nome do bucket S3
- **S3_REGION**: Região do bucket S3

### JWT e Segurança
- **JWT_SECRET**: Chave secreta para JWT
- **JWT_EXPIRES_IN**: Tempo de expiração JWT (ex: 24h)

### Email
- **SMTP_HOST**: Servidor SMTP
- **SMTP_PORT**: Porta SMTP (ex: 587)
- **SMTP_USER**: Usuário SMTP
- **SMTP_PASS**: Senha SMTP

### Monitoramento
- **SENTRY_DSN**: DSN do Sentry para monitoramento de erros
- **NEW_RELIC_LICENSE_KEY**: Chave de licença New Relic

### Blockchain
- **SOLANA_RPC_URL**: URL do RPC Solana
- **SOLANA_PRIVATE_KEY**: Chave privada Solana (para transações)

### APIs Externas
- **WEATHER_API_KEY**: Chave da API de clima
- **COMMODITIES_API_KEY**: Chave da API de commodities
- **PRICES_API_KEY**: Chave da API de preços

## 📋 Como Configurar

### 1. Acesse o Repositório
Vá para: https://github.com/lp24213/agroisync/settings/secrets/actions

### 2. Adicione os Secrets
Para cada secret listado acima:
1. Clique em "New repository secret"
2. Digite o nome do secret
3. Digite o valor do secret
4. Clique em "Add secret"

### 3. Verifique a Configuração
Após adicionar todos os secrets, verifique se estão configurados corretamente.

## 🔒 Segurança

- **NUNCA** commite secrets no código
- **NUNCA** compartilhe secrets publicamente
- Use variáveis de ambiente para desenvolvimento local
- Rotacione as chaves AWS regularmente

## 🚨 Troubleshooting

### Secret não encontrado
```
Error: Secret 'SECRET_NAME' not found
```
**Solução**: Verifique se o secret foi adicionado corretamente no GitHub.

### Permissão negada
```
Error: AccessDenied: User is not authorized
```
**Solução**: Verifique se as credenciais AWS têm as permissões necessárias.

### Região incorreta
```
Error: Could not connect to endpoint
```
**Solução**: Verifique se a região AWS está configurada corretamente.

## 📚 Links Úteis

- **GitHub Secrets**: https://github.com/lp24213/agroisync/settings/secrets/actions
- **AWS IAM**: https://console.aws.amazon.com/iam/
- **AWS Amplify**: https://console.aws.amazon.com/amplify/
- **AWS ECS**: https://console.aws.amazon.com/ecs/

## ✅ Checklist de Configuração

- [ ] AWS Credentials configurados
- [ ] AWS Amplify configurado
- [ ] AWS ECS configurado
- [ ] AWS ECR configurado
- [ ] AWS RDS configurado
- [ ] AWS ElastiCache configurado
- [ ] AWS S3 configurado
- [ ] JWT configurado
- [ ] Email configurado
- [ ] Monitoramento configurado
- [ ] Blockchain configurado
- [ ] APIs externas configuradas

## 🆘 Suporte

Se precisar de ajuda com a configuração dos secrets:
1. Verifique a documentação AWS
2. Consulte a equipe de DevOps
3. Abra uma issue no GitHub
4. Entre em contato: devops@agroisync.com 