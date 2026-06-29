FROM node:22-alpine AS builder
WORKDIR /app

# Install deps first (layer cache-friendly)
COPY apps/api/package.json ./apps/api/package.json
RUN cd apps/api && npm install

# Copy source files
# tsconfig.base.json must be at /app/ because api/tsconfig.json extends "../../tsconfig.base.json"
COPY tsconfig.base.json ./
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json

RUN cd apps/api && npm run build

# Production deps (no devDeps, no build scripts)
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY apps/api/package.json ./
RUN npm install --omit=dev --ignore-scripts

# Final image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist

USER nestjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/v1/health || exit 1

CMD ["node", "dist/main"]
