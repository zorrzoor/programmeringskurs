import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { createHandler } from "../app.ts";
import { readConfig, type Config } from "../config.ts";
import { DatabaseSync } from "node:sqlite";
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
    assert.deepEqual(readConfig({}), { lage: "privat", maxNames: 50, writesPerMinute: 300, newNamesPerIpPerDay: 0, newNamesPerHour: 0, unusedNameHours: 0, namesClosed: false });
    assert.deepEqual(readConfig({ KURS_LAGE: "publik", MAX_NAMES: "2000", WRITES_PER_MINUTE: "1500", NEW_NAMES_PER_IP_PER_DAY: "15", NEW_NAMES_PER_HOUR: "200", UNUSED_NAME_HOURS: "24", NAMES_CLOSED: "1" }), {
      lage: "publik",
      maxNames: 2000,
      writesPerMinute: 1500,
      newNamesPerIpPerDay: 15,
      newNamesPerHour: 200,
      unusedNameHours: 24,
      namesClosed: true,
    });
    assert.throws(() => readConfig({ NEW_NAMES_PER_HOUR: "-1" }), /NEW_NAMES_PER_HOUR/);
    assert.throws(() => readConfig({ KURS_LAGE: "offentlig" }), /KURS_LAGE/);
    assert.throws(() => readConfig({ MAX_NAMES: "0" }), /MAX_NAMES/);
    assert.throws(() => readConfig({ WRITES_PER_MINUTE: "många" }), /WRITES_PER_MINUTE/);
  });
});

describe("public instance: a code per name", () => {
  let s: Server;
  let url: string;
  const req = (method: string, path: string, body?: unknown, kod?: string) =>
    fetch(url + path, { method, headers: kod === undefined ? {} : { "x-kod": kod }, body: body === undefined ? undefined : JSON.stringify(body) });

  before(async () => {
    s = start(":memory:", 300, { lage: "publik", maxNames: 2000 });
    url = await listen(s);
  });
  after(() => s.close());

  test("creating a name returns a code once; it opens the name", async () => {
    const r = await req("POST", "/api/namn", { namn: "Nora" });
    const { namn, kod } = await r.json();
    assert.deepEqual([r.status, namn], [201, "Nora"]);
    assert.match(kod, /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
    assert.equal((await req("GET", "/api/namn/Nora/framsteg", undefined, kod)).status, 200);
    // lower case and without hyphens is the same code
    assert.equal((await req("GET", "/api/namn/Nora/framsteg", undefined, kod.toLowerCase().replaceAll("-", ""))).status, 200);
  });

  test("without the code, or with a wrong one, nothing can be read, written or removed", async () => {
    const { kod } = await (await req("POST", "/api/namn", { namn: "Olof" })).json();
    const wrong = kod.startsWith("A") ? "BBBB-BBBB-BBBB" : "AAAA-AAAA-AAAA";
    for (const k of [undefined, "", "skräp", wrong]) {
      for (const [m, p, b] of [
        ["GET", "/api/namn/Olof/framsteg", undefined],
        ["PUT", "/api/namn/Olof/ovningar/o1", { kod: "x", tid: 1 }],
        ["PUT", "/api/namn/Olof/senast", { lektion: "l1" }],
        ["DELETE", "/api/namn/Olof", undefined],
      ] as const) {
        const r = await req(m, p, b, k);
        assert.deepEqual([r.status, (await r.json()).fel], [403, "fel-kod"], `${m} ${p} with ${String(k)}`);
      }
    }
    // the name is still there, with the right code
    assert.equal((await req("GET", "/api/namn/Olof/framsteg", undefined, kod)).status, 200);
    assert.equal((await req("DELETE", "/api/namn/Olof", undefined, kod)).status, 204);
    assert.equal((await req("GET", "/api/namn/Olof/framsteg", undefined, kod)).status, 404);
  });

  test("another person's code does not open this name", async () => {
    const a = await (await req("POST", "/api/namn", { namn: "Qasim" })).json();
    const b = await (await req("POST", "/api/namn", { namn: "Rut" })).json();
    assert.equal((await req("GET", "/api/namn/Qasim/framsteg", undefined, b.kod)).status, 403);
    assert.equal((await req("GET", "/api/namn/Qasim/framsteg", undefined, a.kod)).status, 200);
  });

  test("the list is a search with a limited number of hits", async () => {
    for (let i = 0; i < 60; i++) await req("POST", "/api/namn", { namn: `Sökbar ${String(i).padStart(2, "0")}` });
    const all = await (await req("GET", "/api/namn?q=sökbar")).json();
    assert.deepEqual([all.namn.length, all.totalt, all.namn[0]], [50, 60, "Sökbar 00"]);
    const one = await (await req("GET", "/api/namn?q=SÖKBAR%2059")).json();
    assert.deepEqual(one, { namn: ["Sökbar 59"], totalt: 1 });
    assert.deepEqual(await (await req("GET", "/api/namn?q=%25")).json(), { namn: [], totalt: 0 }); // % is not a wildcard
    assert.ok((await (await req("GET", "/api/namn")).json()).namn.length <= 50);
  });

  test("a name without a code (made before codes existed) cannot be opened", async () => {
    const store = new Store(":memory:");
    store.addName("Gammal");
    assert.equal(store.checkCode("Gammal", "AAAAAAAAAAAA"), "denied");
    assert.equal(store.checkCode("Finns inte", "AAAAAAAAAAAA"), "unknown");
    store.close();
  });

  test("the private instance is unchanged: no code, whole list", async () => {
    const r = await call("POST", "/api/namn", { namn: "Privat Pia" });
    assert.deepEqual(r.body, { namn: "Privat Pia" });
    assert.equal((await call("GET", "/api/namn/Privat%20Pia/framsteg")).status, 200);
  });
});

describe("abuse protection for new names", () => {
  const post = (url: string, namn: string, ip?: string) =>
    fetch(`${url}/api/namn`, { method: "POST", headers: ip ? { "cf-connecting-ip": ip } : {}, body: JSON.stringify({ namn }) });
  const limited = async (config: Partial<Config>) => {
    logs = [];
    const s = start(":memory:", 10_000, { lage: "publik", maxNames: 2000, ...config });
    return { s, url: await listen(s) };
  };

  test("a limit per client and day: others are not affected, and it passes after a day", async () => {
    const { s, url } = await limited({ newNamesPerIpPerDay: 2 });
    assert.deepEqual([await post(url, "A1", "1.1.1.1"), await post(url, "A2", "1.1.1.1")].map((r) => r.status), [201, 201]);
    const third = await post(url, "A3", "1.1.1.1");
    assert.deepEqual([third.status, (await third.json()).fel], [429, "for-manga-nya-namn"]);
    assert.equal((await post(url, "B1", "2.2.2.2")).status, 201);
    clock += 24 * 3600_000 + 1;
    assert.equal((await post(url, "A3", "1.1.1.1")).status, 201);
    s.close();
  });

  test("a refused name is not counted, and the refusal is logged without any address", async () => {
    const { s, url } = await limited({ newNamesPerIpPerDay: 1 });
    assert.equal((await post(url, "C1", "3.3.3.3")).status, 201);
    assert.equal((await post(url, "C1", "3.3.3.3")).status, 429); // limit first
    const log = logs.join("\n");
    assert.match(log, /"handelse":"namngrans","orsak":"ip"/);
    assert.ok(!log.includes("3.3.3.3"));
    s.close();
  });

  test("a total per hour, all clients together", async () => {
    const { s, url } = await limited({ newNamesPerHour: 3 });
    const codes = [];
    for (let i = 0; i < 4; i++) codes.push((await post(url, `H${i}`, `9.9.9.${i}`)).status);
    assert.deepEqual(codes, [201, 201, 201, 429]);
    assert.match(logs.join("\n"), /"orsak":"timme"/);
    clock += 3600_000 + 1;
    assert.equal((await post(url, "H9", "9.9.9.9")).status, 201);
    s.close();
  });

  test("the owner can close new names", async () => {
    const { s, url } = await limited({ namesClosed: true });
    const r = await post(url, "Stängd");
    assert.deepEqual([r.status, (await r.json()).fel], [503, "namn-stangda"]);
    s.close();
  });

  test("without limits (the private instance) nothing is refused", async () => {
    const { s, url } = await limited({ lage: "privat" });
    for (let i = 0; i < 20; i++) assert.equal((await post(url, `P${i}`, "4.4.4.4")).status, 201);
    s.close();
  });

  test("names nobody used are removed after a while; names with work or a visited lesson stay", () => {
    const store = new Store(":memory:");
    for (const n of ["Tom", "Arbetat", "Besökt", "Ny"]) store.addName(n, 100, null, 1_000);
    store.addName("Sen", 100, null, 9_000);
    store.saveExercise("Arbetat", "o1", { kod: "x", tid: 1 });
    store.saveLastLesson("Besökt", "l1");
    assert.equal(store.removeUnused(5_000), 2); // Tom, Ny
    assert.deepEqual(store.names().sort(), ["Arbetat", "Besökt", "Sen"]);
    assert.equal(store.removeUnused(5_000), 0);
    store.close();
  });

  test("names made before created_at existed get a grace period", () => {
    const dir2 = mkdtempSync(join(tmpdir(), "kurs-mig-"));
    const path = join(dir2, "old.db");
    const old = new DatabaseSync(path);
    old.exec("CREATE TABLE people (id INTEGER PRIMARY KEY, name TEXT NOT NULL, key TEXT NOT NULL UNIQUE, last_lesson TEXT); INSERT INTO people (name, key) VALUES ('Gammal', 'gammal');");
    old.close();
    const store = new Store(path);
    assert.equal(store.removeUnused(Date.now() - 3600_000), 0); // made "now" by the migration, not an hour ago
    assert.deepEqual(store.names(), ["Gammal"]);
    store.close();
    rmSync(dir2, { recursive: true, force: true });
  });
});
