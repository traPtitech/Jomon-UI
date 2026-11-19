FROM --platform=$BUILDPLATFORM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
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