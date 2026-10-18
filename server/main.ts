// Starts the course server: static files from WEB_DIR, SQLite at DATABASE_PATH, port PORT.
import { createServer } from "node:http";
import { createHandler } from "./app.ts";
import { Store } from "./db.ts";

const port = Number(process.env.PORT ?? 8080);
const store = new Store(process.env.DATABASE_PATH ?? "./data/kurs.db");
const server = createServer(createHandler({ store, webDir: process.env.WEB_DIR ?? "./web/dist" }));
server.requestTimeout = 15_000;
server.listen(port, "0.0.0.0", () => console.log(JSON.stringify({ level: "info", meddelande: `lyssnar på ${port}` })));

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
