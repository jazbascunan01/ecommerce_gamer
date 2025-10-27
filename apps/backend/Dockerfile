FROM node:20-alpine AS build
WORKDIR /app
COPY apps/backend/package*.json ./apps/backend/
COPY domain/package*.json ./domain/
RUN npm install --prefix ./apps/backend
RUN npm install --prefix ./domain
COPY apps/backend/prisma ./apps/backend/prisma
RUN npx --prefix ./apps/backend prisma generate --schema=./apps/backend/prisma/schema.prisma
COPY apps/backend ./apps/backend
COPY domain ./domain
RUN npm install --prefix ./apps/backend --save-dev @types/cors @types/jest
RUN npx --prefix ./apps/backend tsc -p apps/backend/tsconfig.json
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/domain/node_modules ./domain/node_modules
COPY --from=build /app/apps/backend ./apps/backend
COPY --from=build /app/domain ./domain
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "./apps/backend"]
