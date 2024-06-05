FROM node:18-alpine AS base
ENV SCOPE=@avila-tek/admin

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG NEXT_PUBLIC_DO_TOKEN
ENV NEXT_PUBLIC_DO_TOKEN=${NEXT_PUBLIC_DO_TOKEN}

ARG NEXT_PUBLIC_PATH_SSH
ENV NEXT_PUBLIC_PATH_SSH=${NEXT_PUBLIC_PATH_SSH}

ARG NEXT_PUBLIC_API_SS
ENV NEXT_PUBLIC_API_SS=${NEXT_PUBLIC_API_SS}

ARG NEXT_PUBLIC_PWD
ENV NEXT_PUBLIC_PWD=${NEXT_PUBLIC_PWD}

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ARG GITHUB_ID
ENV GITHUB_ID=${GITHUB_ID}

ARG GITHUB_SECRET
ENV GITHUB_SECRET=${GITHUB_SECRET}

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN npx turbo prune ${SCOPE} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci --no-audit

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npx turbo run build --scope=${SCOPE} --filter=${SCOPE}...

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

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/.next/static ./apps/backoffice/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/backoffice/public ./apps/backoffice/public

EXPOSE 3002
ENV PORT 3002

CMD HOSTNAME="0.0.0.0" node apps/backoffice/server.js