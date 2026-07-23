.prod

# ============================================================
# SIDRA Production Image
# Next.js 15

# ============================================================

FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

# ============================================================
# Dependencies
# ============================================================

FROM base AS deps

COPY package*.json ./

RUN npm ci

# ============================================================
# Builder
# ============================================================

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build

# ============================================================
# Runner
# ============================================================

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs

RUN adduser -S sidra -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder --chown=sidra:nodejs /app/.next/standalone ./

COPY --from=builder --chown=sidra:nodejs /app/.next/static ./.next/static

USER sidra

EXPOSE 3000

CMD ["node", "server.js"]
