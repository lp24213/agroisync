# AGROTM.SOL - Monorepo

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

## Deploy na Vercel

```sh
vercel --prod
```

## Estrutura do projeto

- Todo o frontend está em `frontend/`
- O backend e outros serviços estão em suas respectivas pastas

## Requisitos
- Node.js 20.x
- npm 9.x ou superior

## Observações
- O deploy na Vercel está 100% automatizado para rodar o frontend de `frontend/`.
- Não é necessário nenhum ajuste manual após o push.
