FROM --platform=linux/amd64 node:alpine as builder
WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
ARG DEPLOYABLE_VERSION
RUN echo "export const VERSION = '${DEPLOYABLE_VERSION}'" > ./src/version.ts
ARG TARGETPLATFORM
RUN [ "$TARGETPLATFORM" = "linux/amd64" ] && npm run coverage || echo "Skipping tests on ARM64"
RUN npm run build

FROM caddy:alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
ENV NODE_ENV=production
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui
