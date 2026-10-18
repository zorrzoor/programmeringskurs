// Runs learner code in Pyodide and checks exercises. Pyodide itself is passed in (a worker in the browser, the npm
// package in Node tests), so everything here is the same in both places.
import type { Ratta } from "../kurs-typer.ts";
import { type PyFel } from "./felmeddelanden.ts";
import { PYTHON_KOD } from "./python-kod.ts";
import { jamforUtdata, jamforVariabel } from "./rattning.ts";

/** The part of Pyodide that the engine uses (so a test can pass a fake). */
export interface PyodideLite {
  runPython(code: string): unknown;
  globals: { get(name: string): (...args: unknown[]) => string };
  setStdin(opts: { stdin: () => string | undefined }): void;
}

export interface KorAlternativ {
  /** Answers for input(), used first. */
  stdin?: string[];
  /** Asked when stdin has run out: the browser asks the learner, a test gives nothing (an EOFError). */
  fragaEfter?: (prompt?: string) => string | undefined;
  onUtdata?: (text: string) => void;
  /** Most characters a program may print. */
  grans?: number;
}

export interface KorResultat {
  utdata: string;
  fel: PyFel | null;
}

/** One step of the step-by-step view: the row about to run, the variables as they are now, and the output so far. */
export interface Steg {
  /** null for the last step: the program has ended and this is how it ended up. */
  rad: number | null;
  variabler: [string, string][];
  utdata: string;
  /** The function the row is in, or null at the top level. */
  funktion: string | null;
}

export interface StegResultat {
  steg: Steg[];
  fel: PyFel | null;
  /** The program took more steps than the limit: the first ones are shown. */
  avbruten: boolean;
}

export interface Kontroll {
  ok: boolean;
  /** What to tell the learner. Empty when everything was right. */
  meddelanden: string[];
  utdata: string;
  fel: PyFel | null;
}

export class PyEngine {
  private readonly py: PyodideLite;

  constructor(py: PyodideLite) {
    this.py = py;
    py.runPython(PYTHON_KOD);
  }

  private fn(name: string) {
    return this.py.globals.get(name);
  }

  run(kod: string, alt: KorAlternativ = {}): KorResultat {
    const rader = [...(alt.stdin ?? [])];
    this.py.setStdin({ stdin: () => (rader.length > 0 ? rader.shift() : alt.fragaEfter?.()) });
    let utdata = "";
    const cb = (s: string) => {
      utdata += s;
      alt.onUtdata?.(s);
    };
    const svar = JSON.parse(this.fn("_kor")(kod, cb, alt.grans ?? 20000)) as { fel: PyFel | null };
    return { utdata, fel: svar.fel };
  }

  /** Runs the code while recording every row that is executed (at most `maxSteg`). */
  stega(kod: string, alt: KorAlternativ & { maxSteg?: number } = {}): StegResultat {
    const rader = [...(alt.stdin ?? [])];
    this.py.setStdin({ stdin: () => (rader.length > 0 ? rader.shift() : alt.fragaEfter?.()) });
    const cb = (s: string) => alt.onUtdata?.(s);
    return JSON.parse(this.fn("_stega")(kod, cb, alt.grans ?? 20000, alt.maxSteg ?? 500)) as StegResultat;
  }

  /** Runs the code and rates it against the exercise's rule. */
  kontrollera(kod: string, ratta: Ratta, alt: KorAlternativ = {}): Kontroll {
    const k = this.run(kod, alt);
    if (k.fel) return { ok: false, meddelanden: [], utdata: k.utdata, fel: k.fel };
    let meddelanden: string[] = [];
    if (ratta.typ === "utdata") {
      meddelanden = jamforUtdata(k.utdata, ratta.forvantat, ratta.ignoreraVersaler);
    } else if (ratta.typ === "variabler") {
      for (const [namn, forvantat] of Object.entries(ratta.forvantat)) {
        const svar = JSON.parse(this.fn("_variabel")(namn, JSON.stringify(forvantat))) as { finns: boolean; lika: boolean; faktisk: string };
        meddelanden.push(...jamforVariabel(namn, svar, forvantat));
      }
    } else {
      for (const t of ratta.tester) {
        const svar = JSON.parse(this.fn("_funktion")(ratta.namn, JSON.stringify(t.indata), JSON.stringify(t.svar))) as {
          finns: boolean;
          lika: boolean;
          faktisk: string;
          fel: PyFel | null;
        };
        const anrop = `${ratta.namn}(${t.indata.map((x) => JSON.stringify(x)).join(", ")})`;
        if (!svar.finns) {
          meddelanden.push(`Funktionen \`${ratta.namn}\` finns inte. Har du skrivit \`def ${ratta.namn}(...)\`?`);
          break;
        }
        if (svar.fel) meddelanden.push(`\`${anrop}\` gav felet ${svar.fel.typ}: ${svar.fel.meddelande}.`);
        else if (!svar.lika) meddelanden.push(`\`${anrop}\` gav \`${svar.faktisk}\`, men det ska bli \`${JSON.stringify(t.svar)}\`.`);
      }
    }
    return { ok: meddelanden.length === 0, meddelanden, utdata: k.utdata, fel: null };
  }
}
