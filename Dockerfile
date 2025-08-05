# Multi-stage build para AGROTM Frontend
FROM node:18-alpine AS deps
WORKDIR /app

# Copiar package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Instalar dependências
RUN npm ci --only=production
RUN cd frontend && npm ci --only=production

# Etapa 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copiar código fonte
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Etapa 3: Produção
FROM node:18-alpine AS production
WORKDIR /app

# Instalar dependências de produção
RUN apk add --no-cache dumb-init curl

# Copiar build
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package*.json ./frontend/

# Copiar dependências de produção
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copiar arquivos de configuração
COPY frontend/next.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/tsconfig.json ./frontend/

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "cd frontend && npm start"] 