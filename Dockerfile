FROM --platform=$BUILDPLATFORM node:24.11.0-alpine@sha256:f36fed0b2129a8492535e2853c64fbdbd2d29dc1219ee3217023ca48aebd3787 AS build
RUN apk add --update --no-cache openjdk17-jre-headless

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts/ ./scripts/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm gen-api

RUN NODE_ENV=production pnpm build

FROM nginx:1.25-alpine@sha256:516475cc129da42866742567714ddc681e5eed7b9ee0b9e9c015e464b4221a00

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