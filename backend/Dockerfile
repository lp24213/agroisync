# Multi-stage build para AGROISYNC Backend
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Copiar package.json files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Etapa 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Copiar package.json files
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Etapa 3: Produção
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependências de produção e ferramentas
RUN apk add --no-cache dumb-init curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copiar arquivos de configuração
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/src/middleware ./src/middleware
COPY --from=builder /app/src/routes ./src/routes
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/src/types ./src/types

# Criar diretórios necessários
RUN mkdir -p logs uploads public && \
    chown -R nodejs:nodejs /app

# Mudar para usuário não-root
USER nodejs

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/handler.js"]
