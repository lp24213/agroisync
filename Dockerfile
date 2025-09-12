FROM nginx:alpine

# Copiar arquivo HTML
COPY index.html /usr/share/nginx/html/

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
