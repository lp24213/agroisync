# Multi-stage build para AGROTM Frontend + Backend

# Etapa 1: Dependências do Frontend
FROM node:18-alpine AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

# Etapa 2: Build do Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ ./
RUN npm run build

# Etapa 3: Dependências do Backend
FROM node:18-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

# Etapa 4: Build do Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY backend/ ./
RUN npm run build

# Etapa 5: Produção Final
FROM node:18-alpine AS production
WORKDIR /app

# Instalar dependências de produção
RUN apk add --no-cache dumb-init

# Copiar frontend build
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-deps /app/frontend/node_modules ./frontend/node_modules

# Copiar backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules

# Copiar arquivos de configuração
COPY frontend/next.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY backend/tsconfig.json ./backend/

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor portas
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"] 