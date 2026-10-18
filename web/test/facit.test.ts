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

const ovningar = alla().flatMap((l) => uppgifter(l).filter((b) => b.typ === "ovning").map((b) => ({ lektion: l.id, b })));
const forutsagelser = alla().flatMap((l) => uppgifter(l).filter((b) => b.typ === "forutsag").map((b) => ({ lektion: l.id, b })));

describe("every exercise", () => {
  test.each(ovningar.map((o) => [o.b.id, o] as const))("%s: the facit passes, the start code does not", (_id, { b }) => {
    if (b.typ !== "ovning") throw new Error("not an exercise");
    const facit = e.kontrollera(b.facit, b.ratta, { stdin: b.stdin, filer: b.filer });
    expect(facit.fel, `facit runs without error: ${JSON.stringify(facit.fel)}`).toBeNull();
    expect(facit.meddelanden, "facit passes its own rating").toEqual([]);
    expect(facit.ok).toBe(true);
    const start = e.kontrollera(b.start, b.ratta, { stdin: b.stdin, filer: b.filer });
    expect(start.ok, "the start code must not already pass (then there is nothing to do)").toBe(false);
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
});

describe("examples", () => {
  test("every example runs, except those that show an error on purpose", () => {
    const medFel = new Set(["print(Hej)", 'print("Hej)', 'prnt("Hej")', 'print("Hej"']);
    for (const l of alla()) {
      for (const b of l.block) {
        if (b.typ !== "exempel") continue;
        const kod = b.kod.trim();
        const r = e.run(b.kod, { stdin: b.stdin, fragaEfter: () => (b.kod.includes("int(input") ? "30" : "Anna") });
        if (medFel.has(kod)) expect(r.fel, `${l.id}: ${kod} should give an error`).not.toBeNull();
        else expect(r.fel, `${l.id}: ${kod}`).toBeNull();
      }
    }
  });
});
