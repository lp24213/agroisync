# 📧 Módulo de Email Corporativo - Agroisync

## Visão Geral

Módulo completo de **WEBMAIL CORPORATIVO** integrado ao Agroisync, permitindo gerenciar contas de email hospedadas na Hostinger através de SMTP/IMAP.

## 🎯 Funcionalidades

### Backend
- ✅ Criação e gerenciamento de contas de email (EmailAccount)
- ✅ Envio de emails via SMTP (nodemailer)
- ✅ Recebimento de emails via IMAP (imapflow)
- ✅ Criptografia AES-256 de senhas
- ✅ Cache de conexões IMAP/SMTP
- ✅ Sanitização de HTML
- ✅ Rate limiting e proteção contra spam
- ✅ Logs detalhados

### Frontend Administrativo
- ✅ Painel administrativo exclusivo para admins
- ✅ Visualização de todas as contas de email
- ✅ Estatísticas de uso
- ✅ Visualização de inbox de qualquer conta
- ✅ Ativar/Desativar contas
- ✅ Deletar contas

### Frontend Usuário (Futuro)
- ✅ Área `/dashboard/email` para usuários
- ✅ Gerenciar próprias contas
- ✅ Enviar e receber emails
- ✅ Gerenciar anexos

## 🔒 Segurança

- **Senhas criptografadas**: AES-256 com chave de ENV
- **Backend-only**: Frontend nunca recebe credenciais
- **Acesso administrativo**: Apenas admins podem ver todas as contas
- **Sanitização HTML**: Proteção XSS em emails recebidos
- **Rate limiting**: Proteção contra spam e abuso

## 📋 Pré-requisitos

### Dependências Instaladas
```bash
npm install nodemailer imapflow crypto-js dompurify jsdom
```

### Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# Chave de criptografia AES-256 (OBRIGATÓRIA)
# Gere com: openssl rand -hex 32
EMAIL_ENCRYPTION_KEY=sua-chave-de-32-caracteres-aqui-minimo-32-chars

# Configurações padrão (opcionais)
EMAIL_DEFAULT_IMAP_HOST=imap.hostinger.com
EMAIL_DEFAULT_IMAP_PORT=993
EMAIL_DEFAULT_SMTP_HOST=smtp.hostinger.com
EMAIL_DEFAULT_SMTP_PORT=465
EMAIL_DEFAULT_SECURE=true
```

## 🗄️ Banco de Dados

### Migration

Execute a migration para criar as tabelas:

```bash
# Via Wrangler D1 (Cloudflare)
wrangler d1 execute agroisync-db --file=./migrations/create_email_accounts.sql

# Ou via SQL direto
sqlite3 database.db < migrations/create_email_accounts.sql
```

### Estrutura

**Tabela: email_accounts**
- `id` - ID único da conta
- `user_id` - ID do usuário proprietário
- `email` - Endereço de email
- `encrypted_password` - Senha criptografada (AES-256)
- `imap_host`, `imap_port` - Configurações IMAP
- `smtp_host`, `smtp_port` - Configurações SMTP
- `secure` - SSL/TLS habilitado
- `is_active` - Conta ativa/inativa
- `last_sync_at` - Última sincronização
- `created_at`, `updated_at` - Timestamps

**Tabela: email_messages** (cache opcional)
- Cache de mensagens para melhor performance

**Tabela: email_attachments** (futuro)
- Armazenamento de anexos

## 🛣️ Rotas API

### Rotas de Usuário (Protegidas)

```
POST   /api/email/accounts          - Criar conta de email
GET    /api/email/accounts          - Listar minhas contas
DELETE /api/email/accounts/:id      - Deletar minha conta
GET    /api/email/inbox             - Buscar inbox (query: accountId, folder, limit, offset)
GET    /api/email/message           - Buscar mensagem (query: accountId, uid, folder)
POST   /api/email/send              - Enviar email
POST   /api/email/read              - Marcar como lida
DELETE /api/email/message/:uid      - Deletar mensagem
```

### Rotas Administrativas (Apenas Admin)

```
GET    /api/admin/email/accounts          - Listar TODAS as contas
GET    /api/admin/email/stats             - Estatísticas gerais
GET    /api/admin/email/inbox             - Ver inbox de qualquer conta
PATCH  /api/admin/email/accounts/:id/status - Ativar/Desativar conta
DELETE /api/admin/email/accounts/:id      - Deletar qualquer conta
```

## 🖥️ Frontend

### Painel Administrativo

Acesse em: `/admin/email`

**Requisitos:**
- Usuário deve ser admin (`isAdmin: true` ou `role: 'admin'`)
- Email `luispaulodeoliveira@agrotm.com.br` tem acesso automático

**Funcionalidades:**
1. **Visão Geral**: Estatísticas de contas e mensagens
2. **Contas**: Listar, buscar, ativar/desativar, deletar
3. **Inbox**: Visualizar mensagens de qualquer conta

### Componentes

- `AdminRoute` - Proteção de rota para admins
- `AdminEmailPanel` - Painel principal administrativo

## 🔧 Configuração Hostinger

### Configurações Padrão

```
IMAP:
- Host: imap.hostinger.com
- Porta: 993
- Seguro: Sim (SSL/TLS)

SMTP:
- Host: smtp.hostinger.com
- Porta: 465 (SSL) ou 587 (TLS)
- Seguro: Sim
```

## 📝 Exemplo de Uso

### Criar Conta (Backend)

```javascript
POST /api/email/accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "contato@meudominio.com",
  "password": "senha_segura_123",
  "name": "Contato Empresa"
}
```

### Enviar Email (Backend)

```javascript
POST /api/email/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": "account_id_aqui",
  "to": "destinatario@email.com",
  "subject": "Assunto do Email",
  "html": "<h1>Olá!</h1><p>Conteúdo HTML aqui.</p>",
  "text": "Olá! Conteúdo texto aqui.",
  "attachments": [] // Opcional
}
```

### Buscar Inbox (Admin)

```javascript
GET /api/admin/email/inbox?accountId=xxx&limit=50&offset=0
Authorization: Bearer <admin_token>
```

## 🚀 Deploy

### 1. Executar Migration

```bash
wrangler d1 execute agroisync-db --file=./migrations/create_email_accounts.sql
```

### 2. Configurar Variáveis de Ambiente

No Cloudflare Workers, adicione:

```bash
wrangler secret put EMAIL_ENCRYPTION_KEY
# Cole sua chave de 32+ caracteres
```

### 3. Verificar Configuração

```bash
# Health check
curl https://api.agroisync.com/api/health
```

## 📊 Monitoramento

### Logs

Os logs são salvos em:
- `logs/application-*.log` - Logs gerais
- `logs/error-*.log` - Erros

### Métricas Importantes

- Total de contas ativas
- Mensagens enviadas/recebidas
- Erros de conexão SMTP/IMAP
- Tempo de resposta

## 🔍 Troubleshooting

### Erro: "EMAIL_ENCRYPTION_KEY não configurada"

**Solução:** Adicione a variável no `.env` ou via `wrangler secret put`

### Erro: "Falha ao conectar IMAP"

**Verificar:**
1. Credenciais corretas
2. Porta 993 está aberta
3. Host `imap.hostinger.com` acessível
4. SSL/TLS habilitado

### Erro: "Falha ao conectar SMTP"

**Verificar:**
1. Porta 465 (SSL) ou 587 (TLS)
2. Credenciais corretas
3. Host `smtp.hostinger.com` acessível

## 📚 Referências

- [nodemailer](https://nodemailer.com/)
- [imapflow](https://github.com/postalsys/imapflow)
- [crypto-js](https://cryptojs.gitbook.io/)
- [Hostinger Email Settings](https://www.hostinger.com/tutorials/email)

## 👤 Autor

Sistema desenvolvido para Agroisync - Plataforma de Agronegócio

---

**Versão:** 1.0.0  
**Última Atualização:** 2025-01-10

