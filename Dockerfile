FROM node:lts-alpine as builder
WORKDIR /app
ENV CHROME_BIN="/usr/bin/chromium-browser"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm i
COPY . .
ARG DEPLOYABLE_VERSION
ENV DEPLOYABLE_VERSION $DEPLOYABLE_VERSION
# RUN npm run test-ci
RUN npm run build

FROM caddy:alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
ENV DEPLOYABLE_VERSION $DEPLOYABLE_VERSION
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui
