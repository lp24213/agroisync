# AGROISYNC Frontend Dockerfile
# Multi-stage build para produção

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
COPY pnpm-workspace.yaml ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Configurar permissões
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Comando de inicialização
CMD ["node", "server.js"]
