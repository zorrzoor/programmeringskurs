// @vitest-environment node
// Course quality (#9): every exercise's facit passes its own rating, its start code does not, and the free-text
// predictions are what the program really prints. Real Pyodide, the same engine as in the browser.
import { loadPyodide } from "pyodide";
import { beforeAll, describe, expect, test } from "vitest";
import { alla, uppgifter } from "../src/kurs.ts";
import { PyEngine, type PyodideLite } from "../src/py/engine.ts";
import { normalisera } from "../src/py/rattning.ts";

let e: PyEngine;
beforeAll(async () => {
  e = new PyEngine((await loadPyodide()) as unknown as PyodideLite);
}, 60_000);

// #204: printing a given text (or writing a comment) is the task itself.
const LISTA_UTSKRIFT: string[] = [
  "m0-forsta-program-tva", "m0-forsta-program-tre", "m1-print-tre-rader",
  "m1-print-tom-rad", "m1-kommentar-skriv-egen",
];
// #204: not converted yet (83 exercises, follow-up issue). Remove an id when its exercise gets `fall` or `krav`;
// the second test fails until it is removed, so the list can only shrink.
const LISTA_INTE_KLARA: string[] = [
  "m2-andra-lon", "m2-andra-dubbla", "m2-tal-text-rakna", "m2-input-hej",
  "m2-input-alder", "m5-listor-andra", "m5-listor-antal", "m5-andra-lagg-till",
  "m5-andra-sortera", "m5-andra-finns", "m5-uppslag-andra", "m5-poster-namn-over",
  "m5-poster-totalpris", "m5-unika-antal", "m5-unika-lista", "m5-unika-ordning",
  "m5-delar-forsta", "m5-delar-storsta", "m5-delar-minsta", "m5-gruppera-skriv",
  "m5-gruppera-minst", "m5-gruppera-antal", "m5-blandat-storst", "m5-blandat-ordrakning",
  "m5-blandat-medelvarde", "m7-lasa-antal-rader", "m7-lasa-hej", "m7-csv-varor",
  "m7-csv-antal-delar", "m7-rakna-te", "m7-rakna-dyraste", "m7-rakna-medelpris",
  "m7-grupp-omsattning", "m7-grupp-basta", "m7-grupp-sorterat", "m7-diagram-omsattning",
  "m7-diagram-enheter", "m7-topp-rangordning", "m7-topp-sist", "m7-topp-tva",
  "m7-sv-medel", "m7-sv-hoga", "m7-blandat-per-kund", "m7-blandat-diagram",
  "m8-select-kolumner", "m8-select-distinct", "m8-where-billiga", "m8-where-och",
  "m8-where-like", "m8-sortera-namn", "m8-sortera-dyrast", "m8-sortera-billigaste",
  "m8-grupp-summa", "m8-grupp-medel", "m8-grupp-having", "m8-join-omsattning",
  "m8-join-kategori", "m8-join-manga", "m8-blandat-antal-drycker", "m8-blandat-dyraste-bakverk",
  "m8-blandat-total", "m9-budget-total", "m9-budget-rapport", "m9-budget-hela",
  "m9-fraga-en", "m9-fraga-alla", "m9-rapport-total", "m9-rapport-per-projekt",
  "m9-rapport-diagram", "m10-counter-antal", "m10-counter-vanligaste", "m10-text-antal-ord",
  "m10-text-titel", "m10-datum-dagar", "m10-datum-framat", "m10-slump-tarning",
  "m10-slump-val", "m10-slump-fem", "m10-slump-blanda", "m10-regex-summa",
  "m10-regex-mellanslag", "m10-blandat-vanligast", "m10-blandat-dagar",
];

const ovningar = alla().flatMap((l) => uppgifter(l).filter((b) => b.typ === "ovning").map((b) => ({ lektion: l.id, b })));
const forutsagelser = alla().flatMap((l) => uppgifter(l).filter((b) => b.typ === "forutsag").map((b) => ({ lektion: l.id, b })));

describe("every exercise", () => {
  test.each(ovningar.map((o) => [o.b.id, o] as const))("%s: the facit passes, the start code does not", (_id, { b }) => {
    if (b.typ !== "ovning") throw new Error("not an exercise");
    const facit = e.kontrollera(b.facit, b.ratta, { stdin: b.stdin, filer: b.filer, krav: b.krav });
    expect(facit.fel, `facit runs without error: ${JSON.stringify(facit.fel)}`).toBeNull();
    expect(facit.meddelanden, "facit passes its own rating").toEqual([]);
    expect(facit.ok).toBe(true);
    const start = e.kontrollera(b.start, b.ratta, { stdin: b.stdin, filer: b.filer });
    expect(start.ok, "the start code must not already pass (then there is nothing to do)").toBe(false);
  });

  // #204: an exercise rated on its output must not pass a program that only prints the answer (the start code kept, so
  // its variables exist). That takes several cases (`fall`) or a `krav`. Exceptions, each with its reason:
  // UTSKRIFT_AR_UPPGIFTEN: printing a given text is the task itself. INTE_KLARA: not converted yet (#204), may only shrink.
  const UTSKRIFT_AR_UPPGIFTEN = new Set<string>(LISTA_UTSKRIFT);
  const INTE_KLARA = new Set<string>(LISTA_INTE_KLARA);
  test("a program that only prints the answer does not pass (#204)", () => {
    const godkanda: string[] = [];
    for (const { b } of ovningar) {
      if (b.typ !== "ovning" || b.ratta.typ !== "utdata" || UTSKRIFT_AR_UPPGIFTEN.has(b.id) || INTE_KLARA.has(b.id)) continue;
      const rader = normalisera(b.ratta.forvantat, false);
      const fusk = `${b.start}\n${rader.map((r) => `print(${JSON.stringify(r)})`).join("\n")}\n`;
      const k = e.kontrollera(fusk, b.ratta, { stdin: b.stdin, filer: b.filer, krav: b.krav });
      if (k.ok) godkanda.push(b.id);
    }
    expect(godkanda, "these pass by printing the answer: add `fall` or `krav`").toEqual([]);
  });

  test("a case that fails says which values and what was expected (#204)", () => {
    const b = ovningar.find((o) => o.b.id === "m3-else-betyg")?.b;
    if (b?.typ !== "ovning") throw new Error("m3-else-betyg");
    const k = e.kontrollera(`${b.start}\nprint("Underkänd")\n`, b.ratta, {});
    expect(k.ok).toBe(false);
    expect(k.meddelanden.join(" ")).toContain("när `betyg` är `75` ska utskriften vara `Godkänd`, men programmet skrev `Underkänd`");
    // A name the code never assigns is set first, so a program that ignores the variable fails too.
    expect(e.kontrollera('print("Underkänd")\n', b.ratta, {}).ok).toBe(false);
  });

  test("the lists of exceptions only name exercises that exist and still need it (#204)", () => {
    const ids = new Set(ovningar.map((o) => o.b.id));
    for (const id of [...UTSKRIFT_AR_UPPGIFTEN, ...INTE_KLARA]) expect(ids.has(id), `${id} is not an exercise`).toBe(true);
    for (const { b } of ovningar) {
      if (b.typ !== "ovning" || b.ratta.typ !== "utdata" || !INTE_KLARA.has(b.id)) continue;
      const fusk = `${b.start}\n${normalisera(b.ratta.forvantat, false).map((r) => `print(${JSON.stringify(r)})`).join("\n")}\n`;
      expect(e.kontrollera(fusk, b.ratta, { stdin: b.stdin, filer: b.filer, krav: b.krav }).ok, `${b.id} is fixed: remove it from INTE_KLARA`).toBe(true);
    }
  });

  test("each exercise has a task text and three real hints", () => {
    for (const { b } of ovningar) {
      if (b.typ !== "ovning") continue;
      expect(b.uppgift.length).toBeGreaterThan(10);
      expect(b.ledtradar.every((h) => h.trim().length > 5)).toBe(true);
    }
  });
});

describe("every prediction with running code", () => {
  const freetext = forutsagelser.filter((f) => f.b.typ === "forutsag" && f.b.kor && f.b.alternativ.length === 0);
  test.each(freetext.map((f) => [f.b.id, f] as const))("%s: the answer is what the program prints", (_id, { b }) => {
    if (b.typ !== "forutsag") throw new Error("not a prediction");
    const r = e.run(b.kod, { stdin: b.stdin, filer: b.filer });
    expect(r.fel).toBeNull();
    expect(normalisera(r.utdata, true).join("\n")).toBe(normalisera(b.svar, true).join("\n"));
  });

  // Predictions that show an error on purpose.
  const GER_FEL = new Set(["m1-ditt-forsta-felmeddelande-f1"]);
  test("the code of a prediction that is run never gives an error, except the ones about errors", () => {
    for (const { b } of forutsagelser) {
      if (b.typ !== "forutsag" || !b.kor || GER_FEL.has(b.id)) continue;
      expect(e.run(b.kod, { stdin: b.stdin, filer: b.filer }).fel, `${b.id}: ${b.kod}`).toBeNull();
    }
  });

  test("multiple choice answers are within range", () => {
    for (const { b } of forutsagelser) {
      if (b.typ === "forutsag" && b.alternativ.length > 0) expect(b.ratt).toBeLessThan(b.alternativ.length);
    }
  });

  // #202: a multiple choice question whose program prints one line must mark that line as right, when it is among the
  // alternatives; and a right alternative that looks like output (one line, no description) must be what is printed.
  // Alternatives that describe the output instead of quoting it are listed here.
  const BESKRIVANDE = /^(Ett felmeddelande|Inget|Ingenting|.* på varsin rad|.*(skrivs|blir|ger|händer|fel|rader|gånger).*)$/i;
  test("a multiple choice question that runs marks what the program really prints (#202)", () => {
    const fel: string[] = [];
    for (const { b } of forutsagelser) {
      if (b.typ !== "forutsag" || !b.kor || b.alternativ.length === 0) continue;
      const r = e.run(b.kod, { stdin: b.stdin, filer: b.filer });
      const rader = normalisera(r.utdata, true);
      if (r.fel || rader.length !== 1) continue;
      const utskrift = rader[0] as string;
      const ratt = b.alternativ[b.ratt] as string;
      const finns = b.alternativ.findIndex((a) => normalisera(a, true).join("\n") === utskrift);
      if (finns >= 0 && finns !== b.ratt) fel.push(`${b.id}: prints "${utskrift}", which is alternative ${finns}, not ${b.ratt}`);
      else if (finns < 0 && !BESKRIVANDE.test(ratt)) fel.push(`${b.id}: prints "${utskrift}", but the right alternative is "${ratt}"`);
    }
    expect(fel).toEqual([]);
  });
});

describe("examples", () => {
  test("every example runs, except those that show an error on purpose", () => {
    const medFel = new Set(["print(Hej)", 'print("Hej)', 'prnt("Hej")', 'print("Hej"']);
    for (const l of alla()) {
      for (const b of l.block) {
        if (b.typ !== "exempel") continue;
        const kod = b.kod.trim();
        const r = e.run(b.kod, { stdin: b.stdin, filer: b.filer, fragaEfter: () => (b.kod.includes("int(input") ? "30" : "Anna") });
        if (medFel.has(kod)) expect(r.fel, `${l.id}: ${kod} should give an error`).not.toBeNull();
        else expect(r.fel, `${l.id}: ${kod}`).toBeNull();
      }
    }
  });
});
