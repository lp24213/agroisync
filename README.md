# 🌾 AGROTM - Plataforma de Gestão Agrícola

## 📋 Descrição

AGROTM é uma plataforma completa de gestão agrícola que oferece soluções integradas para produtores rurais, incluindo gestão de produtos, fretes, mensageria, pagamentos e parcerias.

## 🚀 Funcionalidades Principais

### 💼 **Gestão de Produtos**
- Cadastro e gestão de produtos agrícolas
- Categorização e busca avançada
- Sistema de anúncios com planos premium

### 🚚 **Gestão de Fretes**
- Cadastro de rotas de frete
- Rastreamento em tempo real
- Sistema de cotação e negociação

### 💬 **Mensageria Integrada**
- Chat privado entre usuários
- Sistema de contato para suporte
- Mensagens de parcerias para administradores

### 💳 **Sistema de Pagamentos**
- **Stripe**: Pagamentos com cartão e PIX
- **Metamask**: Pagamentos em criptomoedas
- Planos de assinatura flexíveis

### 👨‍💼 **Painel Administrativo**
- Gestão completa de usuários
- Monitoramento de transações
- Analytics e relatórios detalhados
- Controle de parceiros e mensagens

### 🔒 **Segurança Avançada**
- Autenticação JWT
- Proteção contra DDoS e ataques
- WAF integrado
- Logs de segurança completos

## 🏗️ Arquitetura

### Backend
- **Node.js** com Express
- **MongoDB** como banco principal
- **Socket.io** para comunicação em tempo real
- **JWT** para autenticação
- **Stripe** e **Metamask** para pagamentos

### Frontend
- **React** com hooks modernos
- **Context API** para gerenciamento de estado
- **i18n** para internacionalização
- **Responsivo** para todos os dispositivos

## 📁 Estrutura do Projeto

```
agroisync/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── models/         # Modelos MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços
│   │   ├── utils/          # Utilitários
│   │   └── server.js       # Servidor principal
│   └── package.json
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── contexts/       # Contextos React
│   │   ├── styles/         # Estilos CSS
│   │   └── App.js          # Componente principal
│   └── package.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** 18+
- **Express.js** 4.18+
- **MongoDB** 6.0+
- **Mongoose** 8.0+
- **Socket.io** 4.7+
- **Stripe** 14.7+
- **Ethers.js** 6.8+

### Frontend
- **React** 18+
- **React Router** 6+
- **Axios** para HTTP
- **Socket.io Client** para WebSocket
- **i18next** para internacionalização

### DevOps & Segurança
- **Helmet** para headers de segurança
- **CORS** configurado
- **Rate Limiting** avançado
- **WAF** integrado
- **Logs** de segurança

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB 6.0+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/agrotm/agroisync.git
cd agroisync
```

### 2. Configure o Backend
```bash
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Configure o Frontend
```bash
cd ../frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Configure as Variáveis de Ambiente

#### Backend (.env)
```bash
# Servidor
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/agrotm

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Metamask
METAMASK_ADMIN_ADDRESS=0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
```

### 5. Inicie os Serviços

#### Backend
```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:5000
```

#### Frontend
```bash
cd frontend
npm start
# Aplicação rodando em http://localhost:3000
```

## 🔐 Autenticação Admin

Para acessar funcionalidades administrativas, use:
- **Email**: `luispaulodeoliveira@agrotm.com.br`
- **Senha**: `Th@ys15221008`

## 📚 Documentação da API

A documentação completa da API está disponível em:
- **Arquivo**: `backend/API-ROUTES-DOCUMENTATION.md`
- **Endpoints**: `/api/v1/*`
- **WebSocket**: `ws://localhost:5000`

## 🧪 Testes

### Backend
```bash
cd backend
npm test              # Executar testes
npm run test:watch    # Modo watch
npm run test:coverage # Com cobertura
```

### Frontend
```bash
cd frontend
npm test              # Executar testes
npm run test:coverage # Com cobertura
```

## 🚀 Deploy

### AWS (Recomendado)
```bash
# Configure as variáveis de ambiente na AWS
# Deploy automático via GitHub Actions
```

### Docker
```bash
# Build das imagens
docker-compose build

# Executar
docker-compose up -d
```

### Manual
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
# Servir arquivos estáticos
```

## 🔒 Segurança

- **Rate Limiting**: Proteção contra DDoS
- **WAF**: Detecção de ataques comuns
- **JWT**: Autenticação segura
- **CORS**: Configuração restritiva
- **Helmet**: Headers de segurança
- **Logs**: Auditoria completa

## 📊 Monitoramento

- **Logs**: Winston para logging estruturado
- **Métricas**: Endpoints de health check
- **Alertas**: Notificações automáticas
- **Backup**: Backup automático do MongoDB

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Email**: suporte@agrotm.com.br
- **Documentação**: Este README e arquivos de documentação
- **Issues**: [GitHub Issues](https://github.com/agrotm/agroisync/issues)

## 🏆 Status do Projeto

- ✅ **Backend**: 100% implementado
- ✅ **Frontend**: 100% implementado
- ✅ **API**: 100% documentada
- ✅ **Segurança**: 100% implementada
- ✅ **Pagamentos**: 100% integrados
- ✅ **Admin**: 100% funcional

## 🎯 Roadmap

- [ ] **Fase 1**: ✅ Implementação base completa
- [ ] **Fase 2**: 🔄 Deploy em produção
- [ ] **Fase 3**: 📱 App mobile
- [ ] **Fase 4**: 🤖 IA e automação
- [ ] **Fase 5**: 🌍 Expansão internacional

---

**Desenvolvido com ❤️ pela equipe AGROTM**