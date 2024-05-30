FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat
RUN apk update
ENV SCOPE=@avila-tek/admin


FROM base AS builder
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
COPY . .
RUN npx turbo prune ${SCOPE} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci --no-audit

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npx turbo build --scope=${SCOPE} --filter=${SCOPE} 

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/backoffice/next.config.js .
COPY --from=installer /app/apps/backoffice/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/.next/static ./apps/backoffice/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/public ./apps/backoffice/public


EXPOSE 3002
ENV PORT 3002

CMD HOSTNAME="0.0.0.0" node apps/backoffice/server.js