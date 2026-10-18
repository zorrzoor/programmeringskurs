import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The Vite root is web/; the server serves web/dist. Hashed file names get long cache lifetimes (server/app.ts).
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
  test: { environment: "jsdom", include: ["test/**/*.test.ts"] },
});
