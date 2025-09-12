# Dockerfile ÚNICO E COMPLETO para AgroSync Frontend
# Multi-stage build para produção

# Stage 1: Build do React
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação React
RUN npm run build:production

# Stage 2: Servidor Nginx
FROM nginx:alpine

# Copiar build do React
COPY --from=builder /app/build /usr/share/nginx/html

# Configurar nginx para porta 8080 (IBM Cloud Code Engine)
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Expor porta 8080
EXPOSE 8080

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]