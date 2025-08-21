# AGROISYNC - Documentação

## Estrutura do Projeto

### Frontend
- **Tecnologia**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Deploy**: AWS Amplify

### Backend
- **Tecnologia**: Node.js + Express + TypeScript
- **Deploy**: AWS ECS
- **Database**: MongoDB Atlas

### Blockchain
- **Plataforma**: Solana
- **Framework**: Anchor

## Scripts Disponíveis

### Deployment
- `scripts/deployment/fix-amplify-build-complete.sh` - Fix do build Amplify
- `scripts/deployment/fix-amplify-build-complete.ps1` - Versão PowerShell

### Setup
- `scripts/setup/setup-aws-credentials.sh` - Configurar credenciais AWS
- `scripts/setup/setup-amplify-cli-credentials.sh` - Configurar Amplify CLI

### Verification
- `scripts/verification/verify-amplify-deployment-ready.sh` - Verificar se está pronto para deploy
- `scripts/verification/verify-amplify-status.sh` - Verificar status do Amplify

## Configuração

Todas as configurações estão centralizadas em:
- `config/project-config.yml` - Configuração principal
- `amplify.yml` - Configuração do Amplify
- `package.json` - Configuração dos workspaces

## Deploy

### Frontend (Automático via Amplify)
```bash
git push origin main
```

### Backend (Manual via ECS)
```bash
cd backend
docker build -t agroisync-backend .
# Deploy via workflow GitHub Actions
```

## Monitoramento

- **Frontend**: AWS Amplify Console
- **Backend**: AWS ECS Console + CloudWatch
- **Logs**: CloudWatch Logs
