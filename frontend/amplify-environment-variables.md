# 🚀 Variáveis de Ambiente AWS Amplify - AgroiSync

## 📋 **VARIÁVEIS OBRIGATÓRIAS PARA FUNCIONAMENTO**

---

## 🔒 **VARIÁVEIS SECRETAS (SSM Parameter Store)**

### **Firebase Configuration**
```bash
/firebase/apiKey                    = "sua-api-key-firebase"
/firebase/authDomain                = "seu-projeto.firebaseapp.com"
/firebase/projectId                 = "seu-projeto-id"
/firebase/storageBucket             = "seu-projeto.appspot.com"
/firebase/messagingSenderId         = "123456789"
/firebase/appId                     = "1:123456789:web:abcdef123456"
/firebase/measurementId             = "G-XXXXXXXXXX"
```

### **Solana Configuration**
```bash
/solana/rpcEndpoint                 = "https://api.mainnet-beta.solana.com"
/solana/network                     = "mainnet-beta"
/solana/wsEndpoint                  = "wss://api.mainnet-beta.solana.com"
/solana/commitment                  = "confirmed"
/solana/airdropAmount               = "1000000000"
```

### **Database Configuration**
```bash
/database/mongoUri                  = "mongodb+srv://user:pass@cluster.mongodb.net/agroisync"
/database/jwtSecret                 = "seu-jwt-secret-super-seguro-256-bits"
/database/redisUrl                  = "redis://localhost:6379"
```

### **API Configuration**
```bash
/api/secretKey                      = "sua-api-secret-key-super-segura"
/api/rateLimit                      = "1000"
/api/corsOrigin                     = "https://agroisync.com"
```

### **Web3 Configuration**
```bash
/web3/ethereum/rpcUrl               = "https://mainnet.infura.io/v3/seu-projeto"
/web3/ethereum/wsUrl                = "wss://mainnet.infura.io/ws/v3/seu-projeto"
/web3/ethereum/chainId              = "1"
/web3/ethereum/privateKey           = "sua-private-key-ethereum"
```

---

## 🌐 **VARIÁVEIS PÚBLICAS (Amplify Console)**

### **Application Configuration**
```bash
NODE_ENV                            = "production"
NEXT_TELEMETRY_DISABLED             = "1"
NEXT_PUBLIC_APP_NAME                = "AgroiSync"
NEXT_PUBLIC_APP_VERSION             = "1.0.0"
NEXT_PUBLIC_APP_ENVIRONMENT         = "production"
```

### **Public URLs**
```bash
NEXT_PUBLIC_APP_URL                 = "https://agroisync.com"
NEXT_PUBLIC_API_URL                 = "https://agroisync.com/api"
NEXT_PUBLIC_BASE_URL                = "https://agroisync.com"
NEXT_PUBLIC_WEBSITE_URL             = "https://agroisync.com"
```

### **Firebase Public Config**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY        = "sua-api-key-publica"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN    = "seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID     = "seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789"
NEXT_PUBLIC_FIREBASE_APP_ID         = "1:123456789:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-XXXXXXXXXX"
```

### **Solana Public Config**
```bash
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT     = "https://api.mainnet-beta.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK          = "mainnet-beta"
NEXT_PUBLIC_SOLANA_WS_ENDPOINT      = "wss://api.mainnet-beta.solana.com"
NEXT_PUBLIC_SOLANA_COMMITMENT       = "confirmed"
```

### **Ethereum Public Config**
```bash
NEXT_PUBLIC_ETHEREUM_RPC_URL        = "https://mainnet.infura.io/v3/seu-projeto"
NEXT_PUBLIC_ETHEREUM_WS_URL         = "wss://mainnet.infura.io/ws/v3/seu-projeto"
NEXT_PUBLIC_ETHEREUM_CHAIN_ID       = "1"
NEXT_PUBLIC_ETHEREUM_NETWORK_NAME   = "mainnet"
```

### **Feature Flags**
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS        = "true"
NEXT_PUBLIC_ENABLE_CRASH_REPORTING  = "true"
NEXT_PUBLIC_ENABLE_PERFORMANCE      = "true"
NEXT_PUBLIC_ENABLE_REMOTE_CONFIG    = "true"
NEXT_PUBLIC_ENABLE_WEB3             = "true"
NEXT_PUBLIC_ENABLE_STAKING          = "true"
NEXT_PUBLIC_ENABLE_NFT_MARKETPLACE  = "true"
```

### **Build Configuration**
```bash
NODE_OPTIONS                        = "--max-old-space-size=4096"
NPM_FLAGS                           = "--prefer-offline --no-audit --no-fund"
NEXT_TELEMETRY_DISABLED             = "1"
NEXT_SHARP_PATH                     = "/opt/nodejs/node_modules/sharp"
```

---

## 🔧 **CONFIGURAÇÃO NO AWS AMPLIFY CONSOLE**

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
SOLANA_RPC_ENDPOINT                 = "{{resolve:ssm:/solana/rpcEndpoint}}"
DATABASE_MONGO_URI                  = "{{resolve:ssm:/database/mongoUri}}"
API_SECRET_KEY                      = "{{resolve:ssm:/api/secretKey}}"
```

---

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
        "arn:aws:ssm:*:*:parameter/api/*",
        "arn:aws:ssm:*:*:parameter/web3/*"
      ]
    }
  ]
}
```

---

## ✅ **VERIFICAÇÃO DE CONFIGURAÇÃO**

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

---

## 🔍 **TROUBLESHOOTING**

### **Erro: "Failed to set up process.env.secrets"**
- Verifique se as variáveis SSM existem
- Confirme as permissões IAM do Amplify Build Role
- Verifique se os nomes dos parâmetros estão corretos

### **Erro: "Missing environment variables"**
- Confirme que todas as variáveis públicas estão configuradas
- Verifique se as variáveis secretas estão referenciando SSM corretamente

### **Erro: "Build failed due to missing dependencies"**
- Execute o script `regenerate-lockfile.js`
- Verifique se o package.json está correto
- Confirme que Node.js 20+ está sendo usado

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verifique os logs do build no Amplify Console
2. Confirme que todas as variáveis estão configuradas
3. Verifique as permissões IAM
4. Execute o script de regeneração localmente
5. Monitore o uso de memória e CPU durante o build
