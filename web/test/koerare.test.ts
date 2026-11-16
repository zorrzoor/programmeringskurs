import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Koerare, type WorkerLike } from "../src/py/koerare.ts";

class FakeWorker implements WorkerLike {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  onmessageerror: ((e: unknown) => void) | null = null;
  sent: Record<string, unknown>[] = [];
  terminated = false;
  autoStart = true;
  postMessage(m: Record<string, unknown>): void {
    this.sent.push(m);
    if (m.typ === "start" && this.autoStart) queueMicrotask(() => this.say({ typ: "klar" }));
  }
  terminate(): void {
    this.terminated = true;
  }
  say(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent);
  }
}

let workers: FakeWorker[];
let k: Koerare;
beforeEach(() => {
  workers = [];
  k = new Koerare(() => {
    const w = new FakeWorker();
    workers.push(w);
    return w;
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Koerare", () => {
  test("start once, run code, stream output and get the result", async () => {
    const chunks: string[] = [];
    const p = k.kor("print(1)", { onUtdata: (t) => chunks.push(t), stdin: ["a"] });
    await k.start();
    expect(workers).toHaveLength(1);
    const job = workers[0]?.sent.find((m) => m.typ === "kor") as { id: number; kod: string; stdin: string[] };
    expect(job).toMatchObject({ kod: "print(1)", stdin: ["a"] });
    workers[0]?.say({ typ: "utdata", id: job.id, text: "1\n" });
    workers[0]?.say({ typ: "resultat", id: job.id, resultat: { utdata: "1\n", fel: null } });
    expect(await p).toEqual({ utdata: "1\n", fel: null });
    expect(chunks).toEqual(["1\n"]);
    void k.kor("x");
    await Promise.resolve();
    expect(workers).toHaveLength(1); // the same worker is reused
  });

  test("results are routed by job id", async () => {
    const a = k.kor("a");
    const b = k.kontrollera("b", { typ: "utdata", forvantat: "1", ignoreraVersaler: false });
    await k.start();
    await Promise.resolve();
    const sent = workers[0]?.sent.filter((m) => m.typ !== "start") as { id: number; typ: string }[];
    expect(sent.map((m) => m.typ)).toEqual(["kor", "kontrollera"]);
    workers[0]?.say({ typ: "resultat", id: sent[1]?.id, resultat: { ok: true, meddelanden: [], utdata: "", fel: null } });
    workers[0]?.say({ typ: "resultat", id: sent[0]?.id, resultat: { utdata: "A", fel: null } });
    expect(await a).toEqual({ utdata: "A", fel: null });
    expect(await b).toMatchObject({ ok: true });
  });

  test("a program that runs too long is stopped, the worker replaced and the output so far kept", async () => {
    vi.useFakeTimers();
    const p = k.kor("while True: pass", { tidsgransMs: 5000 });
    await vi.advanceTimersByTimeAsync(0);
    const job = workers[0]?.sent.find((m) => m.typ === "kor") as { id: number };
    workers[0]?.say({ typ: "utdata", id: job.id, text: "x" });
    await vi.advanceTimersByTimeAsync(5001);
    const r = await p;
    expect(r.fel?.typ).toBe("_Timeout");
    expect(r.utdata).toBe("x");
    expect(workers[0]?.terminated).toBe(true);
    expect(workers).toHaveLength(2); // a new worker is already loading
  });

  test("the stop button replaces the worker", async () => {
    await k.start();
    k.stoppaWorker();
    expect(workers[0]?.terminated).toBe(true);
    await vi.waitFor(() => expect(workers).toHaveLength(2));
  });

  describe("a program waiting for input() (#191)", () => {
    test("a new job cancels the one that waits for an answer; both promises end", async () => {
      vi.stubGlobal("crossOriginIsolated", true); // input() needs the shared buffer, as in the browser
      let svara: (s: string | undefined) => void = () => {};
      const a = k.kor("input()", { fraga: () => new Promise((r) => (svara = r)) });
      await k.start();
      await Promise.resolve();
      const jobA = workers[0]?.sent.find((m) => m.typ === "kor") as { id: number };
      workers[0]?.say({ typ: "utdata", id: jobA.id, text: "Vad heter du? " });
      workers[0]?.say({ typ: "input", id: jobA.id });
      await Promise.resolve();
      const b = k.kor("print(2)");
      const ra = await a;
      expect(ra.fel?.typ).toBe("_Avbrutet");
      expect(ra.utdata).toBe("Vad heter du? ");
      expect(workers[0]?.terminated).toBe(true);
      await vi.waitFor(() => expect(workers[1]?.sent.some((m) => m.typ === "kor")).toBe(true));
      const jobB = workers[1]?.sent.find((m) => m.typ === "kor") as { id: number };
      workers[1]?.say({ typ: "resultat", id: jobB.id, resultat: { utdata: "2\n", fel: null } });
      expect(await b).toEqual({ utdata: "2\n", fel: null });
      svara("sent"); // the learner answers the old box afterwards: nothing happens
    });

    test("Stop ends every running job (its block is reset), and avbryt() does nothing when idle", async () => {
      const a = k.kor("while True: pass");
      await k.start();
      await Promise.resolve();
      k.avbryt();
      expect((await a).fel?.typ).toBe("_Avbrutet");
      const before = workers.length;
      await vi.waitFor(() => expect(workers).toHaveLength(2));
      await k.start();
      k.avbryt(); // nothing running: the loaded worker is kept
      expect(workers).toHaveLength(Math.max(before, 2));
      expect(workers[1]?.terminated).toBe(false);
    });
  });

  describe("loading Python fails (#192)", () => {
    test("the worker reports an error: start rejects and the next start makes a new worker", async () => {
      k = new Koerare(() => {
        const w = new FakeWorker();
        w.autoStart = false;
        workers.push(w);
        return w;
      });
      const p = k.start();
      workers[0]?.say({ typ: "fel", text: "TypeError: Failed to fetch" });
      await expect(p).rejects.toThrow(/kunde inte laddas/);
      expect(workers[0]?.terminated).toBe(true);
      const again = k.start();
      expect(workers).toHaveLength(2);
      workers[1]?.say({ typ: "klar" });
      await expect(again).resolves.toBeUndefined();
    });

    test("a worker that never answers counts as failed after the load time", async () => {
      vi.useFakeTimers();
      k = new Koerare(
        () => {
          const w = new FakeWorker();
          w.autoStart = false;
          workers.push(w);
          return w;
        },
        "/pyodide/",
        30_000,
      );
      const job = k.kor("print(1)");
      const failed = expect(job).rejects.toThrow(/för lång tid/);
      await vi.advanceTimersByTimeAsync(30_001);
      await failed;
    });

    test("an error event from the worker (the script could not be loaded) also rejects", async () => {
      k = new Koerare(() => {
        const w = new FakeWorker();
        w.autoStart = false;
        workers.push(w);
        return w;
      });
      const p = k.start();
      workers[0]?.onerror?.(new Event("error"));
      await expect(p).rejects.toThrow(/kunde inte laddas/);
    });
  });
});
