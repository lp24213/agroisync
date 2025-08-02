# AGROTM.SOL - Monorepo Completo

## Como rodar localmente

```sh
npm install
npm run build
npm start
```

## Como rodar o frontend isolado

```sh
cd frontend
npm install
npm run dev
```

## Como rodar o backend isolado

```sh
cd backend
npm install
npm run dev
```

## Deploy na Vercel (Frontend)

```sh
vercel --prod
```

## Configuração do CI/CD (GitHub Actions)

### 1. Configurar Secrets no GitHub

Para que o deploy automático funcione, você precisa configurar **DOIS** secrets no seu repositório GitHub:

1. **Acesse seu repositório no GitHub**
2. **Vá em Settings → Secrets and variables → Actions**
3. **Clique em "New repository secret"**
4. **Adicione os secrets:**

#### 🔑 VERCEL_TOKEN
- **Nome:** `VERCEL_TOKEN`
- **Valor:** Token de acesso da Vercel
- **Como obter:** 
  - Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
  - Clique em "Create Token"
  - Dê um nome (ex: "AGROTM Deploy")
  - Copie o token gerado

#### 🚂 RAILWAY_TOKEN
- **Nome:** `RAILWAY_TOKEN`
- **Valor:** Token de acesso do Railway
- **Como obter:**
  - Acesse [railway.app/account/tokens](https://railway.app/account/tokens)
  - Clique em "New Token"
  - Dê um nome (ex: "AGROTM Backend Deploy")
  - Copie o token gerado

### 2. Configurar Railway

1. **Crie um projeto no Railway:**
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Conecte seu repositório GitHub
   - Configure o serviço `agrotm-backend`

2. **Configure as variáveis de ambiente:**
   - `PORT`: 8080 (ou deixe o Railway definir)
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: https://agrotmsol.com.br,https://agrotm.vercel.app

### 3. Workflows Disponíveis

- **Deploy Automático:** Executa automaticamente quando você faz push para a branch `main`
  - **Frontend:** Deploy automático na Vercel
  - **Backend:** Deploy automático no Railway
- **Rollback Manual:** Permite fazer rollback para uma versão anterior através do GitHub Actions

### 4. Verificação

Após configurar os secrets:
1. Faça um push para a branch `main`
2. Vá em "Actions" no GitHub
3. Verifique se os workflows "frontend" e "backend" executaram com sucesso
4. Acesse sua URL da Vercel para confirmar o frontend
5. Acesse sua URL do Railway para confirmar o backend

### 5. Warnings Esperados

⚠️ **Nota:** Você pode ver warnings como "Context access might be invalid" no editor. 
Estes são **normais e seguros de ignorar** quando os secrets estão configurados corretamente.

- Os workflows incluem validação que falhará claramente se os secrets estiverem faltando
- Se o workflow executar com sucesso, significa que tudo está configurado corretamente
- Veja `.github/workflows/.github-actions-ignore` para mais detalhes

## Estrutura do projeto

- **Frontend:** Todo o frontend está em `frontend/` (Next.js)
- **Backend:** Todo o backend está em `backend/` (Express.js)
- **Outros serviços:** Estão em suas respectivas pastas

## Requisitos
- Node.js 20.x
- npm 9.x ou superior

## Endpoints do Backend

- `GET /health` - Health check
- `GET /api/health` - API health check
- `GET /api/status` - Status do serviço
- `GET /api/stats` - Estatísticas da plataforma
- `GET /api/pools` - Pools de staking

## Observações
- O deploy está 100% automatizado para frontend (Vercel) e backend (Railway)
- Não é necessário nenhum ajuste manual após o push
- Os workflows validam automaticamente se os secrets estão configurados
- **Configuração simplificada:** Apenas 2 secrets necessários (VERCEL_TOKEN e RAILWAY_TOKEN)
- **Sem ORG_ID ou PROJECT_ID:** Configuração mais simples e confiável
