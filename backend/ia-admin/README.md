# 🧠 Agroisync IA - Backend Administrador

Sistema de IA que gerencia e atualiza conteúdo do site Agroisync automaticamente, com segurança profissional e integração total com os planos existentes.

## 🚀 Início Rápido

### 1️⃣ Instalação

```bash
cd backend/ia-admin
pip install -r requirements.txt
```

### 2️⃣ Configuração

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env e adicionar:
# - IA_SECRET_TOKEN (token secreto forte)
# - ALLOWED_IPS (IPs autorizados)
```

### 3️⃣ Executar

```bash
# Desenvolvimento
python main.py

# Produção
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔐 Segurança

### Token de Autenticação

Todas as rotas `/api/update-*` e `/api/logs` requerem:

```
Authorization: Bearer SEU_TOKEN_SECRETO
```

### IPs Autorizados

Apenas IPs configurados no `.env` podem acessar rotas protegidas.

## 📡 Endpoints

### Públicos (sem autenticação)

- `GET /api/health` - Health check
- `GET /api/status` - Status do sistema

### Protegidos (requerem token + IP)

- `POST /api/update-news` - Atualizar notícias
- `POST /api/update-weather` - Atualizar clima
- `POST /api/update-cotation` - Atualizar cotações
- `POST /api/update-ai-insights` - Atualizar insights da IA
- `GET /api/logs` - Consultar logs (admin)
- `GET /api/logs/stats` - Estatísticas de logs (admin)
- `DELETE /api/logs` - Limpar logs (admin)
- `GET /api/plans/check` - Verificar acesso por plano

## 📝 Exemplos de Uso

### Atualizar Notícia

```bash
curl -X POST https://seu-servidor:8000/api/update-news \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Safra recorde em 2025",
    "content": "Produção de soja...",
    "category": "mercado",
    "plan_level": "publico"
  }'
```

### Consultar Logs

```bash
curl -X GET https://seu-servidor:8000/api/logs?limit=50 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🎯 Níveis de Acesso (Planos)

1. **Público** (gratuito) - Informações básicas
2. **Privado** (pago) - Acesso ampliado, sem anúncios
3. **Loja** (e-commerce) - Dashboard de loja, métricas
4. **Admin** - Acesso total, incluindo logs e controle

## 📊 Logs

Todos os logs são salvos em:
- **Memória**: Últimos 100 registros
- **Arquivo**: `ia_actions.log`

### Formato do Log

```
2025-10-21 14:32:45 | 177.55.23.14    | Atualizou Clima                          | OK        | Temp: 28°C
```

## 🔧 Integração com Agroisync

Este backend está preparado para integrar com:
- ✅ Banco de dados D1 do Cloudflare
- ✅ Sistema de autenticação JWT existente
- ✅ Planos e assinaturas do site
- ✅ Sistema de notificações Resend

## 🛡️ Segurança Implementada

- ✅ Autenticação via token secreto
- ✅ Whitelist de IPs
- ✅ Middleware de validação global
- ✅ Logs de todas as ações
- ✅ Bloqueio automático de tentativas não autorizadas
- ✅ CORS configurável
- ✅ Rate limiting (pode ser adicionado)

## 📦 Deploy

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloudflare Workers (Python)

Pode ser adaptado para rodar em Cloudflare Workers usando Python Workers.

## 🔮 Próximas Features

- [ ] Integração com Cloudflare D1
- [ ] Autenticação JWT do Agroisync
- [ ] Rate limiting por IP
- [ ] Webhooks para eventos
- [ ] Dashboard web para logs
- [ ] Notificações em tempo real

