# The course: a small Node.js server (no npm dependencies at run time) that serves the built site and
# stores progress in SQLite. Node runs the TypeScript directly (type stripping), so there is no build step
# for the server. The site (web/dist) is added by the build stage once it exists (#3).
FROM docker.io/library/node:24-alpine@sha256:429bdfbc204b4eabc6438e6d34e4e9d8dd2ca1df8289bcd78cdd3c5db387b7a5

# Runs as the unprivileged "node" user (uid 1000); the database directory is a mounted volume.
WORKDIR /app
COPY server/ ./server/
COPY web/public/ ./web/dist/
ENV NODE_ENV=production PORT=8080 DATABASE_PATH=/data/kurs.db WEB_DIR=/app/web/dist
USER 1000:1000
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD ["node", "-e", "fetch('http://127.0.0.1:8080/api/halsa').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]
CMD ["node", "server/main.ts"]
