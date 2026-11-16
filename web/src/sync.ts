// Progress for one name, saved to the server as it changes. A change is first kept in memory and in the
// browser (so nothing is lost without a network), then sent. When the server cannot be reached the
// changes stay queued and are sent again later (timer and the browser's "online" event).
import { Api, ApiError, type Exercise, type Progress } from "./api.ts";

/**
 * "fel": a temporary error, sent again later. "avvisad": the server refused an exercise for good (e.g. code over 20 kB);
 * it is skipped so the rest is saved (#194). "namn-borta": the name is gone or the code does not fit; saving stops.
 */
export type SaveStatus = "sparat" | "sparas" | "offline" | "fel" | "avvisad" | "namn-borta";

/** How an error from the server is handled (#194). */
export function errorKind(err: unknown): "tillfalligt" | "ovning" | "namn" {
  if (!(err instanceof ApiError) || err.offline || err.status >= 500 || err.status === 429) return "tillfalligt";
  if (err.status === 403 || (err.status === 404 && err.code === "okant-namn")) return "namn";
  return "ovning";
}

interface Pending {
  kod?: string;
  klar?: boolean;
  tid: number;
}

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SyncOptions {
  delayMs?: number;
  retryMs?: number;
  now?: () => number;
  storage?: Storage;
  onStatus?: (status: SaveStatus) => void;
  /** The name is gone (404) or the code no longer fits (403): saving has stopped. */
  onNameLost?: (err: ApiError) => void;
}

export class ProgressSync {
  readonly name: string;
  private readonly api: Api;
  private readonly opts: Required<Omit<SyncOptions, "storage">> & { storage: Storage | null };
  private progress: Progress;
  private queue: Record<string, Pending> = {};
  private lastLesson: string | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private sending = false;
  status: SaveStatus = "sparat";
  /** Why the last refused exercise could not be saved (status "avvisad"). */
  refused: string | null = null;
  private lost = false;

  constructor(api: Api, name: string, opts: SyncOptions = {}) {
    this.api = api;
    this.name = name;
    this.opts = {
      delayMs: opts.delayMs ?? 800,
      retryMs: opts.retryMs ?? 15_000,
      now: opts.now ?? Date.now,
      storage: opts.storage ?? safeStorage(),
      onStatus: opts.onStatus ?? (() => {}),
      onNameLost: opts.onNameLost ?? (() => {}),
    };
    this.progress = { namn: name, senast: null, ovningar: {} };
  }

  private get key(): string {
    return `kurs.ko.${this.name}`;
  }

  /** Loads the progress from the server and merges what was queued while the server was out of reach. */
  async load(): Promise<Progress> {
    this.restoreQueue();
    try {
      this.progress = await this.api.getProgress(this.name);
    } catch (err) {
      if (!(err instanceof ApiError) || !err.offline) throw err;
      this.setStatus("offline"); // keep working on what is queued
    }
    for (const [id, p] of Object.entries(this.queue)) this.apply(id, p);
    if (this.lastLesson) this.progress.senast = this.lastLesson;
    if (this.hasPending()) this.schedule();
    return this.progress;
  }

  get current(): Progress {
    return this.progress;
  }

  exercise(id: string): Exercise | undefined {
    return this.progress.ovningar[id];
  }

  save(id: string, change: { kod?: string; klar?: boolean }): void {
    const p: Pending = { ...this.queue[id], ...change, tid: this.opts.now() };
    this.queue[id] = p;
    this.apply(id, p);
    this.persistQueue();
    this.schedule();
  }

  setLastLesson(lesson: string): void {
    this.lastLesson = lesson;
    this.progress.senast = lesson;
    this.persistQueue();
    this.schedule();
  }

  /** Sends everything now (also used by tests and before the page is closed). */
  async flush(): Promise<void> {
    if (this.sending || this.lost) return;
    this.sending = true;
    clearTimeout(this.timer);
    let refused = false;
    try {
      for (const [id, p] of Object.entries(this.queue)) {
        try {
          const saved = await this.api.saveExercise(this.name, id, p);
          this.progress.ovningar[id] = saved;
        } catch (err) {
          if (errorKind(err) !== "ovning") throw err;
          // Refused for good (too long, too many exercises …): sending it again would fail the same way and hold up the
          // rest of the queue. It stays in the editor; the learner is told why.
          refused = true;
          this.refused = (err as ApiError).message;
        }
        if (this.queue[id] === p) delete this.queue[id]; // not changed again while it was being sent
      }
      if (this.lastLesson) {
        await this.api.saveLastLesson(this.name, this.lastLesson);
        this.lastLesson = null;
      }
      this.persistQueue();
      this.setStatus(this.hasPending() ? "sparas" : refused ? "avvisad" : "sparat");
    } catch (err) {
      this.persistQueue();
      const kind = errorKind(err);
      if (kind === "namn") {
        // The name was removed on another device, or the code no longer fits: no retries. The queue stays in the browser.
        this.lost = true;
        this.setStatus("namn-borta");
        this.opts.onNameLost(err as ApiError);
      } else {
        this.setStatus(err instanceof ApiError && err.offline ? "offline" : "fel");
      }
    } finally {
      this.sending = false;
    }
    if (this.hasPending() && !this.lost) this.schedule(this.status === "sparas" ? this.opts.delayMs : this.opts.retryMs, true);
  }

  private apply(id: string, p: Pending): void {
    const old = this.progress.ovningar[id];
    this.progress.ovningar[id] = { kod: p.kod ?? old?.kod ?? "", klar: Boolean(old?.klar) || p.klar === true, tid: p.tid };
  }

  private hasPending(): boolean {
    return Object.keys(this.queue).length > 0 || this.lastLesson !== null;
  }

  /** A new change shows "sparas" (unless the server is known to be out of reach); a retry keeps the status it has. */
  private schedule(ms = this.opts.delayMs, retry = false): void {
    if (this.lost) return;
    if (!retry) this.setStatus(this.status === "offline" ? "offline" : "sparas");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), ms);
  }

  private setStatus(status: SaveStatus): void {
    if (status === this.status) return;
    this.status = status;
    this.opts.onStatus(status);
  }

  private persistQueue(): void {
    try {
      if (this.hasPending()) this.opts.storage?.setItem(this.key, JSON.stringify({ queue: this.queue, last: this.lastLesson }));
      else this.opts.storage?.removeItem(this.key);
    } catch {
      // storage is full or blocked: the queue still works in memory
    }
  }

  private restoreQueue(): void {
    try {
      const raw = this.opts.storage?.getItem(this.key);
      if (!raw) return;
      const saved = JSON.parse(raw) as { queue?: Record<string, Pending>; last?: string | null };
      this.queue = saved.queue ?? {};
      this.lastLesson = saved.last ?? null;
    } catch {
      this.queue = {};
    }
  }

  /** Call when the page is closed or the name is changed. */
  stop(): void {
    clearTimeout(this.timer);
  }
}

function safeStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
