# =========================
# 🏗️ Etapa 1: Build de Angular
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install
# Instalar jwt-decode y tipos (para Angular + TypeScript)
RUN npm install jwt-decode
RUN npm install --save-dev @types/jwt-decode
# Copiar todo el código fuente
COPY . .

# (Opcional) instalar dependencias extra si no están en package.json
# RUN npm install jwt-decode @types/jwt-decode --save-dev

# Build de producción
RUN npm run build

# =========================
# 🚀 Etapa 2: Servir con Nginx
# =========================
FROM nginx:stable-alpine

# Copiar los archivos generados por Angular al directorio público de Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (si existe)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto HTTP
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
