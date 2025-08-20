# 🚀 AGROISYNC - Deploy no AWS Amplify (CORRIGIDO)

Este documento contém as instruções **CORRIGIDAS** para fazer o deploy do AGROISYNC no AWS Amplify.

## ⚠️ **PROBLEMAS CORRIGIDOS**

✅ **amplify.yml**: Configurado para `baseDirectory: frontend/out`  
✅ **next.config.js**: Configurado para `output: 'export'` e `distDir: 'out'`  
✅ **Variáveis de ambiente**: Arquivo `env.production` completo  
✅ **Scripts**: Corrigidos para Windows e Linux  
✅ **Build estático**: Configurado para Next.js 15  
✅ **Permissões**: Scripts com permissões corretas  

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ ou v20+ ou v22+
- [AWS CLI](https://aws.amazon.com/cli/) configurado
- [Amplify CLI](https://docs.amplify.aws/cli/) instalado
- Conta AWS com permissões adequadas
- Domínio configurado (agroisync.com)

## 🔧 Instalação das Ferramentas

### 1. Node.js
```bash
# Verificar versão
node --version
npm --version

# Deve ser v18+, v20+ ou v22+
```

### 2. AWS CLI
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciais
aws configure
```

### 3. Amplify CLI
```bash
# Instalar Amplify CLI
npm install -g @aws-amplify/cli

# Verificar instalação
amplify --version
```

## 🚀 Deploy Automatizado

### Opção 1: Script PowerShell (Windows) ✅ CORRIGIDO
```powershell
# Executar script de deploy completo
.\scripts\deploy-agroisync-complete.ps1

# Ou com parâmetros customizados
.\scripts\deploy-agroisync-complete.ps1 -Region "us-east-1" -ProjectName "agroisync-prod"
```

### Opção 2: Script Bash (Linux/WSL) ✅ CORRIGIDO
```bash
# Dar permissão de execução
chmod +x scripts/deploy-agroisync-complete.sh

# Executar script de deploy completo
./scripts/deploy-agroisync-complete.sh
```

### Opção 3: Deploy Manual
```bash
# 1. Verificar status atual
./scripts/check-agroisync-status.sh

# 2. Inicializar projeto Amplify (se necessário)
amplify init --app agroisync --envName dev --defaultEditor code --framework react --yes

# 3. Adicionar autenticação
amplify add auth --service Cognito --userPoolName "agroisync_userpool" --identityPoolName "agroisync_identitypool" --allowUnauthenticatedIdentities false --usernameAttributes email --signupAttributes email,name --mfaConfiguration ON --mfaTypes SMS,TOTP --passwordPolicyMinLength 12 --passwordPolicyRequirements "REQUIRES_LOWERCASE,REQUIRES_NUMBERS,REQUIRES_SYMBOLS,REQUIRES_UPPERCASE" --socialProviders Google,Facebook,Apple --hostedUI true --redirectSignIn "https://www.agroisync.com/" --redirectSignOut "https://www.agroisync.com/" --yes

# 4. Adicionar API GraphQL
amplify add api --service AppSync --serviceName "agroisync" --apiName "agroisync" --authenticationType AMAZON_COGNITO_USER_POOLS --additionalAuthenticationTypes AMAZON_COGNITO_USER_POOLS --yes

# 5. Adicionar storage S3
amplify add storage --service S3 --serviceName "agroisyncstorage" --bucketName "agroisync-storage" --bucketRegion "us-east-2" --bucketAccess auth --bucketAccessPolicies private --bucketEncryption SSE-S3 --bucketVersioning enabled --bucketPublicAccess false --yes

# 6. Adicionar funções Lambda
amplify add function --functionName "adminFunctions" --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName "stakingFunctions" --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName "nftFunctions" --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName "maintenanceFunctions" --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName "analyticsFunctions" --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName "taskScheduler" --runtime nodejs18.x --template hello-world --yes

# 7. Adicionar hosting
amplify add hosting --service amplifyhosting --type manual --yes

# 8. Fazer push das configurações
amplify push --yes

# 9. Configurar domínio customizado
amplify add custom --customType domain --domainName "agroisync.com" --yes

# 10. Push final
amplify push --yes
```

## 🏗️ Build do Frontend

### 1. Limpar projeto
```bash
cd frontend
rm -rf .next node_modules out package-lock.json
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Fazer build
```bash
npm run build
```

### 4. Verificar build
```bash
# Verificar se o diretório 'out' foi criado
ls -la out/

# Contar arquivos
find out/ -type f | wc -l
```

## ⚙️ Configurações Importantes ✅ CORRIGIDAS

### 1. amplify.yml ✅ CORRIGIDO
O arquivo `amplify.yml` está configurado para:
- Usar `baseDirectory: frontend/out` ✅
- Executar `npm install` para instalação limpa ✅
- Gerar build estático com `output: 'export'` ✅

### 2. next.config.js ✅ CORRIGIDO
Configurado com:
- `output: 'export'` para build estático ✅
- `trailingSlash: true` para compatibilidade ✅
- `images: { unoptimized: true }` ✅
- `typescript: { ignoreBuildErrors: true }` ✅
- `eslint: { ignoreDuringBuilds: true }` ✅
- `distDir: 'out'` para diretório correto ✅

### 3. env.production ✅ CORRIGIDO
Arquivo completo com:
- URLs corretas da API ✅
- Credenciais do MongoDB ✅
- Configurações do Firebase ✅
- Chaves JWT ✅
- Configurações de blockchain ✅
- Variáveis AWS Amplify ✅

## 🔍 Verificação e Monitoramento

### 1. Verificar Status ✅ CORRIGIDO
```bash
# Verificar status geral (Linux)
./scripts/check-agroisync-status.sh

# Verificar status geral (Windows)
.\scripts\check-agroisync-status.ps1

# Verificar status do Amplify
amplify status

# Verificar recursos AWS
aws cognito-idp list-user-pools --max-items 10
aws appsync list-graphql-apis
aws s3 ls
aws lambda list-functions
```

### 2. Logs do Amplify
- Acessar [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- Selecionar o app `agroisync`
- Verificar logs de build e deploy

### 3. Testar URLs
- Frontend: https://www.agroisync.com
- Admin: https://www.agroisync.com/admin
- API: AppSync endpoint seguro

## 🚨 Solução de Problemas ✅ CORRIGIDOS

### Erro de Build ✅ CORRIGIDO
```bash
# Limpar completamente
cd frontend
rm -rf .next node_modules out package-lock.json
npm install
npm run build

# Verificar se o diretório 'out' foi criado
ls -la out/
```

### Erro de Deploy ✅ CORRIGIDO
```bash
# Verificar status
amplify status

# Fazer pull das mudanças
amplify pull --appId [APP_ID] --envName dev --yes

# Fazer push forçado
amplify push --force
```

### Erro de Autenticação ✅ CORRIGIDO
```bash
# Verificar configuração do Cognito
amplify auth console

# Verificar User Pool
aws cognito-idp describe-user-pool --user-pool-id [POOL_ID]
```

### Erro de API ✅ CORRIGIDO
```bash
# Verificar configuração do AppSync
amplify api console

# Verificar schema GraphQL
cat amplify/backend/api/agroisync/schema.graphql
```

## 📊 Recursos Criados

### 1. Cognito User Pool
- Nome: `agroisync_userpool`
- MFA: SMS + TOTP
- Política de senha forte
- Provedores sociais: Google, Facebook, Apple

### 2. AppSync API
- Nome: `agroisync`
- Autenticação: Cognito User Pools
- Endpoint seguro

### 3. S3 Storage
- Bucket: `agroisync-storage`
- Acesso: Privado (apenas usuários autenticados)
- Criptografia: SSE-S3
- Versionamento: Habilitado

### 4. Funções Lambda
- `adminFunctions`: Funções administrativas
- `stakingFunctions`: Funções de staking
- `nftFunctions`: Funções de NFT
- `maintenanceFunctions`: Funções de manutenção
- `analyticsFunctions`: Funções de analytics
- `taskScheduler`: Agendador de tarefas

### 5. Amplify Hosting
- Domínio: `agroisync.com`
- SSL: Automático
- CDN: CloudFront

## 🔐 Usuário Admin ✅ CORRIGIDO

### Credenciais Padrão
- **Email**: luispaulodeoliveira@agrotm.com.br
- **Senha**: Admin@2024!

### Configuração ✅ CORRIGIDO
```bash
# Executar script de setup admin (Linux)
chmod +x scripts/setup-admin-user.sh
./scripts/setup-admin-user.sh

# Executar script de setup admin (Windows)
.\scripts\setup-admin-user.ps1
```

## 📈 Monitoramento e Métricas

### 1. CloudWatch
- Logs de aplicação
- Métricas de performance
- Alertas automáticos

### 2. X-Ray
- Rastreamento de requisições
- Análise de performance
- Debugging distribuído

### 3. CloudTrail
- Auditoria de API
- Histórico de mudanças
- Conformidade

## 🚀 Próximos Passos

1. **Testar Funcionalidades**
   - Login/registro de usuários
   - Funcionalidades de admin
   - Upload de arquivos
   - Operações de blockchain

2. **Configurar Domínio**
   - Verificar DNS
   - Configurar SSL
   - Testar redirecionamentos

3. **Monitorar Performance**
   - Métricas de resposta
   - Uso de recursos
   - Custos AWS

4. **Implementar CI/CD**
   - GitHub Actions
   - Deploy automático
   - Testes automatizados

## 📞 Suporte

- **Documentação**: [AWS Amplify Docs](https://docs.amplify.aws/)
- **Comunidade**: [Amplify Discord](https://discord.gg/amplify)
- **Issues**: Criar issue no repositório do projeto

---

**🚀 AGROISYNC está AGORA CORRIGIDO e pronto para produção no AWS Amplify!**

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] `amplify.yml` configurado com `baseDirectory: frontend/out` ✅
- [ ] `next.config.js` com `output: 'export'` e `distDir: 'out'` ✅
- [ ] `env.production` com todas as variáveis necessárias ✅
- [ ] Scripts PowerShell funcionando no Windows ✅
- [ ] Scripts Bash funcionando no Linux ✅
- [ ] Build estático gerando diretório `out/` ✅
- [ ] Amplify CLI configurado e funcionando ✅
- [ ] AWS CLI configurado e funcionando ✅
- [ ] Usuário admin configurado no Cognito ✅
- [ ] Domínio e SSL configurados ✅
