# API Gateway - Endpoints

## Autenticação

Todas as rotas exigem JWT no header Authorization: `Bearer <token>`

## Endpoints

### GET /health

- Healthcheck do gateway

### /users

- Proxy para user-service
- Métodos: GET, POST

### /payments

- Proxy para payment-service
- Métodos: POST

### /notify

- Proxy para notification-service
- Métodos: POST

## Rate Limiting

- 100 requisições por minuto por IP
- Resposta: 429 Too Many Requests

## CORS

- Permitido: https://agrotm.com, https://app.agrotm.com, http://localhost:3000

## Exemplo de requisição

```http
GET /users HTTP/1.1
Host: api.agrotm.com
Authorization: Bearer <token>
```
