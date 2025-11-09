
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY domain/package*.json ./domain/

RUN npm install --prefix ./apps/backend
RUN npm install --prefix ./domain

COPY apps/backend ./apps/backend
COPY domain ./domain

RUN npm install prisma --prefix ./apps/backend
WORKDIR /app/apps/backend
RUN npx prisma generate --schema=./prisma/schema.prisma


FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/apps/backend ./apps/backend
COPY --from=build /app/domain ./domain
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/domain/node_modules ./domain/node_modules

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./apps/backend/prisma/schema.prisma && node apps/backend/dist/index.js"]
