FROM node:lts-alpine@sha256:44aaf1ccc80eaed6572a0f2ef7d6b5a2982d54481e4255480041ac92221e2f11 as builder-amd64
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

FROM nginx:stable-alpine as production
ENV NODE_ENV production
COPY --from=builder-amd64 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV VITE_DEPLOYABLE_VERSION $DEPLOYABLE_VERSION
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-ui