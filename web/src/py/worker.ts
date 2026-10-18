// The Web Worker that owns Pyodide, so that the page stays responsive and a program that never ends can be stopped by
// terminating the worker. Messages in: start, kor, kontrollera. Out: klar, utdata, input, resultat.
// input(): the worker blocks on a SharedArrayBuffer until the page has the learner's answer (needs cross-origin
// isolation, which the server sets with COOP and COEP headers).
import type { Filer, Ratta } from "../kurs-typer.ts";
import { PyEngine, type PyodideLite } from "./engine.ts";

interface Start {
  typ: "start";
  indexURL: string;
  sab: SharedArrayBuffer | null;
}
interface Jobb {
  typ: "kor" | "kontrollera" | "stega";
  id: number;
  kod: string;
  stdin: string[];
  filer?: Filer;
  ratta?: Ratta;
}

const scope = self as unknown as {
  postMessage(m: unknown): void;
  onmessage: ((e: MessageEvent<Start | Jobb>) => void) | null;
};
let engine: PyEngine | undefined;
let state: Int32Array | undefined; // [0] 0 waiting, 1 answered, 2 no answer; [1] length of the answer
let text: Uint8Array | undefined;
let aktuell = 0;

function fraga(): string | undefined {
  if (!state || !text) return undefined; // no isolation: input() gets an EOFError
  Atomics.store(state, 0, 0);
  scope.postMessage({ typ: "input", id: aktuell });
  Atomics.wait(state, 0, 0);
  if (Atomics.load(state, 0) !== 1) return undefined;
  return new TextDecoder().decode(text.slice(0, Atomics.load(state, 1)));
}

scope.onmessage = async (ev) => {
  const m = ev.data;
  if (m.typ === "start") {
    if (m.sab) {
      state = new Int32Array(m.sab, 0, 2);
      text = new Uint8Array(m.sab, 8);
    }
    const { loadPyodide } = (await import(/* @vite-ignore */ `${m.indexURL}pyodide.mjs`)) as { loadPyodide: (o: { indexURL: string }) => Promise<unknown> };
    engine = new PyEngine((await loadPyodide({ indexURL: m.indexURL })) as PyodideLite);
    scope.postMessage({ typ: "klar" });
    return;
  }
  if (!engine) return;
  aktuell = m.id;
  const alt = { stdin: m.stdin, filer: m.filer, fragaEfter: fraga, onUtdata: (s: string) => scope.postMessage({ typ: "utdata", id: m.id, text: s }) };
  if (m.typ === "kor") scope.postMessage({ typ: "resultat", id: m.id, resultat: engine.run(m.kod, alt) });
  else if (m.typ === "stega") scope.postMessage({ typ: "resultat", id: m.id, resultat: engine.stega(m.kod, alt) });
  else scope.postMessage({ typ: "resultat", id: m.id, resultat: engine.kontrollera(m.kod, m.ratta as Ratta, alt) });
};
