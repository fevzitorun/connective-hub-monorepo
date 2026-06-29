FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@11

# ─── Install deps ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @7fil/api...

# ─── Build ────────────────────────────────────────────────────────────────────
FROM deps AS builder
COPY apps/api ./apps/api
COPY packages ./packages
RUN pnpm --filter @7fil/api build

# ─── Runtime ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@11

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nestjs:nodejs apps/api/package.json ./apps/api/
COPY --chown=nestjs:nodejs packages/ ./packages/

RUN pnpm install --frozen-lockfile --prod --filter @7fil/api...

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/v1/health || exit 1

CMD ["node", "dist/main"]
