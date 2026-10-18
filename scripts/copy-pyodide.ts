// Copies the Pyodide runtime from node_modules into web/public/pyodide/, so that Vite puts it in web/dist and the
// course server delivers it itself (no external CDN: the content security policy only allows our own origin).
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const FILES = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];
const out = join(ROOT, "web", "public", "pyodide");
mkdirSync(out, { recursive: true });
for (const f of FILES) copyFileSync(join(ROOT, "node_modules", "pyodide", f), join(out, f));
console.log(`pyodide: ${FILES.length} files copied to web/public/pyodide`);
