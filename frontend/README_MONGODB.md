# Onboarding MongoDB AGROTM

## Healthcheck
- Endpoint: `/api/test-mongodb` retorna status e coleções.
- Se retornar erro de conexão, verifique se o serviço MongoDB está rodando e se o arquivo `.env.local` está correto.

## Testes Automatizados
- Execute: `npm test` para rodar testes dos endpoints.

## Seed de Dados
- Execute: `npx ts-node scripts/seed-mongodb.ts` para popular o banco com dados exemplo.

## Monitoramento
- Recomenda-se integrar com Sentry, Prometheus ou MongoDB Atlas Monitoring para rastreamento de falhas.

## Dicas
- Para rodar local, sempre inicie o serviço MongoDB antes do Next.js.
- Para produção, utilize MongoDB Atlas e ajuste a string de conexão no `.env.local`.
