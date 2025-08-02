# AGROTM.SOL - Monorepo Limpo

## Estrutura

- frontend/ (Next.js, Vercel)
- backend/ (Express, Railway)
- .github/
- vercel.json
- README.md
- package.json

## Como rodar localmente

### Frontend
```sh
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Backend
```sh
cd backend
npm install
npm run dev
# http://localhost:8080
```

## Build de produção

### Frontend
```sh
cd frontend
npm run build && npm start
```

### Backend
```sh
cd backend
npm run build && npm start
```

## Deploy automático (CI/CD)

- Push para main → deploy automático
- Frontend: Vercel (usa VERCEL_TOKEN)
- Backend: Railway (usa RAILWAY_TOKEN)

## Estrutura garantida
- Nenhum arquivo de backend no frontend
- Nenhum arquivo de frontend no backend
- Deploy 100% funcional
- Página principal `/` online sem erro 404
