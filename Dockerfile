FROM node:lts-alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
ARG DEPLOYABLE_VERSION
ENV VITE_DEPLOYABLE_VERSION $DEPLOYABLE_VERSION
RUN npm run lint
RUN npm run coverage
RUN npm run build

FROM caddy:alpine as production
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
ENV VITE_DEPLOYABLE_VERSION $DEPLOYABLE_VERSION
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui