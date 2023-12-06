FROM node:alpine as builder
WORKDIR /app

RUN apk add gettext
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
ARG DEPLOYABLE_VERSION
ENV DEPLOYABLE_VERSION=${DEPLOYABLE_VERSION}
RUN envsubst < ./index.html > ./index.html
ARG TARGETPLATFORM
RUN [ "$TARGETPLATFORM" = "linux/amd64" ] && npm run coverage || echo "Skipping tests on ARM64"
RUN npm run build

FROM caddy:2.7.5-alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
ENV NODE_ENV=production
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui
