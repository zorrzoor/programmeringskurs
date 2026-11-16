// The page's side of the Python worker: starts it once (loading Pyodide takes a few seconds, so it is started early),
// runs code with a time limit, passes the learner's answers to input(), and replaces the worker when a program is
// stopped or runs too long.
import type { Filer, Ratta } from "../kurs-typer.ts";
import type { Kontroll, KorResultat, StegResultat } from "./engine.ts";

export interface KorValj {
  stdin?: string[];
  /** The lesson's files (docs/skriva-lektioner.md, block `fil`). */
  filer?: Filer;
  /** The exercise's `krav`, checked in the code when rating. */
  krav?: string[];
  onUtdata?: (text: string) => void;
  /** Shows an input box and resolves with the answer (undefined = cancelled). */
  fraga?: () => Promise<string | undefined>;
  /** Longest compute time (waiting for an answer does not count). */
  tidsgransMs?: number;
}

export interface WorkerLike {
  postMessage(m: unknown): void;
  terminate(): void;
  onmessage: ((e: MessageEvent) => void) | null;
  onerror?: ((e: unknown) => void) | null;
  onmessageerror?: ((e: unknown) => void) | null;
}

type Svar = KorResultat | Kontroll | StegResultat;
const TIMEOUT = { typ: "_Timeout", meddelande: "", rad: null };
/** A job that was waiting for an answer to input() when something else was run (#191). */
const AVBRUTEN = { typ: "_Avbrutet", meddelande: "", rad: null };
/** How long loading Pyodide (about 10 MB) may take before it counts as failed (#192). */
const LADDTID_MS = 120_000;

export class Koerare {
  private worker: WorkerLike | undefined;
  private klar: Promise<void> | undefined;
  private sab: SharedArrayBuffer | null = null;
  private nastaId = 1;
  private readonly skapa: () => WorkerLike;
  private readonly indexURL: string;
  private readonly laddtidMs: number;
  private pending = new Map<
    number,
    {
      onUtdata?: (t: string) => void;
      fraga?: () => Promise<string | undefined>;
      klar: (s: Svar) => void;
      starta: () => void;
      stoppa: () => void;
      /** Ends the job as cancelled, with what it printed so far. */
      avbryt: () => void;
    }
  >();
  /** Jobs whose program is blocked in input(), waiting for the learner. */
  private vantar = new Set<number>();

  constructor(skapa: () => WorkerLike, indexURL = "/pyodide/", laddtidMs = LADDTID_MS) {
    this.skapa = skapa;
    this.indexURL = indexURL;
    this.laddtidMs = laddtidMs;
  }

  /**
   * Starts the worker if it is not running. Call early; resolves when Pyodide is loaded. Rejects when loading fails or takes
   * longer than the load time (#192); the worker is then thrown away, so the next call starts a new one.
   */
  start(): Promise<void> {
    if (this.klar) return this.klar;
    const w = this.skapa();
    this.worker = w;
    this.sab = typeof SharedArrayBuffer !== "undefined" && globalThis.crossOriginIsolated ? new SharedArrayBuffer(8 + 8192) : null;
    const klar = new Promise<void>((resolve, reject) => {
      let laddad = false;
      const misslyckas = (varfor: string) => {
        if (laddad) return;
        laddad = true;
        clearTimeout(timer);
        if (this.worker === w) {
          w.terminate();
          this.worker = undefined;
          this.klar = undefined;
        }
        reject(new Error(`Python kunde inte laddas: ${varfor}`));
      };
      const timer = setTimeout(() => misslyckas("det tog för lång tid"), this.laddtidMs);
      w.onmessage = (ev) => {
        const m = ev.data as { typ: string; id?: number; text?: string; resultat?: Svar };
        if (m.typ === "klar") {
          laddad = true;
          clearTimeout(timer);
          resolve();
        } else if (m.typ === "fel") misslyckas(m.text ?? "okänt fel");
        else if (m.typ === "utdata") this.pending.get(m.id as number)?.onUtdata?.(m.text as string);
        else if (m.typ === "input") void this.svara(m.id as number);
        else if (m.typ === "resultat") this.pending.get(m.id as number)?.klar(m.resultat as Svar);
      };
      w.onerror = () => misslyckas("workern gick inte att starta");
      w.onmessageerror = () => misslyckas("ett meddelande gick inte att läsa");
    });
    klar.catch(() => {}); // a start nobody waits for (after Stop) must not be an unhandled rejection
    this.klar = klar;
    w.postMessage({ typ: "start", indexURL: this.indexURL, sab: this.sab });
    return klar;
  }

  private async svara(id: number): Promise<void> {
    const p = this.pending.get(id);
    if (!p || !this.sab) return;
    p.stoppa(); // waiting for the learner is not compute time
    this.vantar.add(id);
    const svar = (await p.fraga?.()) ?? undefined;
    if (!this.vantar.delete(id)) return; // cancelled meanwhile (another job was started, #191)
    const state = new Int32Array(this.sab, 0, 2);
    if (svar === undefined) Atomics.store(state, 0, 2);
    else {
      const bytes = new TextEncoder().encode(svar).slice(0, 8192);
      new Uint8Array(this.sab, 8).set(bytes);
      Atomics.store(state, 1, bytes.length);
      Atomics.store(state, 0, 1);
    }
    Atomics.notify(state, 0);
    p.starta();
  }

  private async jobb<T extends Svar>(typ: "kor" | "kontrollera" | "stega", kod: string, ratta: Ratta | undefined, v: KorValj): Promise<T> {
    // A program blocked in input() would hold up this job until the time limit (#191): cancel it first.
    if (this.vantar.size > 0) this.stoppaWorker();
    await this.start();
    const w = this.worker as WorkerLike;
    const id = this.nastaId++;
    return new Promise<T>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let utdata = "";
      const starta = () => {
        timer = setTimeout(() => {
          // The program never ended: this job ends as too slow (not as cancelled), then the worker is replaced. What it
          // printed so far is kept.
          this.pending.delete(id);
          this.vantar.delete(id);
          resolve((typ === "stega" ? { steg: [], fel: TIMEOUT, avbruten: false } : { utdata, fel: TIMEOUT, ok: false, meddelanden: [] }) as unknown as T);
          this.stoppaWorker();
        }, v.tidsgransMs ?? 10_000);
      };
      const stoppa = () => clearTimeout(timer);
      this.pending.set(id, {
        onUtdata: (t) => {
          utdata += t;
          v.onUtdata?.(t);
        },
        fraga: v.fraga,
        klar: (s) => {
          stoppa();
          this.pending.delete(id);
          resolve(s as T);
        },
        starta,
        stoppa,
        avbryt: () => {
          stoppa();
          this.pending.delete(id);
          resolve((typ === "stega" ? { steg: [], fel: AVBRUTEN, avbruten: false } : { utdata, fel: AVBRUTEN, ok: false, meddelanden: [] }) as unknown as T);
        },
      });
      starta();
      w.postMessage({ typ, id, kod, stdin: v.stdin ?? [], filer: v.filer, krav: v.krav, ratta });
    });
  }

  kor(kod: string, v: KorValj = {}): Promise<KorResultat> {
    return this.jobb<KorResultat>("kor", kod, undefined, v);
  }

  stega(kod: string, v: KorValj = {}): Promise<StegResultat> {
    return this.jobb<StegResultat>("stega", kod, undefined, v);
  }

  kontrollera(kod: string, ratta: Ratta, v: KorValj = {}): Promise<Kontroll> {
    return this.jobb<Kontroll>("kontrollera", kod, ratta, v);
  }

  /**
   * The Stop button, the time limit and a job started while another waits for input(): the worker is thrown away, every job
   * still running ends as cancelled (so its block's buttons are reset, #191), and a new worker starts loading.
   */
  stoppaWorker(): void {
    this.worker?.terminate();
    this.worker = undefined;
    this.klar = undefined;
    this.vantar.clear();
    for (const p of [...this.pending.values()]) p.avbryt();
    this.pending.clear();
    void this.start();
  }

  /** The lesson page is replaced: stop what is still running there, if anything (#191). */
  avbryt(): void {
    if (this.pending.size > 0) this.stoppaWorker();
  }
}

/** The browser's Koerare, with the real worker. */
export function skapaKoerare(): Koerare {
  return new Koerare(() => new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }) as unknown as WorkerLike);
}
