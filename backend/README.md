# AGROTM Backend API

Backend profissional e robusto para a plataforma AGROTM - Plataforma de Agronegócio com Blockchain.

## 🚀 Características

- **API RESTful** completa com autenticação JWT
- **Sistema de logging** profissional com Winston
- **Validação de dados** com express-validator
- **Upload de arquivos** com Multer e Sharp
- **Rate limiting** e segurança com Helmet
- **Compressão** de respostas
- **Health checks** para monitoramento
- **Testes automatizados** com Jest
- **Docker** configurado para produção
- **Deploy automático** no Railway

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- npm >= 8.0.0
- PostgreSQL (opcional para desenvolvimento)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/lp24213/agrotm.sol.git
cd agrotm.sol/backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor com nodemon
npm run build        # Build do projeto
npm run test         # Executa os testes
npm run test:watch   # Executa os testes em modo watch
npm run test:coverage # Executa os testes com cobertura

# Qualidade de código
npm run lint         # Executa o ESLint
npm run lint:fix     # Corrige problemas do ESLint
npm run format       # Formata o código com Prettier

# Segurança
npm run security     # Verifica vulnerabilidades
npm run security:fix # Corrige vulnerabilidades

# Docker
npm run docker:build # Build da imagem Docker
npm run docker:run   # Executa o container Docker

# Utilitários
npm run health       # Testa o health check
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obter usuário atual

### Usuários
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/wallet` - Obter carteira do usuário

### Staking
- `GET /api/staking/pools` - Listar pools de staking
- `GET /api/staking/pools/:id` - Obter pool específico
- `POST /api/staking/stake` - Fazer staking
- `POST /api/staking/unstake` - Remover staking
- `GET /api/staking/rewards` - Obter recompensas
- `GET /api/staking/history` - Histórico de staking

### NFTs
- `GET /api/nfts` - Listar NFTs
- `GET /api/nfts/:id` - Obter NFT específico
- `POST /api/nfts/mint` - Mintar NFT
- `PUT /api/nfts/:id` - Atualizar NFT
- `POST /api/nfts/:id/transfer` - Transferir NFT
- `GET /api/nfts/user/:wallet` - NFTs do usuário

### Analytics
- `GET /api/analytics/dashboard` - Dados do dashboard
- `GET /api/analytics/portfolio` - Portfólio do usuário
- `GET /api/analytics/market` - Dados de mercado
- `GET /api/analytics/staking` - Analytics de staking

### Contato
- `POST /api/contact` - Enviar mensagem de contato
- `GET /api/contact/info` - Informações de contato
- `POST /api/contact/support` - Solicitar suporte

### Upload
- `POST /api/upload/image` - Upload de imagem
- `POST /api/upload/images` - Upload múltiplas imagens
- `POST /api/upload/document` - Upload de documento
- `DELETE /api/upload/:filename` - Deletar arquivo
- `GET /api/upload/files` - Listar arquivos

### Health Check
- `GET /health` - Health check básico
- `GET /api/health/detailed` - Health check detalhado
- `GET /api/health/ready` - Verificação de readiness
- `GET /api/health/live` - Verificação de liveness

### Documentação
- `GET /api/docs` - Documentação da API
- `GET /` - Informações da API

## 🔒 Segurança

- **Helmet** para headers de segurança
- **CORS** configurado
- **Rate limiting** para prevenir abuso
- **Validação de entrada** com express-validator
- **Autenticação JWT** com expiração
- **Sanitização de dados**
- **Logs de auditoria**

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## 🐳 Docker

```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run

# Ou usar docker-compose
docker-compose up -d
```

## 🚀 Deploy

### Railway
O projeto está configurado para deploy automático no Railway:

1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente
3. O deploy será automático a cada push

### Variáveis de Ambiente Necessárias

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📊 Monitoramento

- **Health checks** automáticos
- **Logs estruturados** com Winston
- **Métricas de performance**
- **Tratamento de erros** centralizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: contato@agrotm.com.br
- **WhatsApp**: +55 (66) 99236-2830
- **Documentação**: `/api/docs`

---

**Desenvolvido com ❤️ para AGROTM** 