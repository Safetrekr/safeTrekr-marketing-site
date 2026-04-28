# stage 1 - install doppler cli
FROM debian:bullseye-slim AS doppler-install
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget ca-certificates curl gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /etc/apt/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get install -y doppler

# stage 2 - build next.js app
#
# Pinned to node:20-alpine because Next.js 16.2.3 + React 19.0.0's webpack
# build prerender of /_global-error fails on node 22 with
# "Cannot read properties of null (reading 'useContext')" inside the bundled
# OuterLayoutRouter chunk (function C in chunks/<n>.js -- the React module
# namespace `i` is null at SSG time). Same bundle output runs fine on
# node 20. Likely a node 22 module-resolution interaction with Next.js's
# react-server condition. Revisit when Next.js / React patch this.
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Doppler binary for the build stage -- NEXT_PUBLIC_* vars are baked into the
# client bundle at build time, so `doppler run -- next build` is how we inject
# them from the Doppler config (single source of truth, no duplicated public
# config in GH Actions secrets).
COPY --from=doppler-install /usr/bin/doppler /usr/local/bin/doppler

# copy pkg files - caching
COPY package.json package-lock.json ./

# install deps
RUN npm ci

# copy src
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Cache-buster: BuildKit's cache key for `RUN --mount=type=secret` does NOT
# include the secret value (intentional, prevents secret leakage via cache
# identity). That means if Doppler values change but no source files change,
# GHA's `cache-from: type=gha` will reuse the previously-built layer with the
# OLD baked-in NEXT_PUBLIC_* values. Passing GIT_SHA as a build arg makes the
# layer's cache key change per commit, forcing a fresh build whenever any
# code changes -- which is the only point at which we'd want fresh secrets
# baked in anyway. Local builds without --build-arg GIT_SHA fall back to
# "dev" and behave normally.
ARG GIT_SHA=dev

# BuildKit secret mount keeps the Doppler token out of image layers. CI passes
# it via `secrets: doppler_token=...` on docker/build-push-action; locally you
# can build with `DOCKER_BUILDKIT=1 docker build --secret id=doppler_token,env=DOPPLER_TOKEN .`
#
# `sh -c 'NODE_ENV=production npm run build'` explicitly overrides whatever
# NODE_ENV Doppler injects from the config (typically "dev" for the dev
# config). Webpack/React condition resolution depends on NODE_ENV being
# exactly "production" or "development" -- a non-standard value causes the
# bundle to load a React surface missing hooks like useContext, surfacing
# as a useContext-null TypeError during the SSG prerender of /_global-error.
RUN --mount=type=secret,id=doppler_token,required=true \
    DOPPLER_TOKEN=$(cat /run/secrets/doppler_token) \
    SHA="$GIT_SHA" doppler run -- sh -c 'NODE_ENV=production npm run build'

# stage 3 - prod runner
FROM node:20-alpine AS runner
WORKDIR /app

# Bust this ARG (via --build-arg SECURITY_REFRESH=<date>) or build with --pull
# to force this layer to rebuild and pick up the latest Alpine CVE patches.
# The docker/build-push-action in CI sets pull: true so base images refresh
# on every run; this ARG is the manual override path.
ARG SECURITY_REFRESH=2026-04-24

# Refresh the apk index, upgrade every installed package (picks up musl and
# musl-utils CVE fixes), then remove unused package managers to shrink the
# image and reduce attack surface.
RUN apk update && \
    apk upgrade --no-cache --available && \
    (npm uninstall -g npm yarn corepack 2>/dev/null || true) && \
    rm -rf /usr/local/lib/node_modules/npm /opt/yarn* /usr/local/lib/node_modules/corepack /var/cache/apk/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# copy doppler bin from stage 1
COPY --from=doppler-install /usr/bin/doppler /usr/local/bin/doppler

# create non-root user matching k8s security ctx
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -G nodejs -S nextjs && \
    mkdir -p /home/nextjs/.doppler && \
    mkdir -p /app/.doppler && \
    chown -R nextjs:nodejs /home/nextjs && \
    chown -R nextjs:nodejs /app

# copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# doppler wraps node cmd to inject secrets
CMD ["doppler", "run", "--", "node", "server.js"]
