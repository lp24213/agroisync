# Multi-stage build para otimização
FROM node:20-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY src/ ./src/

# Build do projeto
RUN npm run build

# Stage de produção
FROM node:20-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Instalar dependências de runtime
RUN apk add --no-cache dumb-init

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências e build do stage anterior
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Expor porta
EXPOSE 3001

# Mudar para usuário não-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"] 