# Migração para AWS - AGROTM

Este documento descreve as alterações realizadas para remover Vercel/Railway e padronizar o deploy do projeto na AWS (Amplify para frontend e ECS/Lambda para backend).

## O que foi removido

- Arquivos e menções Vercel:
  - `.vercelignore` (raiz) e `frontend/.vercelignore`
  - Referências em documentos como `DEPLOY_READY.md`, `DEPLOYMENT_READY.md`, `README-GITHUB.md` (atualizados para AWS)
- Integrações Railway:
  - Proxies/URLs hardcoded (ex.: `turntable.proxy.rlwy.net`)
  - Menções em `DEPLOYMENT_*` e páginas (`/status`, `/test`) atualizadas

## Ajustes realizados

- Frontend
  - `frontend/app/api/[...path]/route.ts`: agora usa `NEXT_PUBLIC_API_URL` (AWS) para proxy.
  - `frontend/app/status/page.tsx`: mostra URL/status da AWS.
  - `frontend/app/test/page.tsx`: texto atualizado para “AWS Amplify Deploy OK”.
  - `frontend/env.example`: URLs e instruções atualizado para Amplify.
  - `frontend/amplify.yml`: script de build para Amplify.

- Backend
  - `backend/src/config/security.ts`: origem padrão atualizada para domínios da AWS/produção.
  - `backend/env.production`: `ALLOWED_ORIGINS` ajustado para domínios AWS; seção de DB referencia RDS/DocumentDB.
  - `backend/src/server.ts`: healthcheck genérico para AWS.
  - `backend/README.md`: instruções de deploy para AWS.
  - `backend/task-definition-production.json`: permanece como base para ECS.

- CI/CD (GitHub Actions)
  - Criado `.github/workflows/backend-ecs-deploy.yml` para build/push no ECR e deploy no ECS.
  - `deploy-aws.yml` e `test-build.yml` já validam build de frontend/backend.

- Documentação
  - Atualizados: `DEPLOYMENT_READY.md`, `DEPLOYMENT_CHECKLIST.md`, `DEPLOY_READY.md`, `README-GITHUB.md`, `DEPLOYMENT_EXECUTION_COMPLETE.md`, `DEPLOYMENT_EXECUTION_GUIDE.md`.

## Variáveis de ambiente (exemplos)

- Frontend (Amplify Console)
  - `NEXT_PUBLIC_APP_URL=https://app.seu-amplify-domain.amplifyapp.com`
  - `NEXT_PUBLIC_API_URL=https://api.seu-dominio-aws.com`

- Backend (ECS/Secrets Manager)
  - `NODE_ENV=production`
  - `PORT=3001`
  - `JWT_SECRET=...`
  - `MONGODB_URI=...` (RDS/DocumentDB) ou variáveis equivalentes
  - `ALLOWED_ORIGINS=https://agrotmsol.com.br,https://www.agrotmsol.com.br`

## Como fazer deploy

1) Frontend (AWS Amplify)
   - Conecte o repositório e use `frontend/amplify.yml`.
   - Configure variáveis no Amplify Console.

2) Backend (AWS ECS)
   - Configure ECR/ECS e secrets no GitHub: `AWS_REGION`, `AWS_GITHUB_ROLE_ARN`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`, `ECS_CONTAINER_NAME`.
   - Push na branch `main` dispara `.github/workflows/backend-ecs-deploy.yml`.

3) Lambda (opcional)
   - Empacote handlers e publique com SAM/Serverless Framework.

## Testes

- Build local:
  - `cd frontend && npm run build`
  - `cd backend && npm run build`
- Healthcheck em produção:
  - `GET https://api.seu-dominio-aws.com/health`

## Observações

- Não foram removidos componentes, páginas, dados ou conteúdo.
- As referências a Vercel/Railway em documentação antiga foram atualizadas para AWS.

