// The page's side of the Python worker: starts it once (loading Pyodide takes a few seconds, so it is started early),
// runs code with a time limit, passes the learner's answers to input(), and replaces the worker when a program is
// stopped or runs too long.
import type { Filer, Ratta } from "../kurs-typer.ts";
import type { Kontroll, KorResultat, StegResultat } from "./engine.ts";

export interface KorValj {
  stdin?: string[];
  /** The lesson's files (docs/skriva-lektioner.md, block `fil`). */
  filer?: Filer;
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
}

type Svar = KorResultat | Kontroll | StegResultat;
const TIMEOUT = { typ: "_Timeout", meddelande: "", rad: null };

export class Koerare {
  private worker: WorkerLike | undefined;
  private klar: Promise<void> | undefined;
  private sab: SharedArrayBuffer | null = null;
  private nastaId = 1;
  private readonly skapa: () => WorkerLike;
  private readonly indexURL: string;
  private pending = new Map<number, { onUtdata?: (t: string) => void; fraga?: () => Promise<string | undefined>; klar: (s: Svar) => void; starta: () => void; stoppa: () => void }>();

  constructor(skapa: () => WorkerLike, indexURL = "/pyodide/") {
    this.skapa = skapa;
    this.indexURL = indexURL;
  }

  /** Starts the worker if it is not running. Call early; resolves when Pyodide is loaded. */
  start(): Promise<void> {
    if (this.klar) return this.klar;
    const w = this.skapa();
    this.worker = w;
    this.sab = typeof SharedArrayBuffer !== "undefined" && globalThis.crossOriginIsolated ? new SharedArrayBuffer(8 + 8192) : null;
    this.klar = new Promise<void>((resolve) => {
      w.onmessage = (ev) => {
        const m = ev.data as { typ: string; id?: number; text?: string; resultat?: Svar };
        if (m.typ === "klar") resolve();
        else if (m.typ === "utdata") this.pending.get(m.id as number)?.onUtdata?.(m.text as string);
        else if (m.typ === "input") void this.svara(m.id as number);
        else if (m.typ === "resultat") this.pending.get(m.id as number)?.klar(m.resultat as Svar);
      };
    });
    w.postMessage({ typ: "start", indexURL: this.indexURL, sab: this.sab });
    return this.klar;
  }

  private async svara(id: number): Promise<void> {
    const p = this.pending.get(id);
    if (!p || !this.sab) return;
    p.stoppa(); // waiting for the learner is not compute time
    const svar = (await p.fraga?.()) ?? undefined;
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
    await this.start();
    const w = this.worker as WorkerLike;
    const id = this.nastaId++;
    return new Promise<T>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let utdata = "";
      const starta = () => {
        timer = setTimeout(() => {
          this.stoppaWorker(); // the program never ended: replace the worker, keep what it printed so far
          resolve((typ === "stega" ? { steg: [], fel: TIMEOUT, avbruten: false } : { utdata, fel: TIMEOUT, ok: false, meddelanden: [] }) as unknown as T);
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
      });
      starta();
      w.postMessage({ typ, id, kod, stdin: v.stdin ?? [], filer: v.filer, ratta });
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

  /** The Stop button and the time limit: the worker is thrown away and a new one starts loading in the background. */
  stoppaWorker(): void {
    this.worker?.terminate();
    this.worker = undefined;
    this.klar = undefined;
    for (const p of this.pending.values()) p.stoppa();
    this.pending.clear();
    void this.start();
  }
}

/** The browser's Koerare, with the real worker. */
export function skapaKoerare(): Koerare {
  return new Koerare(() => new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }) as unknown as WorkerLike);
}
