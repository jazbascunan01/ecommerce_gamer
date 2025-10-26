# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY apps/backend/package*.json ./apps/backend/
COPY domain/package*.json ./domain/

# Instalar todas las dependencias (dev + prod)
RUN npm install --prefix ./apps/backend
RUN npm install --prefix ./domain

# Copiar Prisma schema
COPY apps/backend/prisma ./apps/backend/prisma

# Generar Prisma Client indicando la ubicación del schema
RUN npx --prefix ./apps/backend prisma generate --schema=./apps/backend/prisma/schema.prisma


# Copiar el resto del código
COPY apps/backend ./apps/backend
COPY domain ./domain

# Instalar tipos que faltan
RUN npm install --prefix ./apps/backend --save-dev @types/cors @types/jest

# Compilar TypeScript
RUN npx --prefix ./apps/backend tsc -p apps/backend/tsconfig.json

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copiar node_modules de producción y código compilado
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/domain/node_modules ./domain/node_modules

COPY --from=build /app/apps/backend ./apps/backend
COPY --from=build /app/domain ./domain

# Exponer puerto y comando de arranque
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "./apps/backend"]
