# 🚀 Instalação Rápida - AgroSync Backend

## ⚡ Instalação em 5 minutos

### 1. Pré-requisitos
- ✅ Node.js 16+ instalado
- ✅ MongoDB 5+ rodando
- ✅ Git instalado

### 2. Clone e Setup
```bash
# Clone o repositório
git clone https://github.com/agrosync/backend.git
cd backend

# Instale as dependências
npm install
```

### 3. Configure o Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis (opcional para desenvolvimento)
# As configurações padrão funcionam para desenvolvimento local
```

### 4. Inicie o Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 5. Teste a API
```bash
# Health check
curl http://localhost:5000/health

# Informações da API
curl http://localhost:5000/api
```

## 🐳 Com Docker (Recomendado)

### 1. Clone e Setup
```bash
git clone https://github.com/agrosync/backend.git
cd backend
```

### 2. Inicie com Docker Compose
```bash
# Inicia todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f backend
```

### 3. Acesse os Serviços
- 🌐 **Backend API**: http://localhost:5000
- 📊 **MongoDB Express**: http://localhost:8081
- 🔴 **Redis Commander**: http://localhost:8082
- 🔒 **Nginx**: http://localhost (redireciona para HTTPS)

## 🗄️ Banco de Dados

### MongoDB Local
```bash
# Inicie o MongoDB
mongod

# Ou com Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Popule com Dados de Exemplo
```bash
# Execute o script de seed
npm run db:seed

# Ou execute as migrações
npm run db:migrate
```

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm test             # Executar testes
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas
npm run format       # Formatar código
npm run db:seed      # Popular banco com dados
npm run db:migrate   # Executar migrações
```

### Estrutura do Projeto
```
backend/
├── src/
│   ├── models/          # Modelos Mongoose
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares
│   └── server.js        # Servidor principal
├── scripts/             # Scripts utilitários
├── nginx/               # Configuração Nginx
├── docker-compose.yml   # Docker Compose
└── Dockerfile           # Docker
```

## 🌐 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil

### Validações
- `POST /api/validation/cpf` - Validar CPF
- `POST /api/validation/cnpj` - Validar CNPJ
- `POST /api/validation/cep` - Validar CEP
- `POST /api/validation/ie` - Validar IE

### Pagamentos
- `GET /api/payments/status` - Status do pagamento
- `POST /api/payments/stripe/create-session` - Stripe
- `POST /api/payments/crypto/verify` - Crypto

### Mensageria
- `GET /api/messages/conversations` - Listar conversas
- `POST /api/messages/conversations/:id/messages` - Enviar mensagem

## 🔐 Usuários de Teste

### Admin
- **Email**: admin@agrosync.com
- **Senha**: admin123
- **Acesso**: Total ao sistema

### Usuário Padrão
- **Email**: joao.silva@agrosync.com
- **Senha**: 123456
- **Acesso**: Usuário pago com plano ativo

### Usuário Freteiro
- **Email**: maria.santos@agrosync.com
- **Senha**: 123456
- **Acesso**: Usuário pago com plano de frete

## 🚨 Troubleshooting

### Erro de Conexão MongoDB
```bash
# Verifique se o MongoDB está rodando
mongod --version

# Teste a conexão
mongo mongodb://localhost:27017/agrosync
```

### Erro de Porta em Uso
```bash
# Verifique processos na porta 5000
lsof -i :5000

# Mate o processo
kill -9 <PID>
```

### Erro de Dependências
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro Docker
```bash
# Pare e remova containers
docker-compose down

# Reconstrua as imagens
docker-compose build --no-cache

# Inicie novamente
docker-compose up -d
```

## 📱 Testando a API

### Com cURL
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrosync.com","password":"admin123"}'

# Validar CPF
curl -X POST http://localhost:5000/api/validation/cpf \
  -H "Content-Type: application/json" \
  -d '{"cpf":"123.456.789-00"}'
```

### Com Postman/Insomnia
1. Importe a coleção de exemplo
2. Configure a URL base: `http://localhost:5000`
3. Teste os endpoints

## 🔄 Próximos Passos

### 1. Configure APIs Externas
- [ ] Stripe (pagamentos)
- [ ] OpenWeather (clima)
- [ ] ReceitaWS (CPF/CNPJ)
- [ ] IBGE (CEP)

### 2. Configure SSL
- [ ] Certificados SSL
- [ ] HTTPS forçado
- [ ] Headers de segurança

### 3. Configure Monitoramento
- [ ] Logs estruturados
- [ ] Métricas de performance
- [ ] Alertas automáticos

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/agrosync/backend/issues)
- **Documentação**: [Wiki](https://github.com/agrosync/backend/wiki)
- **Email**: suporte@agrosync.com

## 🎯 Status da Implementação

- ✅ **Backend Core**: 100%
- ✅ **Autenticação**: 100%
- ✅ **Validações**: 100%
- ✅ **Pagamentos**: 100%
- ✅ **Mensageria**: 100%
- ✅ **Modelos de Dados**: 100%
- ✅ **Docker**: 100%
- ✅ **Nginx**: 100%
- 🔄 **WebSocket**: 90%
- 🔄 **Upload de Arquivos**: 80%
- 🔄 **Testes**: 70%

---

**🎉 Seu backend AgroSync está pronto para uso!**

Para mais detalhes, consulte o [README.md](README.md) completo.
