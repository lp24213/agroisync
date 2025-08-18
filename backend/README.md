# AgroSync Backend

Backend da plataforma AgroSync com APIs RESTful, autenticação e integração blockchain.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **JWT** - Autenticação
- **Helmet** - Segurança
- **Rate Limiting** - Proteção contra ataques

## 📁 Estrutura do Projeto

```
src/
├── config/           # Configurações (DB, segurança, etc.)
├── middleware/       # Middlewares Express
├── models/          # Modelos de dados
├── routes/          # Rotas da API
├── types/           # Definições de tipos TypeScript
└── utils/           # Utilitários e helpers
```

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd agroisync/backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   # Edite .env com suas configurações
   ```

4. **Configure o banco de dados**
   ```bash
   npm run db:setup
   npm run db:migrate
   npm run db:seed
   ```

5. **Execute o projeto**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm run build
   npm start
   ```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói o projeto para produção
- `npm start` - Inicia o servidor de produção
- `npm run type-check` - Verifica tipos TypeScript
- `npm run type-check:final` - Verifica tipos para produção
- `npm run db:setup` - Configura o banco de dados
- `npm run db:migrate` - Executa migrações
- `npm run db:seed` - Popula o banco com dados iniciais

## 🌐 APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário atual

### Usuários
- `GET /api/users` - Lista usuários
- `GET /api/users/:id` - Dados de um usuário
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

### NFTs
- `GET /api/nfts` - Lista NFTs
- `POST /api/nfts` - Cria novo NFT
- `GET /api/nfts/:id` - Dados de um NFT
- `PUT /api/nfts/:id` - Atualiza NFT
- `DELETE /api/nfts/:id` - Remove NFT

### Staking
- `GET /api/staking` - Lista pools de staking
- `POST /api/staking` - Cria novo stake
- `GET /api/staking/user-stakes` - Stakes do usuário
- `DELETE /api/staking/:id` - Remove stake

### Marketplace
- `GET /api/marketplace` - Lista produtos
- `POST /api/marketplace` - Adiciona produto
- `GET /api/marketplace/:id` - Dados de um produto
- `PUT /api/marketplace/:id` - Atualiza produto

### Upload
- `POST /api/upload` - Upload de arquivo
- `GET /api/upload` - Lista arquivos

### Analytics
- `GET /api/analytics` - Estatísticas gerais
- `GET /api/analytics/recent-activity` - Atividade recente

## 🔧 Configurações

### Banco de Dados
- **PostgreSQL** para dados principais
- **Redis** para cache e sessões
- Migrações automáticas
- Seeds para dados iniciais

### Segurança
- **Helmet** para headers de segurança
- **Rate Limiting** para proteção contra ataques
- **CORS** configurado adequadamente
- **JWT** para autenticação
- Validação de entrada em todas as rotas

### Performance
- **Compression** para respostas
- **Caching** com Redis
- **Connection pooling** para banco de dados
- **Logging** estruturado

## 🚀 Deploy

### Docker
```bash
docker build -t agroisync-backend .
docker run -p 3001:3001 agroisync-backend
```

### AWS ECS
1. Configure o ECS cluster
2. Crie a task definition
3. Configure o load balancer
4. Deploy automático

### Heroku
1. Conecte ao Heroku
2. Configure as variáveis de ambiente
3. Deploy automático

## 🔒 Segurança

- **Helmet** para headers de segurança
- **Rate Limiting** para proteção contra DDoS
- **CORS** configurado adequadamente
- **JWT** com expiração configurável
- **Validação** de entrada em todas as rotas
- **Sanitização** de dados
- **Logs** de auditoria

## 📊 Monitoramento

- **Logs** estruturados
- **Métricas** de performance
- **Alertas** configuráveis
- **Health checks** automáticos

## 🧪 Testes

- **Jest** para testes unitários
- **Supertest** para testes de API
- **Coverage** reports
- **Mocks** para dependências externas

## 📈 Performance

- **Connection pooling** para banco de dados
- **Caching** com Redis
- **Compression** de respostas
- **Rate limiting** inteligente
- **Logging** assíncrono

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

- **Email**: contato@agroisync.com
- **Documentação**: [docs.agroisync.com](https://docs.agroisync.com)
- **Issues**: [GitHub Issues](https://github.com/agroisync/backend/issues)

## 🔄 Changelog

### v1.0.0
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ Sistema de usuários
- ✅ CRUD de NFTs
- ✅ Sistema de staking
- ✅ Marketplace
- ✅ Upload de arquivos
- ✅ Analytics
- ✅ Segurança configurada
- ✅ Banco de dados configurado
- ✅ Cache Redis
- ✅ Logging estruturado
- ✅ Testes configurados
- ✅ Deploy configurado

---

**Desenvolvido com ❤️ pela equipe AgroSync** 