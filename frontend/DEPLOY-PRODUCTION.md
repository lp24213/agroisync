# 🚀 AGROISYNC - Deploy de Produção

Este documento contém todas as instruções necessárias para fazer o deploy de produção do AGROISYNC no AWS Amplify.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn instalado
- Conta AWS configurada
- AWS Amplify CLI configurado (opcional)
- Acesso ao console AWS Amplify

## 🔧 Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie o arquivo `env.production` com as seguintes configurações:

```bash
# Configurações de Produção AGROISYNC
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://agroisync.com/api

# MongoDB Atlas (substituir com credenciais reais)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agroisync?retryWrites=true&w=majority

# Firebase (substituir com credenciais reais)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agroisync.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agroisync
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agroisync.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# JWT Secret (substituir com chave segura real)
JWT_SECRET=agroisync_super_secret_jwt_key_2024_production

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=public/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative a autenticação por email/senha
4. Configure o Firestore Database
5. Configure o Storage
6. Copie as credenciais para o arquivo `env.production`

### 3. Configuração do MongoDB

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster
3. Configure o acesso de rede (0.0.0.0/0 para desenvolvimento)
4. Crie um usuário com permissões de leitura/escrita
5. Copie a string de conexão para o arquivo `env.production`

## 🚀 Deploy Automatizado

### Windows (PowerShell)

```powershell
# Navegar para o diretório frontend
cd frontend

# Executar script de deploy
.\scripts\deploy-production.ps1

# Ou forçar deploy ignorando vulnerabilidades
.\scripts\deploy-production.ps1 -Force
```

### Linux/macOS (Bash)

```bash
# Navegar para o diretório frontend
cd frontend

# Tornar script executável
chmod +x scripts/deploy-production.sh

# Executar script de deploy
./scripts/deploy-production.sh
```

## 🔨 Deploy Manual

### 1. Preparar o Build

```bash
# Limpar instalações anteriores
rm -rf node_modules .next out

# Instalar dependências de produção
npm ci --only=production

# Configurar variáveis de ambiente
cp env.production .env.production

# Executar build
npm run build
```

### 2. Verificar o Build

```bash
# Verificar se o build foi criado
ls -la .next/

# Verificar tamanho do build
du -sh .next/

# Verificar se há arquivos estáticos
ls -la .next/static/
```

## 🌐 AWS Amplify

### 1. Configuração do Build

Use o arquivo `amplify-production.yml` no console do AWS Amplify:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Instalando dependências..."
        - npm ci --only=production
        - echo "Verificando versão do Node.js..."
        - node --version
        - echo "Verificando versão do npm..."
        - npm --version
    build:
      commands:
        - echo "Configurando variáveis de ambiente..."
        - cp env.production .env.production
        - echo "Executando build de produção..."
        - npm run build
        - echo "Build concluído com sucesso!"
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 2. Variáveis de Ambiente no Amplify

Configure as seguintes variáveis de ambiente no console do Amplify:

- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: `https://agroisync.com/api`
- `MONGODB_URI`: Sua string de conexão MongoDB
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Sua chave API do Firebase
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Seu domínio Firebase
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Seu ID do projeto Firebase
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Seu bucket de storage
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Seu sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Seu app ID
- `JWT_SECRET`: Sua chave JWT secreta

### 3. Configuração do Domínio

1. No console do Amplify, vá para "Domain management"
2. Clique em "Add domain"
3. Digite seu domínio personalizado
4. Configure os registros DNS conforme solicitado
5. Aguarde a validação do domínio

## 🔍 Verificação Pós-Deploy

### 1. Testar Funcionalidades

- [ ] Página inicial carrega sem erros
- [ ] Autenticação funciona (login/registro)
- [ ] Página de administração é acessível apenas para admins
- [ ] APIs respondem corretamente
- [ ] Upload de arquivos funciona
- [ ] Marketplace e propriedades carregam
- [ ] Dashboard funciona
- [ ] Staking funciona
- [ ] Chatbot responde

### 2. Verificar Logs

- Acesse o console do Amplify
- Vá para "Build history"
- Clique no build mais recente
- Verifique os logs em busca de erros

### 3. Monitoramento

- Configure alertas no CloudWatch
- Monitore métricas de performance
- Verifique logs de erro
- Monitore uso de recursos

## 🚨 Troubleshooting

### Build Falha

1. Verifique as variáveis de ambiente
2. Verifique se todas as dependências estão instaladas
3. Verifique se o Node.js é versão 18+
4. Verifique os logs de build no console

### Erro de Autenticação

1. Verifique as credenciais do Firebase
2. Verifique se a autenticação está ativada
3. Verifique as regras de segurança do Firestore

### Erro de Banco de Dados

1. Verifique a string de conexão MongoDB
2. Verifique as regras de acesso de rede
3. Verifique se o usuário tem permissões adequadas

### Erro de Upload

1. Verifique as configurações de storage
2. Verifique as regras de segurança
3. Verifique o tamanho máximo de arquivo

## 📞 Suporte

Para suporte técnico:

- Email: luispaulodeoliveira@agrotm.com.br
- Documentação: [Link para documentação]
- Issues: [Link para repositório]

## 🔐 Segurança

- Nunca commite credenciais no repositório
- Use variáveis de ambiente para todas as configurações sensíveis
- Configure HTTPS para todas as comunicações
- Implemente rate limiting
- Configure CORS adequadamente
- Monitore logs de acesso
- Implemente autenticação em todas as rotas sensíveis

## 📊 Métricas de Performance

- Tamanho do bundle: < 500KB
- Tempo de carregamento inicial: < 3s
- Tempo de resposta da API: < 500ms
- Uptime: > 99.9%

---

**Última atualização**: $(Get-Date)
**Versão**: 2.3.1
**Status**: ✅ Pronto para Produção
