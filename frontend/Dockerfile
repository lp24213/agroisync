# Multi-stage build para AGROISYNC Frontend
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Copiar package.json files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Etapa 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Copiar package.json files
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# Etapa 3: Produção
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependências de produção e ferramentas
RUN apk add --no-cache dumb-init curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copiar build do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
