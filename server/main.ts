// Starts the course server: static files from WEB_DIR, SQLite at DATABASE_PATH, port PORT.
// With TLS_CERT_FILE and TLS_KEY_FILE it serves HTTPS (the cluster requires TLS all the way to the pod,
// certificate from the internal CA); without them plain HTTP, for local development.
import { readFileSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer, Server as HttpsServer } from "node:https";
import { createHandler } from "./app.ts";
import { readConfig } from "./config.ts";
import { Store } from "./db.ts";

const log = (meddelande: string, level = "info") => console.log(JSON.stringify({ level, meddelande }));
const port = Number(process.env.PORT ?? 8080);
const store = new Store(process.env.DATABASE_PATH ?? "./data/kurs.db");
const config = readConfig(process.env);
const handler = createHandler({ store, config, webDir: process.env.WEB_DIR ?? "./web/dist" });

// A consistent copy of the database every day (and at start), the newest 7 kept, next to the database on
// the volume: protects against mistakes such as a removed name, not against loss of the disk itself.
const backupDir = process.env.BACKUP_DIR ?? "";
if (backupDir) {
  const backup = () => {
    try {
      store.backup(backupDir, new Date().toISOString().slice(0, 10), Number(process.env.BACKUP_KEEP ?? 7));
    } catch (err) {
      log(`säkerhetskopian misslyckades: ${String(err)}`, "error");
    }
  };
  backup();
  setInterval(backup, 24 * 3600 * 1000).unref();
}

// Names nobody used (no saved exercise, no lesson visited) only take a place: remove them after a while.
if (config.unusedNameHours > 0) {
  const clean = () => {
    try {
      const removed = store.removeUnused(Date.now() - config.unusedNameHours * 3600_000);
      if (removed > 0) log(`${removed} oanvända namn borttagna`);
    } catch (err) {
      log(`rensningen av oanvända namn misslyckades: ${String(err)}`, "error");
    }
  };
  clean();
  setInterval(clean, 3600 * 1000).unref();
}

const certFile = process.env.TLS_CERT_FILE;
const keyFile = process.env.TLS_KEY_FILE;
const readTls = () => ({ cert: readFileSync(certFile ?? ""), key: readFileSync(keyFile ?? "") });
const server = certFile && keyFile ? createHttpsServer(readTls(), handler) : createHttpServer(handler);
server.requestTimeout = 15_000;

// cert-manager renews the certificate in the mounted secret; pick it up without a restart.
if (server instanceof HttpsServer) {
  setInterval(
    () => {
      try {
        server.setSecureContext(readTls());
      } catch (err) {
        log(`kunde inte läsa om certifikatet: ${String(err)}`, "error");
      }
    },
    12 * 3600 * 1000,
  ).unref();
}

server.listen(port, "0.0.0.0", () => log(`lyssnar på ${port}${certFile ? " (TLS)" : ""}, läge ${config.lage}`));

// Kubernetes sends SIGTERM: finish running requests, then close the database cleanly.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    server.close(() => {
      store.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
