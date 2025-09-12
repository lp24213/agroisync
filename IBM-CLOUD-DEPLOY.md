# AgroSync - Deploy no IBM Cloud

Este guia mostra como fazer deploy do AgroSync no IBM Cloud, removendo todas as dependências do AWS Amplify.

## 🚀 Pré-requisitos

- Conta no IBM Cloud
- Node.js 18+ instalado
- Git instalado
- IBM Cloud CLI instalado

## 📋 Serviços IBM Cloud Necessários

### 1. IBM Cloud App Service (ou Cloud Foundry)
- Para hospedar o backend Node.js
- Para hospedar o frontend React

### 2. IBM Cloud Databases for MongoDB
- Para o banco de dados principal

### 3. IBM Cloud Redis
- Para cache e sessões

### 4. IBM Cloud Object Storage
- Para upload de arquivos (opcional)

### 5. IBM Cloud App ID
- Para autenticação (opcional, pode usar JWT próprio)

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd agroisync
```

### 2. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure as variáveis de ambiente

#### Backend
```bash
cp env.ibm.example .env
# Edite o arquivo .env com suas configurações
```

#### Frontend
```bash
cp env.ibm.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Configure o IBM Cloud CLI
```bash
ibmcloud login
ibmcloud target --cf
```

## 🚀 Deploy

### 1. Deploy do Backend

#### Opção A: IBM Cloud App Service
```bash
cd backend
ibmcloud app push agroisync-backend
```

#### Opção B: Cloud Foundry
```bash
cd backend
ibmcloud cf push agroisync-backend
```

### 2. Deploy do Frontend

#### Opção A: IBM Cloud App Service
```bash
cd frontend
npm run build
ibmcloud app push agroisync-frontend
```

#### Opção B: Cloud Foundry
```bash
cd frontend
npm run build
ibmcloud cf push agroisync-frontend
```

## 🔧 Configurações Específicas

### 1. Banco de Dados MongoDB
- Crie uma instância do IBM Cloud Databases for MongoDB
- Configure a string de conexão no `.env`

### 2. Redis
- Crie uma instância do IBM Cloud Redis
- Configure a URL no `.env`

### 3. Object Storage (Opcional)
- Crie uma instância do IBM Cloud Object Storage
- Configure as credenciais no `.env`

### 4. App ID (Opcional)
- Crie uma instância do IBM Cloud App ID
- Configure as credenciais no `.env`

## 📝 Scripts de Deploy

### Deploy Completo
```bash
# Backend
cd backend
npm run build:production
ibmcloud app push agroisync-backend

# Frontend
cd ../frontend
npm run build:production
ibmcloud app push agroisync-frontend
```

### Deploy de Desenvolvimento
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```

## 🔍 Monitoramento

### 1. Logs
```bash
# Backend
ibmcloud app logs agroisync-backend

# Frontend
ibmcloud app logs agroisync-frontend
```

### 2. Status
```bash
# Backend
ibmcloud app status agroisync-backend

# Frontend
ibmcloud app status agroisync-frontend
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco de dados**
   - Verifique se o MongoDB está rodando
   - Verifique a string de conexão

2. **Erro de autenticação**
   - Verifique as configurações JWT
   - Verifique se o App ID está configurado corretamente

3. **Erro de upload de arquivos**
   - Verifique as configurações do Object Storage
   - Verifique as permissões

### Logs de Debug
```bash
# Habilitar logs de debug
export DEBUG=agrosync:*
npm start
```

## 📚 Recursos Adicionais

- [IBM Cloud Documentation](https://cloud.ibm.com/docs)
- [IBM Cloud CLI Reference](https://cloud.ibm.com/docs/cli)
- [IBM Cloud App Service](https://cloud.ibm.com/docs/app-service)
- [IBM Cloud Databases](https://cloud.ibm.com/docs/databases-for-mongodb)

## 🤝 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento ou consulte a documentação oficial do IBM Cloud.

---

**Nota**: Este projeto foi migrado do AWS Amplify para IBM Cloud. Todas as dependências AWS foram removidas e substituídas por alternativas compatíveis com IBM Cloud.
