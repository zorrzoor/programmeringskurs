# The course: a small Node.js server (no npm dependencies at run time) that serves the built site and
# stores progress in SQLite. Node runs the TypeScript of the server directly (type stripping), so the
# server needs no build step; only the site (web/) is built, in the first stage.
FROM docker.io/library/node:24-alpine@sha256:4eefa1bfce4197942661ef9148247d779ddf1bb0ee006d3294a467609de60724 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./web/
COPY scripts/ ./scripts/
COPY content/ ./content/
RUN npm run build

FROM docker.io/library/node:24-alpine@sha256:4eefa1bfce4197942661ef9148247d779ddf1bb0ee006d3294a467609de60724
# Runs as an unprivileged user (1000 here, 10001 in the cluster); the database directory is a mounted volume.
WORKDIR /app
COPY server/ ./server/
COPY --from=build /src/web/dist ./web/dist
ENV NODE_ENV=production PORT=8080 DATABASE_PATH=/data/kurs.db WEB_DIR=/app/web/dist
USER 1000:1000
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD ["node", "-e", "fetch('http://127.0.0.1:8080/api/halsa').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]
CMD ["node", "server/main.ts"]
