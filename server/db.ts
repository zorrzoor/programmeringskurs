// SQLite storage for names and progress. One file, opened once; every statement is prepared.
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { DEFAULT_MAX_NAMES } from "./config.ts";
import { hashCode, nameKey, sameHash } from "./validate.ts";

export interface Exercise {
  kod: string;
  klar: boolean;
  tid: number;
}

export interface Progress {
  namn: string;
  senast: string | null;
  ovningar: Record<string, Exercise>;
}

export class Store {
  private readonly db: DatabaseSync;

  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        key TEXT NOT NULL UNIQUE,
        last_lesson TEXT
      );
      CREATE TABLE IF NOT EXISTS exercises (
        person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
        exercise_id TEXT NOT NULL,
        code TEXT NOT NULL,
        done INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (person_id, exercise_id)
      );
    `);
    // The public instance protects a name with a code (only its hash is stored). Added to databases made before it existed.
    const columns = this.db.prepare("PRAGMA table_info(people)").all().map((r) => String(r.name));
    if (!columns.includes("code_hash")) this.db.exec("ALTER TABLE people ADD COLUMN code_hash TEXT");
  }

  close(): void {
    this.db.close();
  }

  /**
   * Writes a consistent copy of the whole database to dir/kurs-<stamp>.db (SQLite VACUUM INTO: safe while
   * the server is running) and keeps only the newest `keep` copies. Returns the file written.
   */
  backup(dir: string, stamp: string, keep: number): string {
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `kurs-${stamp}.db`);
    rmSync(file, { force: true });
    this.db.prepare("VACUUM INTO ?").run(file);
    const old = readdirSync(dir).filter((f) => /^kurs-[\w-]+\.db$/.test(f)).sort().reverse().slice(keep);
    for (const f of old) rmSync(join(dir, f), { force: true });
    return file;
  }

  names(): string[] {
    return this.db.prepare("SELECT name FROM people ORDER BY key").all().map((r) => String(r.name));
  }

  /** Names containing `query` (any capitals), at most `limit`, and how many match in all. */
  searchNames(query: string, limit: number): { namn: string[]; totalt: number } {
    const pattern = `%${nameKey(query).replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const totalt = Number(this.db.prepare("SELECT count(*) AS n FROM people WHERE key LIKE ? ESCAPE '\\'").get(pattern)?.n);
    const rows = this.db.prepare("SELECT name FROM people WHERE key LIKE ? ESCAPE '\\' ORDER BY key LIMIT ?").all(pattern, limit);
    return { namn: rows.map((r) => String(r.name)), totalt };
  }

  /** "ok", "unknown" (no such name) or "denied" (wrong code, or the name has none). */
  checkCode(name: string, code: string | null): "ok" | "unknown" | "denied" {
    const row = this.db.prepare("SELECT code_hash FROM people WHERE key = ?").get(nameKey(name));
    if (!row) return "unknown";
    if (code === null || row.code_hash === null || row.code_hash === undefined) return "denied";
    return sameHash(String(row.code_hash), hashCode(code)) ? "ok" : "denied";
  }

  /** "created", "exists" or "full". */
  addName(name: string, maxNames = DEFAULT_MAX_NAMES, codeHash: string | null = null): "created" | "exists" | "full" {
    const count = Number(this.db.prepare("SELECT count(*) AS n FROM people").get()?.n);
    if (this.personId(name) !== null) return "exists";
    if (count >= maxNames) return "full";
    this.db.prepare("INSERT INTO people (name, key, code_hash) VALUES (?, ?, ?)").run(name, nameKey(name), codeHash);
    return "created";
  }

  /** Removes the name and all its progress. False when there was no such name. */
  removeName(name: string): boolean {
    return Number(this.db.prepare("DELETE FROM people WHERE key = ?").run(nameKey(name)).changes) > 0;
  }

  progress(name: string): Progress | null {
    const person = this.db.prepare("SELECT id, name, last_lesson FROM people WHERE key = ?").get(nameKey(name));
    if (!person) return null;
    const rows = this.db
      .prepare("SELECT exercise_id, code, done, updated_at FROM exercises WHERE person_id = ?")
      .all(person.id as number);
    const ovningar: Record<string, Exercise> = {};
    for (const r of rows) ovningar[String(r.exercise_id)] = { kod: String(r.code), klar: r.done === 1, tid: Number(r.updated_at) };
    return { namn: String(person.name), senast: person.last_lesson === null ? null : String(person.last_lesson), ovningar };
  }

  /**
   * Saves one exercise. The latest save wins for the code; "done" is only ever added (an older
   * device must not make a finished exercise unfinished). Returns the stored state, or null
   * when there is no such name.
   */
  saveExercise(name: string, id: string, update: { kod?: string; klar?: boolean; tid: number }): Exercise | null {
    const personId = this.personId(name);
    if (personId === null) return null;
    const old = this.db
      .prepare("SELECT code, done, updated_at FROM exercises WHERE person_id = ? AND exercise_id = ?")
      .get(personId, id);
    const newer = !old || update.tid >= Number(old.updated_at);
    const code = update.kod !== undefined && newer ? update.kod : old ? String(old.code) : (update.kod ?? "");
    const done = Boolean(old?.done) || update.klar === true;
    const time = old ? Math.max(Number(old.updated_at), update.tid) : update.tid;
    this.db
      .prepare(
        `INSERT INTO exercises (person_id, exercise_id, code, done, updated_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (person_id, exercise_id) DO UPDATE SET code = excluded.code, done = excluded.done, updated_at = excluded.updated_at`,
      )
      .run(personId, id, code, done ? 1 : 0, time);
    return { kod: code, klar: done, tid: time };
  }

  saveLastLesson(name: string, lesson: string): boolean {
    return Number(this.db.prepare("UPDATE people SET last_lesson = ? WHERE key = ?").run(lesson, nameKey(name)).changes) > 0;
  }

  private personId(name: string): number | null {
    const row = this.db.prepare("SELECT id FROM people WHERE key = ?").get(nameKey(name));
    return row ? Number(row.id) : null;
  }
}
