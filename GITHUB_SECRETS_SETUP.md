# Configuração dos Secrets do GitHub para AGROTM

## Secrets Necessários

Para que o deploy automático funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

### 1. VERCEL_TOKEN
- **O que é**: Token de autenticação da Vercel
- **Como obter**: 
  1. Acesse [vercel.com](https://vercel.com)
  2. Vá em Settings > Tokens
  3. Clique em "Create Token"
  4. Dê um nome como "AGROTM Deploy"
  5. Copie o token gerado

### 2. VERCEL_ORG_ID
- **O que é**: ID da organização da Vercel
- **Como obter**:
  1. Acesse [vercel.com](https://vercel.com)
  2. Vá em Settings > General
  3. Copie o "Team ID" (se for team) ou "User ID" (se for pessoal)

### 3. VERCEL_PROJECT_ID
- **O que é**: ID do projeto na Vercel
- **Como obter**:
  1. Acesse seu projeto na Vercel
  2. Vá em Settings > General
  3. Copie o "Project ID"

## Como Configurar

1. Acesse seu repositório no GitHub
2. Vá em Settings > Secrets and variables > Actions
3. Clique em "New repository secret"
4. Adicione cada secret com o nome e valor correspondente

## Verificação

Após configurar os secrets, faça um push para a branch `main`:

```bash
git add .
git commit -m "Trigger deployment - AGROTM ready for production"
git push origin main
```

O deploy deve iniciar automaticamente e você pode acompanhar o progresso em:
- GitHub: Actions tab
- Vercel: Dashboard do projeto

## Troubleshooting

Se o deploy falhar:

1. **Verifique os secrets**: Confirme se todos os secrets estão configurados corretamente
2. **Verifique o domínio**: Confirme se o domínio `agrotmsol.com.br` está configurado na Vercel
3. **Verifique os logs**: Acesse os logs do GitHub Actions para identificar o erro específico
4. **Teste localmente**: Execute `npm run build:all` localmente para verificar se há problemas de build

## Estrutura do Deploy

O deploy inclui:
- ✅ Frontend (Next.js) - `/frontend`
- ✅ Backend (Node.js) - `/backend` 
- ✅ API Routes - `/api/*`
- ✅ Assets e imagens
- ✅ Configurações de segurança
- ✅ Domínio personalizado: `agrotmsol.com.br`
