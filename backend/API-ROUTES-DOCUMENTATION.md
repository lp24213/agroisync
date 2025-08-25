# AGROTM API - Documentação Completa das Rotas

## 📋 Visão Geral

Esta documentação descreve todas as rotas da API AGROTM, incluindo autenticação, mensageria, admin, pagamentos e funcionalidades de parceiros.

## 🔐 Autenticação

### Base URL: `/api/v1/auth`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/register` | Registro de usuário | Não |
| POST | `/login` | Login de usuário | Não |
| POST | `/logout` | Logout de usuário | JWT |
| POST | `/forgot-password` | Solicitar reset de senha | Não |
| POST | `/reset-password` | Resetar senha | Token temporário |
| GET | `/me` | Informações do usuário atual | JWT |
| POST | `/change-password` | Alterar senha | JWT |

## 👥 Usuários

### Base URL: `/api/v1/users`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar usuários | JWT + Admin |
| GET | `/:id` | Obter usuário por ID | JWT + Admin |
| PUT | `/:id` | Atualizar usuário | JWT + Admin |
| DELETE | `/:id` | Deletar usuário | JWT + Admin |
| GET | `/profile` | Perfil do usuário atual | JWT |
| PUT | `/profile` | Atualizar perfil | JWT |
| GET | `/subscriptions` | Assinaturas do usuário | JWT |

## 📦 Produtos

### Base URL: `/api/v1/products`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar produtos | JWT + Plano Store |
| GET | `/featured` | Produtos em destaque | JWT + Plano Store |
| GET | `/categories` | Categorias de produtos | JWT + Plano Store |
| GET | `/:id` | Obter produto por ID | JWT + Plano Store |
| POST | `/` | Criar novo produto | JWT + Plano Store |
| PUT | `/:id` | Atualizar produto | JWT + Plano Store |
| DELETE | `/:id` | Deletar produto | JWT + Plano Store |

## 🚚 Fretes

### Base URL: `/api/v1/freights`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar fretes | JWT + Plano Freight |
| GET | `/featured` | Fretes em destaque | JWT + Plano Freight |
| GET | `/routes` | Rotas de frete | JWT + Plano Freight |
| GET | `/:id` | Obter frete por ID | JWT + Plano Freight |
| POST | `/` | Criar novo frete | JWT + Plano Freight |
| PUT | `/:id` | Atualizar frete | JWT + Plano Freight |
| DELETE | `/:id` | Deletar frete | JWT + Plano Freight |

## 💬 Mensagens Privadas

### Base URL: `/api/v1/messages`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar conversas | JWT + Plano Store |
| GET | `/conversation/:userId` | Obter conversa com usuário | JWT + Plano Store |
| POST | `/` | Enviar mensagem | JWT + Plano Store |
| GET | `/:id` | Obter mensagem específica | JWT + Plano Store |
| PUT | `/:id` | Atualizar mensagem | JWT + Plano Store |
| DELETE | `/:id` | Deletar mensagem | JWT + Plano Store |
| GET | `/unread/count` | Contar mensagens não lidas | JWT + Plano Store |
| GET | `/search/:term` | Buscar mensagens | JWT + Plano Store |

## 📞 Mensagens de Contato

### Base URL: `/api/v1/contact`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/` | Enviar mensagem de contato | Não |
| GET | `/` | Listar mensagens (admin) | JWT + Admin |
| GET | `/:id` | Obter mensagem específica | JWT + Admin |
| PUT | `/:id` | Atualizar mensagem | JWT + Admin |
| DELETE | `/:id` | Deletar mensagem | JWT + Admin |
| POST | `/partnership` | Solicitar parceria | Não |

## 🤝 Parceiros

### Base URL: `/api/v1/partners`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar parceiros | JWT + Admin |
| GET | `/featured` | Parceiros em destaque | JWT + Admin |
| GET | `/:id` | Obter parceiro por ID | JWT + Admin |
| POST | `/` | Criar novo parceiro | JWT + Admin |
| PUT | `/:id` | Atualizar parceiro | JWT + Admin |
| DELETE | `/:id` | Deletar parceiro | JWT + Admin |
| GET | `/categories` | Categorias de parceiros | JWT + Admin |

## 💬 Mensagens de Parceiros

### Base URL: `/api/v1/partnership-messages`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar mensagens de parceiros | JWT + Admin |
| POST | `/` | Criar mensagem de parceiro | JWT + Admin |
| GET | `/:id` | Obter mensagem específica | JWT + Admin |
| PUT | `/:id` | Atualizar mensagem | JWT + Admin |
| PUT | `/:id/status` | Atualizar status da mensagem | JWT + Admin |
| DELETE | `/:id` | Arquivar mensagem | JWT + Admin |
| GET | `/stats/overview` | Estatísticas das mensagens | JWT + Admin |
| GET | `/search/:term` | Buscar mensagens | JWT + Admin |

## 💳 Pagamentos

### Base URL: `/api/v1/payments`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/plans` | Listar planos disponíveis | JWT |
| GET | `/history` | Histórico de pagamentos | JWT |
| GET | `/:id` | Obter pagamento por ID | JWT |

#### Stripe
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/stripe/create-payment-intent` | Criar intenção de pagamento | JWT |
| POST | `/stripe/confirm` | Confirmar pagamento | JWT |
| POST | `/stripe/webhook` | Webhook do Stripe | Não |
| POST | `/stripe/create-checkout-session` | Criar sessão de checkout | JWT |
| GET | `/stripe/subscriptions/:id` | Obter assinatura | JWT |
| POST | `/stripe/subscriptions/:id/cancel` | Cancelar assinatura | JWT |

#### Metamask
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/metamask/create-invoice` | Criar fatura para Metamask | JWT |
| POST | `/metamask/verify` | Verificar pagamento Metamask | JWT |
| GET | `/metamask/balance/:address` | Saldo da carteira | JWT |
| GET | `/metamask/transactions/:address` | Histórico de transações | JWT |

## 👨‍💼 Admin

### Base URL: `/api/v1/admin`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/dashboard` | Dashboard do admin | JWT + Admin |
| GET | `/users` | Listar todos os usuários | JWT + Admin |
| GET | `/users/:id` | Obter usuário específico | JWT + Admin |
| PUT | `/users/:id` | Atualizar usuário | JWT + Admin |
| PUT | `/users/:id/block` | Bloquear/desbloquear usuário | JWT + Admin |
| DELETE | `/users/:id` | Deletar usuário | JWT + Admin |
| GET | `/messages/contact` | Mensagens de contato | JWT + Admin |
| GET | `/messages/partnerships` | Mensagens de parcerias | JWT + Admin |
| GET | `/messages/private` | Mensagens privadas | JWT + Admin |
| GET | `/payments` | Histórico de pagamentos | JWT + Admin |
| GET | `/analytics` | Analytics do sistema | JWT + Admin |

## 📰 Notícias

### Base URL: `/api/v1/news`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar notícias | JWT |
| GET | `/featured` | Notícias em destaque | JWT |
| GET | `/categories` | Categorias de notícias | JWT |
| GET | `/:id` | Obter notícia por ID | JWT |
| POST | `/` | Criar nova notícia | JWT + Admin |
| PUT | `/:id` | Atualizar notícia | JWT + Admin |
| DELETE | `/:id` | Deletar notícia | JWT + Admin |

## 📤 Upload

### Base URL: `/api/v1/upload`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/image` | Upload de imagem | JWT |
| POST | `/document` | Upload de documento | JWT |
| DELETE | `/:id` | Deletar arquivo | JWT |

## 🏗️ Staking

### Base URL: `/api/v1/staking`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/pools` | Listar pools de staking | JWT |
| GET | `/pools/:id` | Obter pool específico | JWT |
| POST | `/stake` | Fazer stake | JWT |
| POST | `/unstake` | Fazer unstake | JWT |
| GET | `/rewards` | Recompensas de staking | JWT |

## 🎯 Marketplace

### Base URL: `/api/v1/marketplace`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Listar itens do marketplace | JWT |
| GET | `/categories` | Categorias do marketplace | JWT |
| GET | `/:id` | Obter item específico | JWT |
| POST | `/` | Criar novo item | JWT |
| PUT | `/:id` | Atualizar item | JWT |
| DELETE | `/:id` | Deletar item | JWT |

## 📊 Analytics

### Base URL: `/api/v1/analytics`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/dashboard` | Dashboard de analytics | JWT + Admin |
| GET | `/users` | Analytics de usuários | JWT + Admin |
| GET | `/products` | Analytics de produtos | JWT + Admin |
| GET | `/payments` | Analytics de pagamentos | JWT + Admin |
| GET | `/traffic` | Analytics de tráfego | JWT + Admin |

## 🏥 Health Check

### Base URL: `/api/health`

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Status da API | Não |
| GET | `/db` | Status do banco de dados | Não |
| GET | `/redis` | Status do Redis | Não |

## 🔒 Middlewares de Segurança

### Rate Limiting
- **Global**: 1000 requests por IP a cada 15 minutos
- **API**: 100 requests por IP a cada 15 minutos
- **Auth**: 5 tentativas de login por IP a cada 15 minutos
- **Payments**: 10 tentativas de pagamento por IP a cada hora
- **Admin**: 200 requests por IP a cada 15 minutos

### WAF Protection
- Detecção de SQL Injection
- Detecção de XSS
- Detecção de NoSQL Injection
- Validação de headers suspeitos
- Proteção contra ataques de força bruta

### Autenticação
- JWT com expiração de 24 horas
- Verificação de plano ativo
- Verificação de privilégios de admin
- Logs de segurança para todas as ações

## 📝 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Não encontrado |
| 413 | Conteúdo muito grande |
| 429 | Muitas requisições |
| 500 | Erro interno do servidor |

## 🔐 Autenticação Admin Específica

Para acessar funcionalidades de admin específicas, o usuário deve ter o email:
**luispaulodeoliveira@agrotm.com.br**

Este usuário tem acesso total a:
- Todas as mensagens (usuários, contato, parceiros)
- Gestão completa de usuários
- Gestão de parceiros
- Analytics do sistema
- Configurações avançadas

## 📱 WebSocket

### Eventos Disponíveis
- `send_private_message` - Enviar mensagem privada
- `typing_start` - Usuário começou a digitar
- `typing_stop` - Usuário parou de digitar
- `mark_message_read` - Marcar mensagem como lida
- `update_presence` - Atualizar status online
- `user_presence_changed` - Status do usuário mudou
- `user_disconnected` - Usuário desconectou

### Autenticação WebSocket
- Token JWT obrigatório na conexão
- Validação automática de usuário
- Logs de segurança para todas as conexões

## 🚀 Deploy e Configuração

### Variáveis de Ambiente Obrigatórias
```bash
# JWT
JWT_SECRET=your_jwt_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Metamask
METAMASK_ADMIN_ADDRESS=0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1

# Segurança
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Comandos de Deploy
```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Iniciar em produção
npm start

# Com Docker
docker-compose up -d
```

## 📚 Recursos Adicionais

- **Documentação Swagger**: `/api/docs` (quando implementado)
- **Logs de Segurança**: Todos os eventos são logados no MongoDB
- **Monitoramento**: Integração com New Relic e Sentry
- **Backup**: Backup automático do MongoDB
- **SSL**: Configuração automática de HTTPS
- **CDN**: Integração com Cloudflare

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre a API:
- **Email**: suporte@agrotm.com.br
- **Documentação**: Este arquivo e README.md
- **Issues**: GitHub Issues do projeto
