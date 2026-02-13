# 🐳 AGROISYNC IA - Docker Image

FROM python:3.11-slim

# Metadados
LABEL maintainer="Agroisync <contato@agroisync.com>"
LABEL description="Backend de IA Administradora do Agroisync"

# Diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (para aproveitar cache do Docker)
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 8000

# Variáveis de ambiente padrão
ENV ENVIRONMENT=production
ENV PORT=8000
ENV HOST=0.0.0.0

# Comando para iniciar
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

