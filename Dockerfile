# Etapa 1: Base para dependências
FROM node:20 AS deps
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Instalar dependências do backend
WORKDIR /app/backend
RUN npm install --legacy-peer-deps

# Instalar dependências do frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Voltar para /app
WORKDIR /app

# Etapa 2: Build final
FROM node:20 AS builder
WORKDIR /app

# Copiar dependências já instaladas
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copiar código-fonte
COPY . .

# Build do frontend (ajustar se usar vite/next)
WORKDIR /app/frontend
RUN npm run build

# Etapa 3: Produção
FROM node:20 AS production
WORKDIR /app

COPY --from=builder /app ./

WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "run", "start"] 