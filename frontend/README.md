# AgroSync Frontend

Plataforma revolucionária que combina blockchain e inteligência artificial para transformar o agronegócio.

## 🚀 Funcionalidades

- **Marketplace**: Compra e venda de produtos agrícolas
- **Propriedades**: Investimentos em terras rurais tokenizadas
- **Staking**: Pools de staking com rendimentos atrativos
- **Dashboard**: Visão completa do portfólio e transações
- **Chatbot**: Assistente inteligente com suporte a texto, voz e imagem
- **Multilíngue**: Suporte para PT, EN, ES, ZH
- **Autenticação**: Sistema seguro com Firebase e JWT

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Banco de Dados**: MongoDB Atlas
- **Autenticação**: Firebase Auth, JWT
- **Upload**: Formidable para arquivos
- **Ícones**: Heroicons

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- MongoDB Atlas (ou local)
- Firebase Project
- Conta no GitHub

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/agroisync.git
cd agroisync/frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Edite o arquivo com suas configurações:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agroisync

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Configure o MongoDB

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um novo cluster
3. Configure o acesso de rede (IP 0.0.0.0/0 para desenvolvimento)
4. Crie um usuário com permissões de leitura/escrita
5. Copie a string de conexão para `MONGODB_URI`

### 5. Configure o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication e Firestore
3. Configure o método de autenticação (Email/Senha)
4. Copie as configurações para o arquivo `.env.local`

### 6. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

## 🗄️ Estrutura do Banco de Dados

### Coleções MongoDB

- **users**: Usuários da plataforma
- **products**: Produtos do marketplace
- **properties**: Propriedades rurais
- **staking_pools**: Pools de staking
- **transactions**: Histórico de transações
- **chat_messages**: Mensagens do chatbot
- **translations**: Traduções multilíngue
- **uploaded_files**: Arquivos enviados

### Índices Recomendados

```javascript
// users
db.users.createIndex({ "email": 1 }, { unique: true })

// products
db.products.createIndex({ "category": 1, "createdAt": -1 })
db.products.createIndex({ "tags": 1 })

// properties
db.properties.createIndex({ "type": 1, "location": 1 })
db.properties.createIndex({ "price": 1 })

// transactions
db.transactions.createIndex({ "userId": 1, "createdAt": -1 })

// chat_messages
db.chat_messages.createIndex({ "userId": 1, "sessionId": 1 })
```

## 🔌 APIs Disponíveis

### Autenticação
- `POST /api/auth` - Login, registro e verificação

### Marketplace
- `GET /api/marketplace` - Listar produtos
- `POST /api/marketplace` - Criar produto

### Propriedades
- `GET /api/properties` - Listar propriedades
- `POST /api/properties` - Criar propriedade

### Dashboard
- `GET /api/dashboard` - Dados do dashboard
- `POST /api/dashboard` - Criar dados

### Staking
- `GET /api/staking` - Dados de staking
- `POST /api/staking` - Ações de staking

### Chatbot
- `POST /api/chatbot` - Enviar mensagem
- `GET /api/chatbot` - Histórico

### Traduções
- `GET /api/translations` - Buscar traduções
- `POST /api/translations` - Criar/atualizar

### Upload
- `POST /api/upload` - Enviar arquivo
- `GET /api/upload` - Listar arquivos
- `DELETE /api/upload` - Remover arquivo

## 🎨 Personalização

### Cores e Tema

Edite `tailwind.config.js` para personalizar:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... suas cores
        }
      }
    }
  }
}
```

### Traduções

Adicione novas chaves em `src/i18n/locales/`:

```typescript
// pt.ts
export const pt = {
  nova_chave: 'Novo texto em português',
  // ...
}

// en.ts
export const en = {
  nova_chave: 'New text in English',
  // ...
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Configure build command e output directory
- **AWS Amplify**: Conecte via GitHub e configure build
- **DigitalOcean App Platform**: Deploy via GitHub

## 🧪 Testes

```bash
# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build de produção
npm run build
```

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔒 Segurança

- Autenticação JWT com expiração
- Senhas criptografadas com bcrypt
- Validação de entrada em todas as APIs
- CORS configurado adequadamente
- Rate limiting recomendado para produção

## 📈 Performance

- Lazy loading de componentes
- Otimização de imagens com Next.js
- Bundle splitting automático
- Cache de API responses
- Compressão gzip

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@agroisync.com
- 💬 Discord: [Link do servidor]
- 📖 Documentação: [Link da docs]
- 🐛 Issues: [GitHub Issues]

## 🙏 Agradecimentos

- Next.js Team
- MongoDB Team
- Firebase Team
- Tailwind CSS Team
- Heroicons Team

---

**AgroSync** - Revolucionando o Agronegócio com Tecnologia Blockchain e IA 🚀🌾
