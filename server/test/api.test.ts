import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { createHandler } from "../app.ts";
import { readConfig, type Config } from "../config.ts";
import { Store } from "../db.ts";

let dir: string;
let server: Server;
let base: string;
let clock = 1_000_000;
let logs: string[] = [];

function start(dbPath: string, writesPerMinute = 300, config?: Partial<Config>): Server {
  const store = new Store(dbPath);
  const s = createServer(createHandler({ store, config, webDir: join(dir, "web"), writesPerMinute, now: () => clock, log: (l) => logs.push(l) }));
  s.on("close", () => store.close());
  return s;
}

async function listen(s: Server): Promise<string> {
  await new Promise<void>((resolve) => s.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(s.address() as { port: number }).port}`;
}

const call = async (method: string, path: string, body?: unknown, raw?: string) => {
  const res = await fetch(base + path, { method, body: raw ?? (body === undefined ? undefined : JSON.stringify(body)) });
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text && res.headers.get("content-type")?.includes("json") ? JSON.parse(text) : text };
};

before(async () => {
  dir = mkdtempSync(join(tmpdir(), "kurs-"));
  mkdirSync(join(dir, "web", "assets"), { recursive: true });
  writeFileSync(join(dir, "web", "index.html"), "<h1>Kurs</h1>");
  writeFileSync(join(dir, "web", "assets", "app-0123456789ab.js"), "console.log(1)");
  writeFileSync(join(dir, "web", "assets", "index-D7mG7dK_.js"), "console.log(2)");
  writeFileSync(join(dir, "web", "assets", "vendor-component.js"), "console.log(3)");
  writeFileSync(join(dir, "secret.txt"), "not served");
  server = start(":memory:");
  base = await listen(server);
});
after(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

describe("names", () => {
  test("health check", async () => {
    const r = await call("GET", "/api/halsa");
    assert.deepEqual([r.status, r.body], [200, { ok: true }]);
  });

  test("create, list sorted, reject duplicates regardless of case", async () => {
    assert.equal((await call("POST", "/api/namn", { namn: "Bosse" })).status, 201);
    assert.equal((await call("POST", "/api/namn", { namn: "  Åsa   Lena " })).body.namn, "Åsa Lena");
    assert.equal((await call("POST", "/api/namn", { namn: "anna" })).status, 201);
    const dup = await call("POST", "/api/namn", { namn: "BOSSE" });
    assert.deepEqual([dup.status, dup.body.fel], [409, "namnet-finns"]);
    // Sorted case-insensitively, å after z.
    assert.deepEqual((await call("GET", "/api/namn")).body.namn, ["anna", "Bosse", "Åsa Lena"]);
  });

  test("invalid names are refused", async () => {
    for (const namn of ["", "   ", "a".repeat(31), "<script>", "../x", "Anna/Bo", "a;b", 5, null, "-Anna"]) {
      const r = await call("POST", "/api/namn", { namn });
      assert.deepEqual([r.status, r.body.fel], [422, "ogiltigt-namn"], JSON.stringify(namn));
    }
  });

  test("bad JSON and big bodies", async () => {
    assert.equal((await call("POST", "/api/namn", undefined, "{not json")).status, 400);
    assert.equal((await call("POST", "/api/namn", undefined, "[1]")).status, 400);
    assert.equal((await call("POST", "/api/namn", { namn: "x", fyll: "y".repeat(70_000) })).status, 413);
  });

  test("names with å, ä, ö and spaces round-trip through the URL", async () => {
    await call("POST", "/api/namn", { namn: "Märta Öberg" });
    const r = await call("GET", `/api/namn/${encodeURIComponent("märta öberg")}/framsteg`);
    assert.deepEqual([r.status, r.body.namn], [200, "Märta Öberg"]);
  });
});

describe("progress", () => {
  before(async () => {
    await call("POST", "/api/namn", { namn: "Fia" });
  });

  test("a new name has no progress", async () => {
    assert.deepEqual((await call("GET", "/api/namn/Fia/framsteg")).body, { namn: "Fia", senast: null, ovningar: {} });
    assert.equal((await call("GET", "/api/namn/Okand/framsteg")).status, 404);
  });

  test("save an exercise and read it back", async () => {
    const put = await call("PUT", "/api/namn/Fia/ovningar/m2.l3.o1", { kod: "x = 1", klar: false, tid: 100 });
    assert.deepEqual([put.status, put.body], [200, { kod: "x = 1", klar: false, tid: 100 }]);
    assert.deepEqual((await call("GET", "/api/namn/Fia/framsteg")).body.ovningar["m2.l3.o1"], { kod: "x = 1", klar: false, tid: 100 });
  });

  test("the latest save wins for the code", async () => {
    await call("PUT", "/api/namn/Fia/ovningar/o2", { kod: "ny", tid: 200 });
    const old = await call("PUT", "/api/namn/Fia/ovningar/o2", { kod: "gammal", tid: 150 });
    assert.deepEqual(old.body, { kod: "ny", klar: false, tid: 200 });
    assert.equal((await call("PUT", "/api/namn/Fia/ovningar/o2", { kod: "nyare", tid: 300 })).body.kod, "nyare");
  });

  test("done is only added, never removed", async () => {
    await call("PUT", "/api/namn/Fia/ovningar/o3", { kod: "a", klar: true, tid: 100 });
    const r = await call("PUT", "/api/namn/Fia/ovningar/o3", { kod: "b", klar: false, tid: 500 });
    assert.deepEqual(r.body, { kod: "b", klar: true, tid: 500 });
    const older = await call("PUT", "/api/namn/Fia/ovningar/o3", { klar: false, tid: 1 });
    assert.equal(older.body.klar, true);
  });

  test("done without code on a new exercise", async () => {
    assert.deepEqual((await call("PUT", "/api/namn/Fia/ovningar/o4", { klar: true, tid: 7 })).body, { kod: "", klar: true, tid: 7 });
  });

  test("validation of exercise saves", async () => {
    const bad: [unknown, string][] = [
      [{ kod: "x" }, "ogiltig-tid"],
      [{ kod: "x", tid: -1 }, "ogiltig-tid"],
      [{ kod: "x", tid: 1.5 }, "ogiltig-tid"],
      [{ kod: 5, tid: 1 }, "ogiltig-kod"],
      [{ kod: "å".repeat(11_000), tid: 1 }, "ogiltig-kod"],
      [{ klar: "ja", tid: 1 }, "ogiltigt-klar"],
    ];
    for (const [body, fel] of bad) assert.equal((await call("PUT", "/api/namn/Fia/ovningar/o5", body)).body.fel, fel, JSON.stringify(body).slice(0, 40));
    assert.equal((await call("PUT", "/api/namn/Fia/ovningar/Stor", { tid: 1 })).body.fel, "ogiltigt-id");
    assert.equal((await call("PUT", "/api/namn/Fia/ovningar/..%2Fx", { tid: 1 })).body.fel, "ogiltigt-id");
    assert.equal((await call("PUT", "/api/namn/Okand/ovningar/o1", { tid: 1 })).status, 404);
  });

  test("last lesson", async () => {
    assert.equal((await call("PUT", "/api/namn/Fia/senast", { lektion: "m2.l3" })).status, 204);
    assert.equal((await call("GET", "/api/namn/Fia/framsteg")).body.senast, "m2.l3");
    assert.equal((await call("PUT", "/api/namn/Fia/senast", { lektion: "Bad id" })).status, 422);
  });

  test("deleting a name removes all its progress, and only that name's", async () => {
    await call("POST", "/api/namn", { namn: "Gus" });
    await call("PUT", "/api/namn/Gus/ovningar/o1", { kod: "g", tid: 1 });
    assert.equal((await call("DELETE", "/api/namn/Fia")).status, 204);
    assert.equal((await call("GET", "/api/namn/Fia/framsteg")).status, 404);
    assert.equal((await call("DELETE", "/api/namn/Fia")).status, 404);
    assert.equal((await call("GET", "/api/namn/Gus/framsteg")).body.ovningar.o1.kod, "g");
    // A new person with the same name starts from zero.
    await call("POST", "/api/namn", { namn: "Fia" });
    assert.deepEqual((await call("GET", "/api/namn/Fia/framsteg")).body.ovningar, {});
  });
});

describe("limits", () => {
  test("at most 50 names", async () => {
    const s = start(":memory:");
    const url = await listen(s);
    for (let i = 0; i < 50; i++) assert.equal((await fetch(`${url}/api/namn`, { method: "POST", body: JSON.stringify({ namn: `Person ${i}` }) })).status, 201);
    const r = await fetch(`${url}/api/namn`, { method: "POST", body: JSON.stringify({ namn: "En till" }) });
    assert.deepEqual([r.status, (await r.json()).fel], [409, "for-manga-namn"]);
    s.close();
  });

  test("the name limit is configurable", async () => {
    const s = start(":memory:", 300, { maxNames: 2 });
    const url = await listen(s);
    const post = (n: string) => fetch(`${url}/api/namn`, { method: "POST", body: JSON.stringify({ namn: n }) }).then((r) => r.status);
    assert.deepEqual([await post("A"), await post("B"), await post("C")], [201, 201, 409]);
    s.close();
  });

  test("writes are rate limited per minute, reads are not", async () => {
    const s = start(":memory:", 3);
    const url = await listen(s);
    const post = (n: number) => fetch(`${url}/api/namn`, { method: "POST", body: JSON.stringify({ namn: `P${n}` }) }).then((r) => r.status);
    assert.deepEqual([await post(1), await post(2), await post(3), await post(4)], [201, 201, 201, 429]);
    for (let i = 0; i < 10; i++) assert.equal((await fetch(`${url}/api/namn`)).status, 200);
    clock += 61_000;
    assert.equal(await post(5), 201);
    s.close();
  });
});

describe("persistence", () => {
  test("data survives a restart", async () => {
    const file = join(dir, "data", "kurs.db");
    let s = start(file);
    let url = await listen(s);
    await fetch(`${url}/api/namn`, { method: "POST", body: JSON.stringify({ namn: "Kvar" }) });
    await fetch(`${url}/api/namn/Kvar/ovningar/o1`, { method: "PUT", body: JSON.stringify({ kod: "k", klar: true, tid: 5 }) });
    await new Promise((r) => s.close(r));
    s = start(file);
    url = await listen(s);
    assert.deepEqual((await (await fetch(`${url}/api/namn/Kvar/framsteg`)).json()).ovningar.o1, { kod: "k", klar: true, tid: 5 });
    s.close();
  });
});

describe("backup", () => {
  test("a consistent copy opens as a database with the same content; only the newest are kept", async () => {
    const { DatabaseSync } = await import("node:sqlite");
    const store = new Store(join(dir, "live", "kurs.db"));
    store.addName("Bak");
    store.saveExercise("Bak", "o1", { kod: "k", klar: true, tid: 9 });
    const backups = join(dir, "backups");
    for (const day of ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]) store.backup(backups, day, 3);
    const { readdirSync } = await import("node:fs");
    assert.deepEqual(readdirSync(backups).sort(), ["kurs-2026-10-02.db", "kurs-2026-10-03.db", "kurs-2026-10-04.db"]);
    store.removeName("Bak"); // the live database changes, the copy does not
    const copy = new DatabaseSync(join(backups, "kurs-2026-10-04.db"), { readOnly: true });
    assert.equal(copy.prepare("SELECT code FROM exercises").get()?.code, "k");
    copy.close();
    store.backup(backups, "2026-10-04", 3); // same day again: replaced, not an error
    assert.equal(readdirSync(backups).length, 3);
    store.close();
  });
});

describe("static files and headers", () => {
  test("the start page, with security headers", async () => {
    const r = await call("GET", "/");
    assert.equal(r.status, 200);
    assert.equal(r.body, "<h1>Kurs</h1>");
    assert.match(r.headers.get("content-security-policy") ?? "", /default-src 'self'/);
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
    assert.equal(r.headers.get("cache-control"), "no-cache");
  });

  test("files have an ETag and answer 304 when unchanged; every page is cross-origin isolated", async () => {
    const r = await call("GET", "/");
    const etag = r.headers.get("etag") ?? "";
    assert.match(etag, /^W\/"[0-9a-f]+-[0-9a-f]+"$/);
    assert.equal(r.headers.get("cross-origin-embedder-policy"), "require-corp");
    assert.equal(r.headers.get("cross-origin-opener-policy"), "same-origin");
    const again = await fetch(base + "/", { headers: { "if-none-match": etag } });
    assert.equal(again.status, 304);
    assert.equal(await again.text(), "");
    assert.equal((await fetch(base + "/", { headers: { "if-none-match": 'W/"0-0"' } })).status, 200);
  });

  test("hashed assets are cached for a long time", async () => {
    const r = await call("GET", "/assets/app-0123456789ab.js");
    assert.equal(r.headers.get("content-type"), "text/javascript; charset=utf-8");
    assert.match(r.headers.get("cache-control") ?? "", /immutable/);
  });

  test("Vite-style hashed names are immutable, plain names are not", async () => {
    assert.match((await call("GET", "/assets/index-D7mG7dK_.js")).headers.get("cache-control") ?? "", /immutable/);
    assert.equal((await call("GET", "/assets/vendor-component.js")).headers.get("cache-control"), "no-cache");
  });

  test("unknown paths without extension get the start page, missing files are 404", async () => {
    assert.equal((await call("GET", "/lektion/2/3")).body, "<h1>Kurs</h1>");
    assert.equal((await call("GET", "/saknas.js")).status, 404);
  });

  test("path traversal is not possible", async () => {
    for (const p of ["/..%2fsecret.txt", "/%2e%2e/secret.txt", "/assets/../../secret.txt", "/%2e%2e%2fsecret.txt", "/..%5csecret.txt"]) {
      const r = await call("GET", p);
      assert.notEqual(r.body, "not served", p);
    }
    assert.equal((await call("GET", "/%zz")).status, 400);
  });

  test("unknown API paths and methods", async () => {
    assert.equal((await call("GET", "/api/finns-inte")).status, 404);
    assert.equal((await call("PATCH", "/api/namn")).status, 405);
    assert.equal((await call("GET", "/api/namn/Anna/nagot")).status, 404);
    assert.equal((await call("POST", "/api/namn/Anna/framsteg")).status, 405);
    assert.equal((await call("POST", "/api/halsa")).status, 405);
    assert.equal((await call("PUT", "/")).status, 405);
  });

  test("logs one line per request and never the name", async () => {
    logs = [];
    await call("POST", "/api/namn", { namn: "Hemlig Person" });
    await call("GET", "/api/namn/Hemlig%20Person/framsteg");
    assert.equal(logs.length, 2);
    assert.ok(logs.every((l) => !l.includes("Hemlig")), logs.join("\n"));
    assert.deepEqual(JSON.parse(logs[1] ?? "{}").rutt, "GET /api/namn/:namn/framsteg");
  });
});

describe("instance mode", () => {
  test("/api/config tells the client the mode (private by default)", async () => {
    const r = await call("GET", "/api/config");
    assert.deepEqual([r.status, r.body], [200, { lage: "privat", maxNamn: 50 }]);
    assert.equal((await call("POST", "/api/config", {})).status, 405);
  });

  test("a public instance says so, with its own name limit", async () => {
    const s = start(":memory:", 300, { lage: "publik", maxNames: 2000 });
    const url = await listen(s);
    assert.deepEqual(await (await fetch(`${url}/api/config`)).json(), { lage: "publik", maxNamn: 2000 });
    s.close();
  });

  test("readConfig: defaults, values and invalid input", () => {
    assert.deepEqual(readConfig({}), { lage: "privat", maxNames: 50, writesPerMinute: 300 });
    assert.deepEqual(readConfig({ KURS_LAGE: "publik", MAX_NAMES: "2000", WRITES_PER_MINUTE: "1500" }), { lage: "publik", maxNames: 2000, writesPerMinute: 1500 });
    assert.throws(() => readConfig({ KURS_LAGE: "offentlig" }), /KURS_LAGE/);
    assert.throws(() => readConfig({ MAX_NAMES: "0" }), /MAX_NAMES/);
    assert.throws(() => readConfig({ WRITES_PER_MINUTE: "många" }), /WRITES_PER_MINUTE/);
  });
});
