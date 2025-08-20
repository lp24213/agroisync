# 🚀 AGROISYNC - Deploy Completo no AWS Amplify

Este documento descreve o processo completo de deploy do AGROISYNC no AWS Amplify, incluindo todas as funcionalidades de backend e frontend.

## 📋 Pré-requisitos

### 1. Ferramentas Necessárias
- **AWS CLI** configurado com credenciais válidas
- **Amplify CLI** instalado globalmente
- **Node.js** versão 18+ 
- **npm** ou **yarn**
- **Git** configurado

### 2. Conta AWS
- Conta AWS ativa com permissões de administrador
- Região: `us-east-2` (configurada por padrão)
- Domínio: `agroisync.com` (deve estar configurado no Route 53)

## 🔧 Instalação e Configuração

### 1. Instalar Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### 2. Configurar AWS CLI
```bash
aws configure
# AWS Access Key ID: [sua-access-key]
# AWS Secret Access Key: [sua-secret-key]
# Default region name: us-east-2
# Default output format: json
```

### 3. Configurar Amplify CLI
```bash
amplify configure
# Follow the prompts to configure your AWS account
```

## 🚀 Deploy Automatizado

### Opção 1: Script Completo (Recomendado)
```bash
# Tornar executável
chmod +x scripts/deploy-agroisync-complete.sh

# Executar deploy completo
./scripts/deploy-agroisync-complete.sh
```

### Opção 2: Deploy Manual
```bash
# 1. Inicializar projeto
amplify init --app agroisync --envName dev --defaultEditor code --framework react --yes

# 2. Adicionar autenticação
amplify add auth --service Cognito --userPoolName "agroisync_userpool" --identityPoolName "agroisync_identitypool" --allowUnauthenticatedIdentities false --usernameAttributes email --signupAttributes email,name --mfaConfiguration ON --mfaTypes SMS,TOTP --passwordPolicyMinLength 12 --passwordPolicyRequirements "REQUIRES_LOWERCASE,REQUIRES_NUMBERS,REQUIRES_SYMBOLS,REQUIRES_UPPERCASE" --socialProviders Google,Facebook,Apple --hostedUI true --redirectSignIn "https://www.agroisync.com/" --redirectSignOut "https://www.agroisync.com/" --yes

# 3. Adicionar API GraphQL
amplify add api --service AppSync --serviceName agroisync --apiName agroisync --authenticationType AMAZON_COGNITO_USER_POOLS --additionalAuthenticationTypes AMAZON_COGNITO_USER_POOLS --yes

# 4. Adicionar storage S3
amplify add storage --service S3 --serviceName "agroisyncstorage" --bucketName "agroisync-storage" --bucketRegion us-east-2 --bucketAccess auth --bucketAccessPolicies private --bucketEncryption SSE-S3 --bucketVersioning enabled --bucketPublicAccess false --yes

# 5. Adicionar funções Lambda
amplify add function --functionName adminFunctions --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName stakingFunctions --runtime nodejs18.x --template hello-world --yes
amplify add function --functionName nftFunctions --runtime nodejs18.x --template hello-world --yes

# 6. Adicionar hosting
amplify add hosting --service amplifyhosting --type manual --yes

# 7. Fazer push
amplify push --yes
```

## 🔐 Configuração do Usuário Admin

Após o deploy, configure o usuário admin:

```bash
# Tornar executável
chmod +x scripts/setup-admin-user.sh

# Executar configuração
./scripts/setup-admin-user.sh
```

**Credenciais Admin:**
- **Email:** luispaulodeoliveira@agrotm.com.br
- **Senha:** Admin@2024!
- **Grupo:** admin
- **Role:** SUPER_ADMIN

## 🏗️ Estrutura do Backend

### 1. Autenticação (Cognito)
- **Grupos:** admin, user
- **MFA:** SMS + TOTP obrigatório
- **Política de senha:** 12+ caracteres, maiúsculas, minúsculas, números, símbolos
- **Login social:** Google, Facebook, Apple
- **Verificação:** Email obrigatório

### 2. API GraphQL (AppSync)
- **Autenticação:** Cognito User Pools
- **Schema:** Completo com todas as entidades
- **Autorização:** Baseada em grupos e ownership
- **Zero permissões públicas**

### 3. Storage (S3)
- **Bucket:** agroisync-storage
- **Acesso:** Apenas usuários autenticados
- **Criptografia:** SSE-S3
- **Versionamento:** Habilitado
- **Acesso público:** Desabilitado

### 4. Funções Lambda
- **adminFunctions:** Operações administrativas
- **stakingFunctions:** Funcionalidades de staking
- **nftFunctions:** Operações de NFT

## 📊 Schema GraphQL

### Entidades Principais
- **User:** Usuários com grupos e roles
- **Property:** Propriedades rurais
- **Product:** Produtos do marketplace
- **Transaction:** Transações financeiras
- **StakingPool/StakingRecord:** Sistema de staking
- **NFT:** Tokens não fungíveis
- **Upload:** Sistema de arquivos
- **ChatMessage:** Sistema de chat
- **Notification:** Sistema de notificações

### Regras de Autorização
- **admin:** CRUD completo em todas as entidades
- **user:** Leitura em entidades públicas, CRUD em próprias
- **owner:** CRUD completo em entidades próprias

## 🌐 Frontend

### Tecnologias
- **Next.js 14** com TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **AWS Amplify** para integração
- **i18n** para multilíngue

### Funcionalidades
- **Layout responsivo** com animações
- **Sistema de autenticação** completo
- **Dashboard** administrativo e de usuário
- **Marketplace** de produtos
- **Sistema de staking** integrado
- **Gestão de NFTs**
- **Chatbot** em todas as páginas
- **Suporte multilíngue** (PT, EN, ES)

## 🔒 Segurança

### 1. Autenticação
- MFA obrigatório
- Política de senha forte
- Sessões com expiração
- Tokens JWT seguros

### 2. Autorização
- Zero permissões públicas
- Controle baseado em grupos
- Verificação de ownership
- Validação de entrada

### 3. Dados
- Criptografia em trânsito (HTTPS)
- Criptografia em repouso (SSE-S3)
- Logs de auditoria
- Backup automático

## 📱 Funcionalidades Avançadas

### 1. Staking e DeFi
- Pools de staking configuráveis
- Cálculo automático de APY
- Sistema de recompensas
- Histórico de transações

### 2. Sistema NFT
- Criação e mint de NFTs
- Metadados personalizáveis
- Coleções organizadas
- Marketplace de NFTs

### 3. Analytics
- Métricas de usuário
- Relatórios personalizáveis
- Dashboard administrativo
- Exportação de dados

## 🚀 Deploy e Hosting

### 1. Amplify Hosting
- Deploy automático via Git
- Build otimizado para produção
- CDN global
- SSL automático

### 2. Domínio Customizado
- **Principal:** https://www.agroisync.com
- **Admin:** https://www.agroisync.com/admin
- **API:** AppSync endpoint seguro

### 3. CI/CD
- Deploy automático no push
- Rollback em caso de erro
- Preview deployments
- Branch deployments

## 📋 Checklist de Deploy

### ✅ Pré-deploy
- [ ] AWS CLI configurado
- [ ] Amplify CLI instalado
- [ ] Domínio configurado no Route 53
- [ ] Credenciais AWS válidas

### ✅ Backend
- [ ] Autenticação Cognito configurada
- [ ] API GraphQL criada
- [ ] Storage S3 configurado
- [ ] Funções Lambda criadas
- [ ] Schema GraphQL aplicado

### ✅ Frontend
- [ ] Build do Next.js
- [ ] Configuração do Amplify
- [ ] Integração com backend
- [ ] Testes de funcionalidade

### ✅ Produção
- [ ] Usuário admin criado
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Monitoramento configurado

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Build
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Erro de Autenticação
```bash
# Verificar configuração Cognito
amplify status
amplify push --force
```

#### 3. Erro de Storage
```bash
# Verificar permissões S3
aws s3 ls s3://agroisync-storage
```

#### 4. Erro de API
```bash
# Verificar schema GraphQL
amplify codegen
amplify push
```

## 📞 Suporte

### Contatos
- **Desenvolvedor:** Luis Paulo de Oliveira
- **Email:** luispaulodeoliveira@agrotm.com.br
- **Projeto:** AGROISYNC

### Recursos
- **Documentação AWS:** https://docs.aws.amazon.com/
- **Amplify Docs:** https://docs.amplify.aws/
- **Console AWS:** https://console.aws.amazon.com/

## 🎉 Conclusão

O AGROISYNC está configurado como uma plataforma completa e segura no AWS Amplify, com:

- ✅ Backend 100% seguro sem permissões públicas
- ✅ Autenticação robusta com MFA
- ✅ API GraphQL completa e funcional
- ✅ Storage S3 privado e criptografado
- ✅ Funções Lambda para funcionalidades avançadas
- ✅ Frontend moderno e responsivo
- ✅ Sistema de staking e NFTs
- ✅ Hosting profissional com domínio customizado

**🚀 AGROISYNC está pronto para produção!**
