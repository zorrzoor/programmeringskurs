// Parses the course content (Markdown with a few special blocks, docs/skriva-lektioner.md) into the types in
// web/src/kurs-typer.ts. Every problem is reported with file and line, so that an invalid block stops the build.
import { parse as parseYaml } from "yaml";
import type { Block, Lektion, Modul, Ratta } from "../../web/src/kurs-typer.ts";

export class ContentError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`${file}:${line}: ${message}`);
  }
}

const SPECIAL = new Set(["python-exempel", "forutsag", "ovning", "ruta"]);
const ID_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const FENCE_RE = /^(`{3,}|~{3,})\s*([^\s`]*)\s*$/;

function yamlOf(text: string, file: string, line: number, what: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = parseYaml(text);
  } catch (err) {
    throw new ContentError(file, line, `${what}: ogiltig YAML (${String(err).split("\n")[0]})`);
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new ContentError(file, line, `${what} ska vara en YAML-post`);
  return value as Record<string, unknown>;
}

function str(o: Record<string, unknown>, key: string, file: string, line: number, what: string, optional = false): string {
  const v = o[key];
  if (v === undefined && optional) return "";
  if (typeof v !== "string" || v.trim() === "") throw new ContentError(file, line, `${what}: "${key}" saknas eller är tomt`);
  return v;
}

function stdinOf(o: Record<string, unknown>, file: string, line: number, what: string): string[] {
  if (o.stdin === undefined) return [];
  if (!Array.isArray(o.stdin) || !o.stdin.every((s) => typeof s === "string")) throw new ContentError(file, line, `${what}: "stdin" ska vara en lista med text`);
  return o.stdin as string[];
}

function rattaOf(raw: unknown, file: string, line: number): Ratta {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) throw new ContentError(file, line, 'ovning: "ratta" ska vara en post');
  const r = raw as Record<string, unknown>;
  const kinds = ["utdata", "variabler", "funktion"].filter((k) => r[k] !== undefined);
  if (kinds.length !== 1) throw new ContentError(file, line, 'ovning: "ratta" ska ha exakt en av utdata, variabler, funktion');
  if (kinds[0] === "utdata") {
    if (typeof r.utdata !== "string") throw new ContentError(file, line, 'ovning: ratta.utdata ska vara text (skriv t.ex. "26000")');
    return { typ: "utdata", forvantat: r.utdata, ignoreraVersaler: r.ignorera_versaler === true };
  }
  if (kinds[0] === "variabler") {
    const v = r.variabler;
    if (v === null || typeof v !== "object" || Array.isArray(v) || Object.keys(v).length === 0) throw new ContentError(file, line, 'ovning: ratta.variabler ska vara en post med minst en variabel');
    return { typ: "variabler", forvantat: v as Record<string, unknown> };
  }
  if (typeof r.funktion !== "string" || !/^[^\W\d]\w*$/u.test(r.funktion)) throw new ContentError(file, line, "ovning: ratta.funktion ska vara ett funktionsnamn");
  const tester = r.tester;
  if (!Array.isArray(tester) || tester.length === 0) throw new ContentError(file, line, 'ovning: ratta.tester ska vara en lista med minst ett test');
  return {
    typ: "funktion",
    namn: r.funktion,
    tester: tester.map((t, i) => {
      if (t === null || typeof t !== "object" || !Array.isArray((t as Record<string, unknown>).in) || !("ut" in (t as object))) {
        throw new ContentError(file, line, `ovning: test ${i + 1} ska ha "in" (lista) och "ut"`);
      }
      return { indata: (t as { in: unknown[] }).in, svar: (t as { ut: unknown }).ut };
    }),
  };
}

function blockOf(kind: string, body: string, file: string, line: number, lessonId: string, counter: { forutsag: number }): Block {
  if (kind === "python-exempel") {
    // The body is plain code. A first line "# stdin: Anna | 7" gives the answers to input().
    const m = /^# stdin: (.*)\n?/.exec(body);
    return { typ: "exempel", kod: (m ? body.slice(m[0].length) : body).replace(/\n+$/, ""), stdin: m ? (m[1] ?? "").split(" | ") : [] };
  }
  const o = yamlOf(body, file, line, kind);
  if (kind === "ruta") return { typ: "ruta", rubrik: str(o, "rubrik", file, line, "ruta"), markdown: str(o, "text", file, line, "ruta") };
  if (kind === "forutsag") {
    counter.forutsag += 1;
    const id = o.id === undefined ? `${lessonId}-f${counter.forutsag}` : String(o.id);
    if (!ID_RE.test(id)) throw new ContentError(file, line, `forutsag: ogiltigt id "${id}"`);
    const kod = str(o, "kod", file, line, "forutsag").replace(/\n+$/, "");
    if (o.kor !== undefined && typeof o.kor !== "boolean") throw new ContentError(file, line, 'forutsag: "kor" ska vara true eller false');
    const kor = o.kor !== false;
    if (o.alternativ !== undefined) {
      const alt = o.alternativ;
      if (!Array.isArray(alt) || alt.length < 2 || !alt.every((a) => typeof a === "string")) throw new ContentError(file, line, 'forutsag: "alternativ" ska vara minst två texter');
      if (!Number.isInteger(o.ratt) || (o.ratt as number) < 0 || (o.ratt as number) >= alt.length) throw new ContentError(file, line, 'forutsag: "ratt" ska vara numret (från 0) på det rätta alternativet');
      return { typ: "forutsag", id, kod, kor, stdin: stdinOf(o, file, line, "forutsag"), alternativ: alt as string[], ratt: o.ratt as number, svar: "", forklaring: str(o, "forklaring", file, line, "forutsag", true) };
    }
    return { typ: "forutsag", id, kod, kor, stdin: stdinOf(o, file, line, "forutsag"), alternativ: [], ratt: -1, svar: str(o, "svar", file, line, "forutsag"), forklaring: str(o, "forklaring", file, line, "forutsag", true) };
  }
  // ovning
  const id = str(o, "id", file, line, "ovning");
  if (!ID_RE.test(id)) throw new ContentError(file, line, `ovning: ogiltigt id "${id}" (små bokstäver, siffror, punkt, bindestreck)`);
  const hints = o.ledtradar;
  if (!Array.isArray(hints) || hints.length !== 3 || !hints.every((h) => typeof h === "string" && h.trim() !== "")) throw new ContentError(file, line, `ovning ${id}: "ledtradar" ska vara exakt tre texter (en knuff, en tydligare, nästan svaret)`);
  return {
    typ: "ovning",
    id,
    uppgift: str(o, "uppgift", file, line, `ovning ${id}`),
    start: typeof o.start === "string" ? o.start.replace(/\n+$/, "") : "",
    stdin: stdinOf(o, file, line, `ovning ${id}`),
    ratta: rattaOf(o.ratta, file, line),
    ledtradar: hints as [string, string, string],
    facit: str(o, "facit", file, line, `ovning ${id}`).replace(/\n+$/, ""),
  };
}

/**
 * How long a lesson takes a beginner, in minutes (rounded up to a multiple of 5, at least 10). Reading is slow when
 * everything is new (100 words a minute); an example is run and changed (2 min), a prediction is thought through
 * (1.5 min) and an exercise takes the longest, with hints and a second try (6 min). Checked against real learners in #27.
 */
export function uppskattaMinuter(block: Block[]): number {
  const ord = (t: string) => t.split(/\s+/).filter(Boolean).length;
  let min = 0;
  for (const b of block) {
    if (b.typ === "text" || b.typ === "ruta") min += ord(b.markdown) / 100;
    else if (b.typ === "exempel") min += 2;
    else if (b.typ === "forutsag") min += 1.5;
    else min += 6 + ord(b.uppgift) / 100;
  }
  return Math.max(10, Math.ceil(min / 5) * 5);
}

/** One lesson file (front matter + Markdown with special blocks). */
export function parseLektion(text: string, file: string, modul: number, nr: number, slug: string): Lektion {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") throw new ContentError(file, 1, 'filen ska börja med front matter ("---")');
  const end = lines.indexOf("---", 1);
  if (end < 0) throw new ContentError(file, 1, "front matter saknar avslutande ---");
  const meta = yamlOf(lines.slice(1, end).join("\n"), file, 2, "front matter");
  const id = `m${modul}-${slug}`;
  const lektion: Lektion = { id, titel: str(meta, "titel", file, 2, "front matter"), mal: str(meta, "mal", file, 2, "front matter"), modul, nr, minuter: 0, block: [] };
  if (meta.tid !== undefined && (!Number.isInteger(meta.tid) || (meta.tid as number) < 5 || (meta.tid as number) > 90)) throw new ContentError(file, 2, 'front matter: "tid" ska vara minuter, ett heltal mellan 5 och 90');

  const counter = { forutsag: 0 };
  let md: string[] = [];
  const flush = () => {
    const markdown = md.join("\n").replace(/^\n+|\n+$/g, "");
    if (markdown) lektion.block.push({ typ: "text", markdown });
    md = [];
  };
  let i = end + 1;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    const fence = FENCE_RE.exec(line);
    if (!fence) {
      md.push(line);
      i += 1;
      continue;
    }
    const marker = fence[1] as string;
    const kind = fence[2] as string;
    const close = new RegExp(`^\\${marker[0]}{${marker.length},}\\s*$`);
    let j = i + 1;
    while (j < lines.length && !close.test(lines[j] ?? "")) j += 1;
    if (j >= lines.length) throw new ContentError(file, i + 1, `kodblocket som börjar här avslutas aldrig`);
    if (SPECIAL.has(kind)) {
      flush();
      lektion.block.push(blockOf(kind, lines.slice(i + 1, j).join("\n"), file, i + 2, id, counter));
    } else {
      md.push(...lines.slice(i, j + 1));
    }
    i = j + 1;
  }
  flush();
  lektion.minuter = typeof meta.tid === "number" ? meta.tid : uppskattaMinuter(lektion.block);
  if (!lektion.block.some((b) => b.typ !== "text")) throw new ContentError(file, end + 2, "lektionen har inget exempel, ingen förutsägelse och ingen övning");
  return lektion;
}

/** modul.yml of a module directory. */
export function parseModul(text: string, file: string, id: number): Omit<Modul, "lektioner"> {
  const o = yamlOf(text, file, 1, "modul.yml");
  return { id, titel: str(o, "titel", file, 1, "modul.yml"), beskrivning: str(o, "beskrivning", file, 1, "modul.yml"), kopplas: str(o, "kopplas", file, 1, "modul.yml", true) };
}

/** Course-wide rules: every exercise and prediction id is unique. */
export function kontrolleraKurs(moduler: Modul[]): void {
  const seen = new Map<string, string>();
  for (const m of moduler) {
    for (const l of m.lektioner) {
      for (const b of l.block) {
        if (b.typ !== "ovning" && b.typ !== "forutsag") continue;
        const where = seen.get(b.id);
        if (where) throw new Error(`id "${b.id}" finns både i ${where} och i ${l.id}`);
        seen.set(b.id, l.id);
      }
    }
  }
}
