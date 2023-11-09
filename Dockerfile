FROM node:lts-alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install -f
COPY . .
RUN npm run build

FROM caddy:alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui
