// Progress for one name, saved to the server as it changes. A change is first kept in memory and in the
// browser (so nothing is lost without a network), then sent. When the server cannot be reached the
// changes stay queued and are sent again later (timer and the browser's "online" event).
import { Api, ApiError, type Exercise, type Progress } from "./api.ts";

export type SaveStatus = "sparat" | "sparas" | "offline" | "fel";

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

  constructor(api: Api, name: string, opts: SyncOptions = {}) {
    this.api = api;
    this.name = name;
    this.opts = {
      delayMs: opts.delayMs ?? 800,
      retryMs: opts.retryMs ?? 15_000,
      now: opts.now ?? Date.now,
      storage: opts.storage ?? safeStorage(),
      onStatus: opts.onStatus ?? (() => {}),
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
    if (this.sending) return;
    this.sending = true;
    clearTimeout(this.timer);
    try {
      for (const [id, p] of Object.entries(this.queue)) {
        const saved = await this.api.saveExercise(this.name, id, p);
        this.progress.ovningar[id] = saved;
        if (this.queue[id] === p) delete this.queue[id]; // not changed again while it was being sent
      }
      if (this.lastLesson) {
        await this.api.saveLastLesson(this.name, this.lastLesson);
        this.lastLesson = null;
      }
      this.persistQueue();
      this.setStatus(this.hasPending() ? "sparas" : "sparat");
    } catch (err) {
      this.setStatus(err instanceof ApiError && err.offline ? "offline" : "fel");
    } finally {
      this.sending = false;
    }
    if (this.hasPending()) this.schedule(this.status === "sparas" ? this.opts.delayMs : this.opts.retryMs, true);
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
