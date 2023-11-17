FROM node:alpine as builder
WORKDIR /app

RUN apk add chromium
ENV CHROME_BIN=/usr/bin/chromium-browser

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npm run test-ci
RUN npm run build

FROM caddy:2.7.5-alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui
