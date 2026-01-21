FROM --platform=$BUILDPLATFORM node:24.11.0-alpine AS build
RUN apk add --update --no-cache openjdk17-jre-headless

WORKDIR /app

COPY package*.json ./
COPY scripts/ ./scripts/

RUN npm ci

COPY . .
RUN npm run gen-api

RUN NODE_ENV=production npm run build

FROM nginx:1.25-alpine

EXPOSE 80

COPY --from=build /app/dist /usr/share/nginx/html

RUN mkdir -p /app/override

VOLUME ["/app/override"]

CMD ["nginx", "-g", "daemon off;"]