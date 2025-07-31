# 🚀 Configuração de Deploy Automático - Vercel + GitHub Actions

## 📋 Pré-requisitos

1. **Conta Vercel**: [vercel.com](https://vercel.com)
2. **Conta GitHub**: [github.com](https://github.com)
3. **Projeto configurado**: Este repositório deve estar conectado ao GitHub

## 🔧 Configuração do Vercel

### 1. Criar Projeto no Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install --frozen-lockfile`

### 2. Obter Credenciais do Vercel

#### VERCEL_TOKEN
1. Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em "Create Token"
3. Nome: `AGROTM-GitHub-Actions`
4. Expiration: `No Expiration`
5. Scope: `Full Account`
6. Copie o token gerado

#### VERCEL_ORG_ID
1. Acesse [vercel.com/account](https://vercel.com/account)
2. Vá para a aba "Settings"
3. Role até "General"
4. Copie o "Team ID" (se for team) ou "User ID" (se for pessoal)

#### VERCEL_PROJECT_ID
1. No dashboard do Vercel, abra seu projeto
2. Vá para "Settings" > "General"
3. Role até "Project ID"
4. Copie o ID do projeto

## 🔐 Configuração dos Secrets no GitHub

### 1. Acessar Secrets do Repositório

1. Vá para seu repositório no GitHub
2. Clique em "Settings"
3. No menu lateral, clique em "Secrets and variables" > "Actions"

### 2. Adicionar Secrets

Clique em "New repository secret" e adicione:

#### VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: [Token copiado do Vercel]

#### VERCEL_ORG_ID
- **Name**: `VERCEL_ORG_ID`
- **Value**: [Team/User ID copiado do Vercel]

#### VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: [Project ID copiado do Vercel]

## 📁 Estrutura de Arquivos

```
agrotm-solana/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Workflow principal
├── frontend/
│   ├── vercel.json           # Configuração específica do frontend
│   ├── package.json
│   └── ...
├── vercel.json               # Configuração raiz (legacy)
└── VERCEL_DEPLOY.md          # Esta documentação
```

## 🔄 Como Funciona o Deploy

### Workflow GitHub Actions

1. **Trigger**: Push para branch `main`
2. **Jobs**:
   - `test`: Lint, testes e type-check
   - `build`: Build da aplicação
   - `deploy-staging`: Deploy para staging
   - `deploy-production`: Deploy para produção
   - `security-scan`: Análise de segurança
   - `performance-test`: Testes de performance

### Configuração do Deploy

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./frontend
    vercel-args: '--prod'
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🛠️ Configurações Específicas

### frontend/vercel.json

```json
{
  "version": 2,
  "name": "agrotm-frontend",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

## 🚨 Troubleshooting

### Erro: "Unable to resolve action"
- Verifique se o repositório e versão da action estão corretos
- Actions usadas:
  - `actions/checkout@v4`
  - `actions/setup-node@v4`
  - `pnpm/action-setup@v2`
  - `amondnet/vercel-action@v25`

### Erro: "Build failed"
- Verifique se o `working-directory` está correto (`./frontend`)
- Confirme se o `buildCommand` está correto (`pnpm build`)
- Verifique se todas as dependências estão instaladas

### Erro: "Authentication failed"
- Verifique se os secrets estão configurados corretamente
- Confirme se o VERCEL_TOKEN tem permissões adequadas
- Verifique se o VERCEL_ORG_ID e VERCEL_PROJECT_ID estão corretos

### Erro: "Project not found"
- Confirme se o VERCEL_PROJECT_ID está correto
- Verifique se o projeto existe no Vercel
- Confirme se o VERCEL_ORG_ID está correto

## 📊 Monitoramento

### Logs do Deploy
- **GitHub Actions**: Acesse a aba "Actions" no repositório
- **Vercel**: Dashboard do projeto > "Deployments"

### Status do Deploy
- ✅ **Success**: Deploy realizado com sucesso
- ❌ **Failed**: Erro no deploy (verificar logs)
- ⏳ **Pending**: Deploy em andamento

## 🔒 Segurança

### Secrets
- Nunca commite tokens diretamente no código
- Use sempre GitHub Secrets
- Rotacione tokens periodicamente
- Use tokens com escopo mínimo necessário

### Headers de Segurança
- Configurados automaticamente via `vercel.json`
- Incluem proteções contra XSS, clickjacking, etc.

## 📈 Performance

### Otimizações Automáticas
- **Build Caching**: Vercel cacheia builds automaticamente
- **CDN**: Distribuição global automática
- **Edge Functions**: Execução próxima ao usuário
- **Image Optimization**: Otimização automática de imagens

### Monitoramento
- **Core Web Vitals**: Métricas de performance
- **Analytics**: Dados de uso e performance
- **Real User Monitoring**: Performance real dos usuários

## 🆘 Suporte

### Links Úteis
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Documentation](https://nextjs.org/docs)

### Contato
- **Email**: support@agrotm.com
- **Documentação**: https://docs.agrotm.com
- **Issues**: https://github.com/agrotm/agrotm-solana/issues

---

**Última atualização**: $(date)
**Versão**: 2.0.0
