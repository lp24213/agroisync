# Arquitetura AGROTM

## Visão Geral

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Node.js/Express, microserviços
- **Banco:** PostgreSQL
- **Blockchain:** Solana, EVM (opcional)
- **Monitoramento:** Prometheus, Grafana, Sentry
- **CI/CD:** GitHub Actions, Vercel
- **Documentação:** Swagger UI, Redoc

## Estrutura de Pastas

```
├── frontend/                # Next.js app
├── backend/                 # Serviços Node.js/Express
├── microservices/           # Microserviços (ex: user-service)
├── contracts/               # Smart contracts
├── src/                     # Libs compartilhadas (logger, monitoring, etc)
├── docs/                    # Documentação (Swagger, Redoc, arquitetura)
├── grafana/                 # Dashboards e provisioning
├── public/                  # Assets públicos
├── .github/                 # Workflows, templates, governança
```

## Fluxo de Deploy

1. Push para main
2. CI: Lint, build, test, security
3. Deploy automático na Vercel
4. Monitoramento ativo (Sentry, Prometheus, Grafana)

## Microserviços

- Cada serviço roda isolado, pode ser escalado individualmente.
- Comunicação via HTTP/REST (pode evoluir para gRPC ou mensageria).

## Observabilidade

- Logs estruturados (Pino)
- Tracing e erros (Sentry)
- Métricas (Prometheus)
- Dashboards (Grafana)

## Segurança

- Variáveis de ambiente seguras
- Dependabot, CODEOWNERS, SECURITY.md
- Política de disclosure

---

> Para detalhes de endpoints, veja `openapi.yaml` e `/docs`.
