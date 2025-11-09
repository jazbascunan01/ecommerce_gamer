# --- Etapa 1: Instalación de dependencias ---
FROM node:20-alpine AS deps
WORKDIR /app

# Copiamos solo los package.json para aprovechar el caché de Docker
COPY apps/backend/package*.json ./apps/backend/
COPY domain/package*.json ./domain/
COPY package*.json ./

# Instalar SOLO las dependencias de producción
RUN npm install --prefix ./apps/backend --omit=dev
RUN npm install --prefix ./domain --omit=dev

# --- Etapa 2: Build ---
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos las dependencias de producción de la etapa anterior
COPY --from=deps /app .

# Instalamos TODAS las dependencias (incluidas las de desarrollo) para poder compilar
RUN npm install --prefix ./apps/backend
RUN npm install --prefix ./domain

# Copiamos el resto del código fuente
COPY apps/backend/prisma ./apps/backend/prisma
COPY apps/backend ./apps/backend
COPY domain ./domain

# Generamos el cliente de Prisma y compilamos el código TypeScript
RUN npx prisma generate --schema=./apps/backend/prisma/schema.prisma
RUN npx tsc -p apps/backend/tsconfig.json

# --- Etapa 3: Producción ---
FROM node:20-alpine
WORKDIR /app

# Copiamos solo los artefactos necesarios de las etapas anteriores
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/domain/node_modules ./domain/node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json

EXPOSE 3000

# Ejecutamos el código compilado de JavaScript
CMD ["node", "apps/backend/dist/index.js"]
