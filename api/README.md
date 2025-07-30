# AGROTM API

API da plataforma AGROTM Solana.

## Endpoints

### Pools
- `GET /api/pools` - Listar pools
- `POST /api/pools` - Criar pool
- `GET /api/pools/[id]` - Obter pool específico
- `PUT /api/pools/[id]` - Atualizar pool
- `DELETE /api/pools/[id]` - Deletar pool

### Stats
- `GET /api/stats` - Obter estatísticas
- `GET /api/stats/tvl` - Obter TVL
- `GET /api/stats/apr` - Obter APR

### Transactions
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `GET /api/transactions/[id]` - Obter transação

## Tecnologias

- Next.js 14
- TypeScript
- Solana Web3.js

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
``` 