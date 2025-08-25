# 🚀 AGROTM - Instruções de Configuração e Setup

## 📋 Visão Geral

Este documento contém as instruções para configurar e executar o projeto AGROTM com frontend e backend totalmente integrados.

## 🎯 Funcionalidades Implementadas

### ✅ Tema & Visual
- **Tema padrão**: Branco/clean (design claro)
- **Tema escuro**: Preto fosco + neon futurista (ativado via switch)
- **Design responsivo**: Funciona em desktop e mobile

### ✅ Menu Responsivo
- **Desktop**: Todos os itens visíveis
- **Mobile**: Menu hambúrguer com Login e Cadastro
- **Notícias**: Item fixo no topo (redireciona para seção na Home)
- **Planos**: Removido do menu (conforme solicitado)

### ✅ Widget Clima + Notícias
- **Posição**: Canto superior direito
- **Drag-and-drop**: Desktop (mouse) e mobile (touch)
- **Botão fechar**: Salva estado em localStorage
- **Conteúdo**: Clima atual + 3 últimas notícias de agronegócio

### ✅ Autenticação & Cadastro
- **Sistema completo**: Login e cadastro funcionais
- **Admin exclusivo**: 
  - Email: `luispaulodeoliveira@agrotm.com.br`
  - Senha: `Th@ys15221008`
- **Mensageria privada**: Liberada apenas com plano ativo
- **Chat público**: Apenas com Chatbot AI

### ✅ Pagamentos
- **Stripe**: Pagamentos em moeda local (BRL)
- **Metamask**: Pagamentos em criptomoedas
- **Carteira integrada**: Ativos em cripto na aba Cripto

### ✅ Planos
- **Loja**: R$25/mês até 3 anúncios
- **AgroConecta**: R$50/mês (fretes básico)
- **Fretes avançado**: R$149/mês até 30 fretes

### ✅ Painel Admin
- **Login exclusivo**: Credenciais especiais
- **Permissões totais**: CRUD completo de usuários
- **Mensageria**: Acesso a todas as mensagens
- **Caixas exclusivas**: Contato, Parcerias, Mensagens privadas
- **Gestão de parceiros**: Criar/editar manualmente

## 🛠️ Configuração do Ambiente

### Frontend (React)

1. **Instalar dependências**:
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente**:
Criar arquivo `.env.local` na pasta `frontend/`:
```env
NEXT_PUBLIC_APP_NAME=AGROISYNC
NEXT_PUBLIC_APP_VERSION=2.3.1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

3. **Executar em desenvolvimento**:
```bash
npm start
```

### Backend (Node.js + MongoDB)

1. **Instalar dependências**:
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente**:
Criar arquivo `.env` na pasta `backend/`:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=dev_jwt_secret_key_here_minimum_32_characters
MONGODB_URI=mongodb://localhost:27017/agroisync
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

3. **Configurar MongoDB**:
```bash
# Instalar MongoDB localmente ou usar Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Executar em desenvolvimento**:
```bash
npm run dev
```

## 🔧 Configurações Específicas

### Stripe
1. Criar conta em [stripe.com](https://stripe.com)
2. Obter chaves de teste
3. Configurar webhooks

### Metamask
1. Instalar extensão Metamask
2. Configurar rede (Ethereum, Polygon, etc.)
3. Configurar carteira para recebimento

### AWS (Opcional)
1. Configurar credenciais AWS
2. Configurar S3 para uploads
3. Configurar Lambda para serverless

## 🚀 Executando o Projeto

### Desenvolvimento Local

1. **Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

2. **Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```

3. **Acessar aplicação**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api

### Produção

1. **Build do frontend**:
```bash
cd frontend
npm run build
```

2. **Deploy do backend**:
```bash
cd backend
npm run build
npm start
```

## 📱 Funcionalidades Mobile

### Menu Responsivo
- ✅ Login e Cadastro no menu hambúguer
- ✅ Navegação otimizada para touch
- ✅ Tema adaptativo

### Widget Clima
- ✅ Drag-and-drop com touch
- ✅ Posicionamento responsivo
- ✅ Fechamento com localStorage

## 🔐 Segurança

### Autenticação
- JWT tokens seguros
- Rate limiting configurado
- Validação de entrada
- Sanitização de dados

### Admin
- Rota protegida `/admin`
- Verificação de role
- Credenciais exclusivas
- Logs de acesso

## 📊 Monitoramento

### Health Checks
- Endpoint `/health` no backend
- Verificação de conexão MongoDB
- Status dos serviços

### Logs
- Winston para logging estruturado
- Rotação de arquivos
- Níveis de log configuráveis

## 🐛 Troubleshooting

### Problemas Comuns

1. **Frontend não carrega**:
   - Verificar se backend está rodando
   - Verificar variáveis de ambiente
   - Verificar console do navegador

2. **Backend não conecta ao MongoDB**:
   - Verificar se MongoDB está rodando
   - Verificar string de conexão
   - Verificar permissões

3. **Tema não funciona**:
   - Verificar localStorage
   - Verificar CSS customizado
   - Verificar contexto React

4. **Widget não aparece**:
   - Verificar localStorage
   - Verificar z-index
   - Verificar posicionamento

### Logs de Debug

```bash
# Frontend
NEXT_PUBLIC_DEBUG=true

# Backend
DEBUG=true
LOG_LEVEL=debug
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs de erro
2. Verificar configurações de ambiente
3. Verificar conectividade entre serviços
4. Verificar permissões de arquivo

## 🔄 Atualizações

### Frontend
```bash
cd frontend
git pull origin main
npm install
npm start
```

### Backend
```bash
cd backend
git pull origin main
npm install
npm run dev
```

---

**AGROTM Team** - Sistema de inteligência agrícola integrado e funcional! 🚜✨
