# AGROTM Frontend Dockerfile
# Multi-stage build para otimização

# Stage 1: Build
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY next.config.js ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Alterar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Variável de ambiente
ENV PORT 3000
ENV NODE_ENV production

# Comando de inicialização
CMD ["node", "server.js"] 