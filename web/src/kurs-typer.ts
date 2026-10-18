// The course as the build script (scripts/build-content.ts) writes it to web/src/generated/kurs.json, and as the site
// reads it. Types only: no runtime code, so that both Node and the browser bundle can import them.

/** How an exercise is checked: by behaviour, never by the exact code (docs/koncept.md §7). */
export type Ratta =
  | { typ: "utdata"; forvantat: string; ignoreraVersaler: boolean }
  | { typ: "variabler"; forvantat: Record<string, unknown> }
  | { typ: "funktion"; namn: string; tester: { indata: unknown[]; svar: unknown }[] }
  /** A file the program must have written: its content is compared line by line like output. */
  | { typ: "fil"; namn: string; forvantat: string };

/** Files a lesson shows (block `fil`), by name: placed in the program's working directory before every run. */
export type Filer = Record<string, string>;

export type Block =
  | { typ: "text"; markdown: string }
  | { typ: "fil"; namn: string; innehall: string }
  | { typ: "exempel"; kod: string; stdin: string[]; filer?: Filer }
  | {
      typ: "forutsag";
      id: string;
      kod: string;
      /** False when the code is pseudo-code that Python cannot run: then there is no "run it" button. */
      kor: boolean;
      stdin: string[];
      filer?: Filer;
      /** Multiple choice: the alternatives and the index of the right one. Otherwise a free-text answer in `svar`. */
      alternativ: string[];
      ratt: number;
      svar: string;
      forklaring: string;
    }
  | {
      typ: "ovning";
      id: string;
      uppgift: string;
      start: string;
      stdin: string[];
      filer?: Filer;
      ratta: Ratta;
      ledtradar: [string, string, string];
      facit: string;
    }
  | { typ: "ruta"; rubrik: string; markdown: string };

export interface Lektion {
  id: string;
  titel: string;
  mal: string;
  modul: number;
  nr: number;
  /** Realistic time for a beginner, in minutes (a multiple of 5): calculated by the build, or `tid` in the front matter. */
  minuter: number;
  block: Block[];
}

export interface Modul {
  id: number;
  titel: string;
  beskrivning: string;
  /** What the module is compared with from Office and databases. */
  kopplas: string;
  lektioner: Lektion[];
}

export interface Kurs {
  moduler: Modul[];
}
