# 📚 API Documentation - AGROISYNC

## 🔗 Base URL

- **Desenvolvimento**: `http://localhost:3001/api`
- **Produção**: `https://api.agroisync.com/api`

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```bash
Authorization: Bearer <jwt_token>
```

## 📡 Endpoints

### 🔐 Autenticação

#### POST `/auth/register`
Registrar novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "turnstileToken": "turnstile_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": "user_id",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/auth/login`
Fazer login

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123",
  "turnstileToken": "turnstile_token_here"
}
```

#### POST `/auth/forgot-password`
Solicitar reset de senha

**Body:**
```json
{
  "email": "joao@example.com",
  "turnstileToken": "turnstile_token_here"
}
```

#### POST `/auth/reset-password`
Redefinir senha

**Body:**
```json
{
  "token": "reset_token_here",
  "userId": "user_id_here",
  "password": "nova_senha123"
}
```

### 💬 Chat IA

#### POST `/chat/send`
Enviar mensagem para o chatbot

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
message: "Como funciona a intermediação?"
conversationId: "optional_conversation_id"
attachments: [file1, file2, ...]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_id_here",
    "aiResponse": {
      "text": "Resposta da IA...",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### GET `/chat/:conversationId`
Obter histórico de conversa

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_id_here",
    "messages": [
      {
        "role": "user",
        "text": "Mensagem do usuário",
        "timestamp": "2024-01-15T10:30:00Z",
        "metadata": {
          "attachments": [...],
          "status": "delivered"
        }
      },
      {
        "role": "assistant",
        "text": "Resposta da IA",
        "timestamp": "2024-01-15T10:30:05Z"
      }
    ]
  }
}
```

#### POST `/chat/upload`
Upload de arquivo para chat

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
file: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/chats/user_id/filename.jpg",
    "filename": "filename.jpg",
    "size": 1024,
    "mimeType": "image/jpeg"
  }
}
```

### 🚛 Fretes (AgroConecta)

#### GET `/freights`
Listar pedidos de frete do usuário

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "FR-001",
        "orderNumber": "FR-001",
        "status": "in_transit",
        "origin": {
          "city": "São Paulo",
          "state": "SP"
        },
        "destination": {
          "city": "Mato Grosso",
          "state": "MT"
        },
        "pickupDate": "2024-01-15",
        "deliveryDateEstimate": "2024-01-18",
        "items": [
          {
            "name": "Soja",
            "quantity": 50,
            "unit": "toneladas"
          }
        ],
        "pricing": {
          "totalPrice": 2500
        },
        "trackingEvents": [...]
      }
    ]
  }
}
```

#### POST `/freights`
Criar novo pedido de frete

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "origin": {
    "address": "Rua A, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "coordinates": {
      "lat": -23.5505,
      "lng": -46.6333
    }
  },
  "destination": {
    "address": "Fazenda B, 456",
    "city": "Cuiabá",
    "state": "MT",
    "zipCode": "78000-000",
    "coordinates": {
      "lat": -15.6014,
      "lng": -56.0979
    }
  },
  "pickupDate": "2024-01-15",
  "deliveryDateEstimate": "2024-01-18",
  "items": [
    {
      "name": "Soja",
      "quantity": 50,
      "unit": "toneladas",
      "weight": 50000,
      "value": 100000
    }
  ]
}
```

#### PUT `/freights/:id/tracking`
Atualizar status de rastreamento

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "status": "in_transit",
  "location": {
    "city": "Campinas",
    "state": "SP",
    "coordinates": {
      "lat": -22.9056,
      "lng": -47.0608
    }
  },
  "notes": "Carga em trânsito"
}
```

#### POST `/freights/:id/ai-closure`
Gerar análise de IA para fechamento

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Pedido entregue dentro do prazo estimado. Performance excelente.",
    "performanceMetrics": {
      "onTimeDelivery": true,
      "damageReport": "Nenhum dano reportado",
      "delayReason": null,
      "overallScore": 5
    },
    "suggestedMessage": "Obrigado pela confiança! Pedido entregue com sucesso.",
    "invoiceDraft": "Fatura FR-002 - R$ 1.800,00 - Entregue em 13/01/2024"
  }
}
```

### 👥 Usuários

#### GET `/users/profile`
Obter perfil do usuário

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT `/users/profile`
Atualizar perfil do usuário

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "name": "João Silva",
  "phone": "+55 11 99999-9999",
  "address": {
    "street": "Rua A, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }
}
```

### 🛒 Marketplace

#### GET `/marketplace/products`
Listar produtos do marketplace

**Query Parameters:**
- `category`: Categoria do produto
- `state`: Estado
- `search`: Termo de busca
- `page`: Página (default: 1)
- `limit`: Limite por página (default: 20)

#### POST `/marketplace/products`
Criar novo produto

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
name: "Sementes de Soja Premium"
description: "Sementes certificadas..."
category: "insumos"
price: "180.00"
quantity: "100"
unit: "sacas"
location: "Mato Grosso"
images: [file1, file2, ...]
```

### 🔧 Admin

#### GET `/admin/users`
Listar todos os usuários (Admin only)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

#### GET `/admin/freights`
Listar todos os fretes (Admin only)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

#### GET `/admin/chat-stats`
Estatísticas do chat IA (Admin only)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

## 📊 Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `429` - Rate limit excedido
- `500` - Erro interno do servidor

## 🚨 Rate Limiting

- **Chat IA**: 10 requests/minuto por usuário
- **Upload**: 5 requests/minuto por usuário
- **Auth**: 5 requests/minuto por IP
- **API Geral**: 100 requests/minuto por usuário

## 🔒 Segurança

### Headers de Segurança
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### Validação de Dados
- Todos os inputs são validados com `express-validator`
- Uploads são limitados a 10MB
- Tipos de arquivo permitidos: `image/*`, `audio/*`

### CORS
```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📊 Audit Logs

### GET `/audit-logs`
Obter logs de auditoria do usuário

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (opcional): Número de logs a retornar (padrão: 100)
- `page` (opcional): Número da página (padrão: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "userId": "64a1b2c3d4e5f6789abcdef1",
      "action": "login",
      "resource": "user",
      "status": "success",
      "sensitivityLevel": "medium",
      "containsPII": false,
      "createdAt": "2023-07-01T10:00:00.000Z",
      "sessionInfo": {
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "country": "Brasil",
        "city": "São Paulo"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1
  }
}
```

### GET `/audit-logs/pii-access`
Obter logs de acesso a dados PII (Admin apenas)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `userId` (opcional): Filtrar por ID do usuário
- `limit` (opcional): Número de logs a retornar (padrão: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef0",
      "userId": "64a1b2c3d4e5f6789abcdef1",
      "action": "pii_access",
      "resource": "user",
      "status": "success",
      "sensitivityLevel": "high",
      "containsPII": true,
      "createdAt": "2023-07-01T10:00:00.000Z",
      "metadata": {
        "fieldsDecrypted": ["cpf", "cnpj"]
      }
    }
  ]
}
```

### GET `/audit-logs/stats`
Obter estatísticas de auditoria (Admin apenas)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `startDate`: Data de início (string ISO)
- `endDate`: Data de fim (string ISO)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "action": "login",
        "resource": "user",
        "status": "success"
      },
      "count": 150,
      "piiAccess": 0,
      "avgResponseTime": 250
    }
  ]
}
```

### POST `/audit-logs/export`
Exportar logs de auditoria (Admin apenas)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "startDate": "2023-07-01T00:00:00.000Z",
  "endDate": "2023-07-31T23:59:59.999Z",
  "userId": "64a1b2c3d4e5f6789abcdef1",
  "action": "pii_access",
  "resource": "user",
  "containsPII": true
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "userId": "64a1b2c3d4e5f6789abcdef1",
      "action": "pii_access",
      "resource": "user",
      "status": "success",
      "sensitivityLevel": "high",
      "containsPII": true,
      "createdAt": "2023-07-01T10:00:00.000Z",
      "sessionInfo": {
        "ip": "192.168.1.1",
        "country": "Brasil"
      }
    }
  ],
  "exportedAt": "2023-07-01T10:00:00.000Z",
  "totalRecords": 1
}
```

### DELETE `/audit-logs/cleanup`
Limpar logs expirados (Admin apenas)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "message": "25 logs expirados foram removidos",
  "deletedCount": 25
}
```

### GET `/audit-logs/:id/verify`
Verificar integridade do log (Admin apenas)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "logId": "64a1b2c3d4e5f6789abcdef0",
    "isValid": true
  }
}
```

## 🧪 Testes

### Exemplo de Teste com cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123",
    "turnstileToken": "token_here"
  }'

# Enviar mensagem para chat
curl -X POST http://localhost:3001/api/chat/send \
  -H "Authorization: Bearer jwt_token_here" \
  -F "message=Como funciona a intermediação?"

# Listar fretes
curl -X GET http://localhost:3001/api/freights \
  -H "Authorization: Bearer jwt_token_here"
```

## 📝 Logs

Todos os endpoints logam:
- Timestamp da requisição
- Método HTTP e URL
- Status code
- Tempo de resposta
- IP do cliente
- User ID (se autenticado)

## 🚀 Deploy

### Variáveis de Ambiente Necessárias

```bash
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/agroisync

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Email
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=noreply@agroisync.com

# Cloudflare
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-secret-key
CLOUDFLARE_ACCESS_TOKEN=your-cloudflare-access-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ZONE_ID=your-cloudflare-zone-id

# PII Encryption
PII_ENCRYPTION_KEY=your-super-secret-pii-encryption-key-32-chars
AUDIT_ENCRYPTION_KEY=your-super-secret-audit-encryption-key-32-chars

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://agroisync.com
```

## 📞 Suporte

Para dúvidas sobre a API:
- Email: api@agroisync.com
- Documentação: https://docs.agroisync.com/api
- Status: https://status.agroisync.com
