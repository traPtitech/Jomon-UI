FROM --platform=$BUILDPLATFORM node:24.11.0-alpine@sha256:f36fed0b2129a8492535e2853c64fbdbd2d29dc1219ee3217023ca48aebd3787 AS build
RUN apk add --update --no-cache openjdk17-jre-headless

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts/ ./scripts/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm gen-api

RUN NODE_ENV=production pnpm build

FROM nginx:1.31-alpine@sha256:0563c36f94a6d3ec3584161b77859f740f7e20b4853f52c796a864ce6908e8ea

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /app/override && \
    chown -R appuser:appgroup /app/override /var/cache/nginx /var/log/nginx && \
    sed -i 's/^user/#user/' /etc/nginx/nginx.conf && \
    sed -i 's|^pid.*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf

USER appuser
EXPOSE 8080

VOLUME ["/app/override"]

CMD ["nginx", "-g", "daemon off;"]