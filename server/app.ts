// HTTP handler: the JSON API for names and progress, plus the static files of the course.
// No dependencies. Requests are logged as one JSON line without names (they are personal).
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import type { Store } from "./db.ts";
import { cleanCode, cleanId, cleanName, cleanTime, MAX_BODY_BYTES } from "./validate.ts";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".zip": "application/zip",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

// Pyodide needs WebAssembly compilation ('wasm-unsafe-eval') and a worker; nothing else leaves the origin.
const SECURITY_HEADERS = {
  "content-security-policy":
    "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
    "worker-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cross-origin-opener-policy": "same-origin",
};

export interface Options {
  store: Store;
  webDir: string;
  /** Writes per minute, all clients together (there is one pod behind one proxy address). */
  writesPerMinute?: number;
  log?: (line: string) => void;
  now?: () => number;
}

class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const bad = (code: string, message: string) => new HttpError(422, code, message);

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, "for-stort", "Anropet är för stort.");
    chunks.push(chunk as Buffer);
  }
  try {
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    if (value !== null && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    // fall through
  }
  throw new HttpError(400, "ogiltig-json", "Anropet var inte giltig JSON.");
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    throw bad("ogiltigt-namn", "Namnet gick inte att läsa.");
  }
}

export function createHandler(opts: Options): (req: IncomingMessage, res: ServerResponse) => void {
  const { store, webDir } = opts;
  const limit = opts.writesPerMinute ?? 300;
  const now = opts.now ?? Date.now;
  const log = opts.log ?? ((line: string) => console.log(line));
  let windowStart = now();
  let writes = 0;

  function json(res: ServerResponse, status: number, body?: unknown): void {
    const data = body === undefined ? "" : JSON.stringify(body);
    res.writeHead(status, { ...SECURITY_HEADERS, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(data);
  }

  function allowWrite(): boolean {
    if (now() - windowStart >= 60_000) {
      windowStart = now();
      writes = 0;
    }
    return ++writes <= limit;
  }

  async function api(req: IncomingMessage, res: ServerResponse, path: string[]): Promise<string> {
    const method = req.method ?? "GET";
    const write = method !== "GET" && method !== "HEAD";
    if (write && !allowWrite()) throw new HttpError(429, "for-manga-anrop", "För många anrop. Vänta en stund.");
    const [, , resource, rawName, sub, rawId] = path; // ["", "api", resource, name, sub, id]

    if (resource === "halsa" && path.length === 3) {
      if (method !== "GET") throw new HttpError(405, "metod", "Metoden stöds inte.");
      json(res, 200, { ok: true });
      return "/api/halsa";
    }
    if (resource !== "namn") throw new HttpError(404, "saknas", "Sidan finns inte.");

    if (path.length === 3) {
      if (method === "GET") {
        json(res, 200, { namn: store.names() });
        return "GET /api/namn";
      }
      if (method === "POST") {
        const name = cleanName((await readJson(req)).namn);
        if (name === null) throw bad("ogiltigt-namn", "Namnet ska vara 1–30 tecken: bokstäver, siffror, mellanslag och bindestreck.");
        const result = store.addName(name);
        if (result === "exists") throw new HttpError(409, "namnet-finns", "Namnet finns redan.");
        if (result === "full") throw new HttpError(409, "for-manga-namn", "Det finns redan för många namn. Ta bort ett först.");
        json(res, 201, { namn: name });
        return "POST /api/namn";
      }
      throw new HttpError(405, "metod", "Metoden stöds inte.");
    }

    const name = cleanName(decodeSegment(rawName ?? ""));
    if (name === null) throw bad("ogiltigt-namn", "Namnet är inte giltigt.");
    const notFound = new HttpError(404, "okant-namn", "Det namnet finns inte.");

    if (path.length === 4) {
      if (method !== "DELETE") throw new HttpError(405, "metod", "Metoden stöds inte.");
      if (!store.removeName(name)) throw notFound;
      json(res, 204);
      return "DELETE /api/namn/:namn";
    }
    if (path.length === 5 && sub === "framsteg" && method === "GET") {
      const progress = store.progress(name);
      if (!progress) throw notFound;
      json(res, 200, progress);
      return "GET /api/namn/:namn/framsteg";
    }
    if (path.length === 6 && sub === "ovningar" && method === "PUT") {
      const id = cleanId(rawId);
      if (id === null) throw bad("ogiltigt-id", "Övningens id är inte giltigt.");
      const body = await readJson(req);
      const tid = cleanTime(body.tid);
      if (tid === null) throw bad("ogiltig-tid", "Tiden ska vara ett heltal (millisekunder).");
      const kod = body.kod === undefined ? undefined : cleanCode(body.kod);
      if (kod === null) throw bad("ogiltig-kod", "Koden är för lång (högst 20 kB).");
      if (body.klar !== undefined && typeof body.klar !== "boolean") throw bad("ogiltigt-klar", "klar ska vara sant eller falskt.");
      const saved = store.saveExercise(name, id, { kod, klar: body.klar as boolean | undefined, tid });
      if (!saved) throw notFound;
      json(res, 200, saved);
      return "PUT /api/namn/:namn/ovningar/:id";
    }
    if (path.length === 5 && sub === "senast" && method === "PUT") {
      const lesson = cleanId((await readJson(req)).lektion);
      if (lesson === null) throw bad("ogiltigt-id", "Lektionens id är inte giltigt.");
      if (!store.saveLastLesson(name, lesson)) throw notFound;
      json(res, 204);
      return "PUT /api/namn/:namn/senast";
    }
    const known = (path.length === 5 && (sub === "framsteg" || sub === "senast")) || (path.length === 6 && sub === "ovningar");
    throw known ? new HttpError(405, "metod", "Metoden stöds inte.") : new HttpError(404, "saknas", "Sidan finns inte.");
  }

  async function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string): Promise<string> {
    if (req.method !== "GET" && req.method !== "HEAD") throw new HttpError(405, "metod", "Metoden stöds inte.");
    let rel: string;
    try {
      rel = normalize(decodeURIComponent(pathname));
    } catch {
      throw new HttpError(400, "ogiltig-sokvag", "Sökvägen går inte att läsa.");
    }
    const root = normalize(webDir + sep);
    let file = join(webDir, rel);
    if (!file.startsWith(root) && file !== normalize(webDir)) throw new HttpError(404, "saknas", "Sidan finns inte.");
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = join(file, "index.html");
      info = await stat(file).catch(() => null);
    }
    // Single-page app: unknown paths without a file extension get the start page.
    if (!info && extname(rel) === "") {
      file = join(webDir, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) throw new HttpError(404, "saknas", "Sidan finns inte.");
    // Content-hashed file names (Vite: index-D7mG7dK_.js, or 12 hex digits) never change: cache them for a year.
    const hashed = /-(?=[A-Za-z0-9_-]*[0-9A-Z])[A-Za-z0-9_-]{8,}\.(?:js|mjs|css|wasm|woff2|png|svg)$/.test(file) || /[.-][0-9a-f]{12}\.[a-z0-9]+$/.test(file);
    res.writeHead(200, {
      ...SECURITY_HEADERS,
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      "content-length": info.size,
      "cache-control": hashed ? "public, max-age=31536000, immutable" : "no-cache",
    });
    if (req.method === "HEAD") res.end();
    else createReadStream(file).pipe(res);
    return "static";
  }

  return (req, res) => {
    const started = now();
    const url = new URL(req.url ?? "/", "http://localhost");
    let route = "?";
    const run = async () => {
      if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
        route = await api(req, res, url.pathname.replace(/\/+$/, "").split("/"));
      } else {
        route = await serveStatic(req, res, url.pathname);
      }
    };
    run()
      .catch((err: unknown) => {
        const e = err instanceof HttpError ? err : new HttpError(500, "internt", "Något gick fel hos servern.");
        if (!(err instanceof HttpError)) log(JSON.stringify({ level: "error", fel: String(err) }));
        if (!res.headersSent) json(res, e.status, { fel: e.code, meddelande: e.message });
        else res.destroy();
      })
      .finally(() => {
        log(JSON.stringify({ level: "info", metod: req.method, rutt: route, status: res.statusCode, ms: now() - started }));
      });
  };
}
