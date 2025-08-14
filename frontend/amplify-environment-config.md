# 🚀 Configuração de Ambiente AWS Amplify - AgroiSync

## 📋 Variáveis de Ambiente Necessárias

### 🔒 **VARIÁVEIS SECRETAS (SSM Parameter Store)**

Configure estas variáveis no **AWS Systems Manager Parameter Store** e referencie no Amplify Console:

```bash
# Firebase Configuration
/firebase/apiKey                    = "sua-api-key-firebase"
/firebase/authDomain                = "seu-projeto.firebaseapp.com"
/firebase/projectId                 = "seu-projeto-id"
/firebase/storageBucket             = "seu-projeto.appspot.com"
/firebase/messagingSenderId         = "123456789"
/firebase/appId                     = "1:123456789:web:abcdef123456"

# Solana Configuration
/solana/rpcEndpoint                 = "https://api.mainnet-beta.solana.com"
/solana/network                     = "mainnet-beta"
/solana/wsEndpoint                  = "wss://api.mainnet-beta.solana.com"

# Database Configuration
/database/mongoUri                  = "mongodb+srv://user:pass@cluster.mongodb.net/agroisync"
/database/jwtSecret                 = "seu-jwt-secret-super-seguro"

# API Configuration
/api/secretKey                      = "sua-api-secret-key"
/api/rateLimit                      = "1000"
```

### 🌐 **VARIÁVEIS PÚBLICAS (Amplify Console)**

Configure estas variáveis diretamente no **Amplify Console > Environment Variables**:

```bash
# Application Configuration
NODE_ENV                            = "production"
NEXT_TELEMETRY_DISABLED             = "1"
NEXT_PUBLIC_APP_NAME                = "AgroiSync"
NEXT_PUBLIC_APP_VERSION             = "1.0.0"

# Public URLs
NEXT_PUBLIC_APP_URL                 = "https://agroisync.com"
NEXT_PUBLIC_API_URL                 = "https://agroisync.com/api"
NEXT_PUBLIC_BASE_URL                = "https://agroisync.com"

# Firebase Public Config
NEXT_PUBLIC_FIREBASE_API_KEY        = "sua-api-key-publica"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN    = "seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID     = "seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789"
NEXT_PUBLIC_FIREBASE_APP_ID         = "1:123456789:web:abcdef123456"

# Solana Public Config
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT     = "https://api.mainnet-beta.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK          = "mainnet-beta"
NEXT_PUBLIC_SOLANA_WS_ENDPOINT      = "wss://api.mainnet-beta.solana.com"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS        = "true"
NEXT_PUBLIC_ENABLE_CRASH_REPORTING  = "true"
NEXT_PUBLIC_ENABLE_PERFORMANCE      = "true"
NEXT_PUBLIC_ENABLE_REMOTE_CONFIG    = "true"

# Build Configuration
NODE_OPTIONS                        = "--max-old-space-size=4096"
NPM_FLAGS                           = "--prefer-offline --no-audit"
```

## 🔧 **Configuração no AWS Amplify Console**

### **Passo 1: Acessar Environment Variables**
1. Vá para **AWS Amplify Console**
2. Selecione seu app **agroisync**
3. Clique em **App settings**
4. Clique em **Environment variables**

### **Passo 2: Adicionar Variáveis Públicas**
1. Clique em **Add environment variable**
2. Adicione cada variável da lista acima
3. **NÃO** marque como "Secret"

### **Passo 3: Configurar SSM Parameter Store**
1. Vá para **AWS Systems Manager**
2. Clique em **Parameter Store**
3. Crie cada parâmetro da lista de secretas
4. Use **SecureString** para valores sensíveis

### **Passo 4: Referenciar Secretas no Amplify**
1. No Amplify Console, adicione variáveis que referenciam SSM:
```bash
FIREBASE_API_KEY                    = "{{resolve:ssm:/firebase/apiKey}}"
FIREBASE_AUTH_DOMAIN                = "{{resolve:ssm:/firebase/authDomain}}"
# ... continue para todas as secretas
```

## 🚨 **IMPORTANTE: Permissões IAM**

### **Política IAM para Amplify Build Role**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:*:*:parameter/firebase/*",
        "arn:aws:ssm:*:*:parameter/solana/*",
        "arn:aws:ssm:*:*:parameter/database/*",
        "arn:aws:ssm:*:*:parameter/api/*"
      ]
    }
  ]
}
```

## ✅ **Verificação de Configuração**

### **Teste Local (antes do deploy)**
```bash
# Verificar se as variáveis estão sendo carregadas
npm run build

# Verificar se o build está funcionando
npm run start:standalone
```

### **Teste no Amplify**
1. Faça commit e push das alterações
2. Monitore o build no Amplify Console
3. Verifique os logs para confirmar que as variáveis estão sendo carregadas

## 🔍 **Troubleshooting**

### **Erro: "Failed to set up process.env.secrets"**
- Verifique se as variáveis SSM existem
- Confirme as permissões IAM do Amplify Build Role
- Verifique se os nomes dos parâmetros estão corretos

### **Erro: "Missing: @types/react, @types/react-dom"**
- Execute o script `sync-dependencies.js`
- Verifique se o package.json está correto
- Limpe node_modules e reinstale

### **Erro: "Node version incompatible"**
- Confirme que o amplify.yml está forçando Node 20.18.0
- Verifique se o package.json especifica Node >= 20.18.0

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs do build no Amplify Console
2. Confirme que todas as variáveis estão configuradas
3. Verifique as permissões IAM
4. Execute o script de sincronização localmente
